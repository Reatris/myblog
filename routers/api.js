var express = require("express");
var router = express.Router();
var db = require('../db/db.js');
var check = require('./checkJSP')
var checkifhavefriend = require('./checkifhavefriend')

//统一返回给前端的数据格式
var resdata;
router.use(function (req, res, next) {
  resdata = {
    code: 0,
    message: ""
  };
  next();
});
//注册
router.post("/user/register", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;
  //jsp验证
  var check_username = check(username)
  var check_password = check(password)
  var check_repassword = check(repassword)
  if (check_username || check_password || check_repassword) {
    resdata.code = 1;
    resdata.message = "输入了非法字符!";
    res.json(resdata);
    return;
  }
  //头像上传
  var img_traned = req.body.img_traned;
  if (img_traned == "") {
    resdata.code = 1;
    resdata.message = "请上传头像";
    res.json(resdata);
    return;
  }
  if (username == "") {
    resdata.code = 1;
    resdata.message = "用户名不能为空！";
    res.json(resdata);
    return;
  }
  if (password == "") {
    resdata.code = 2;
    resdata.message = "密码不能为空！";
    res.json(resdata);
    return;
  }
  if (password != repassword) {
    resdata.code = 3;
    resdata.message = "两次输入的密码不一致！";
    res.json(resdata);
    return;
  }
  db.sql(("select * from Users where Username =" + "\'" + username + "\'"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    if (result) {
      isnull = result.recordset.length
      if (isnull > 0) {
        resdata.code = 4;
        resdata.message = "该用户已被注册！";
        res.json(resdata);
        return false;
      } else {
        username = username,
          password = password,
          Isadmin = false
        db.sql(("insert into Users(Username,Password,Isadmin) values (\'" + username + "\',\'" + password + "\',\'" + Isadmin + "\')"), function (err, result) {
          if (err) {
            console.log(err);
            return;
          }
          if (result) {
            db.sql(("insert into Picture(Username,Img) values (\'" + username + "\',\'" + img_traned + "\')"), function (err, result) {
              if (err) {
                console.log(err);
                return;
              }
              if (result) {
                resdata.message = "注册成功！";
                res.json(resdata);
              }
            })
          }
        })
      }
    }
  })
});
//登录
router.post("/user/login", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;

  //jsp验证
  var check_username = check(username)
  var check_password = check(password)
  if (check_username || check_password) {
    resdata.code = 1;
    resdata.message = "输入了非法字符!";
    res.json(resdata);
    return;
  }
  if (username == "" || password == "") {
    resdata.code = 1;
    resdata.message = "用户名和密码不能为空！";
    res.json(resdata);
    return;
  }
  db.sql(("with r as( SELECT a.Friends,b.Username,b.Id,b.Password,b.Isadmin FROM Users as b LEFT JOIN Friend as a ON a.Username=b.Username)select * from r WHERE Username=\'" + username + "\'"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      isnull = result.recordset.length
      if (isnull > 0) {
        //console.info('inputps='+password)
        //console.info('getps='+result.recordset[0].Password)
        if (result.recordset[0].Password == password) {
          id = result.recordset[0].Id
          username = result.recordset[0].Username
          Isadmin = result.recordset[0].Isadmin
          Friends = result.recordset[0].Friends
          //获取头像
          db.sql(("select * from Picture where Username =" + "\'" + username + "\'"), function (err, result) {
            if (err) {
              console.log(err);
              return;
            }
            if (result) {
              resdata.message = "登录成功！";
              resdata.Img = result.recordset[0].Img

              //img太大，用localStorage保存
              // window.localStorage.clear() 
              // window.localStorage.setItem('user_header_photo',user_header_photo); 
              resdata.userinfo = {
                id: id,
                username: username,
                Isadmin: Isadmin,
                Friends: Friends
              };
              //保存cookic
              req.cookies.set(
                "userInfo",
                JSON.stringify({
                  id: resdata.userinfo.id,
                  username: resdata.userinfo.username,
                  Isadmin: resdata.userinfo.Isadmin,
                  Friends: resdata.userinfo.Friends
                })
              );
              res.json(resdata);
            }
          })
        } else {
          resdata.code = 2;
          resdata.message = "密码错误！";
          res.json(resdata);
          return false;
        }
      } else {
        resdata.code = 2;
        resdata.message = "用户不存在!";
        res.json(resdata);
        return false;
      }
    }
  })
});
//登出
router.get("/user/logout", function (req, res) {
  req.cookies.set("userInfo", null);
  res.message = "退出成功！";
  res.json(resdata);
});

router.get("/pinglun", function (req, res) {
  var contentid = req.query.contentid || "";
  if (contentid) {
    db.sql(('select * from Commits where Contentid=' + contentid), function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      if (result) {
        resdata.postdata = result.recordset
        res.json(resdata);
      }
    })
  } else {

    resdata.postdata = [{
      message: '获取失败'
    }]
    res.json(resdata);
  }
})

//发表品论
router.post("/comment", function (req, res) {
  var Username = req.body.Username
  var contentid = req.body.contentid;
  var comment_num = parseInt(req.body.comment_num)
  comment_num += 1 //评论数+1
  var comment = req.body.comment

  //jsp验证
  var check1 = check(Username)
  var check2 = check(contentid)
  var check3 = check(comment_num)
  var check4 = check(comment)
  if (check1 || check2 || check3 || check4) {
    resdata.code = 1;
    resdata.message = "输入了非法字符!";
    res.json(resdata);
    return;
  }


  db.sql(("insert into Commits(Commitcontent,Contentid,Username) values (\'" + comment + "\',\'" + contentid + "\',\'" + Username + "\')"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      db.sql(("UPDATE Content SET Comment = \'" + comment_num + "\' where Id = " + contentid), function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        if (result) {
          resdata.message = "评论成功！";
          res.json(resdata);
        }
      })
    }
  })
});

router.get("/getfriend", function (req, res) {
  var Friends = req.query.Friends
  //jsp验证
  var check1 = check(Friends)
  if (check1) {
    return;
  }
  db.sql(("with r as(SELECT a.Username,a.Id,b.Img FROM Users as a LEFT JOIN Picture as b ON a.Username=b.Username)select * from r WHERE " + Friends), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      res.json(result.recordset);
    }
  })
})

//好友获取消息
router.get("/getmessage", function (req, res) {
  var Username = req.query.Username
  //jsp验证
  var check1 = check(Username)
  if (check1) {
    return;
  }
  db.sql(("with r as(SELECT b.Id as receiverid,a.* FROM (SELECT b.Id as senderid,a.* FROM Messages as a LEFT JOIN Users as b ON b.Username=a.Sender) as a LEFT JOIN Users as b ON b.Username=a.Receiver)Select top 300 * from r where sender=\'" + Username + "\' or receiver =\'" + Username + "\' order by Time asc"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      res.json(result.recordset);
    }
  })
})

//发送好友消息
router.post("/sendmessage", function (req, res) {
  var Username = req.body.username
  var friendname = req.body.friendname
  var msg = req.body.msg
  //jsp验证
  var check1 = check(Username)
  var check2 = check(friendname)
  var check3 = check(msg)
  if (check1 || check2 || check3) {
    return;
  }
  var d = new Date()
  var Addtime = d.toLocaleString()
  db.sql(("insert into Messages(Sender,Receiver,Time,Message) values (\'" + Username + "\',\'" + friendname + "\',\'" + Addtime + "\',\'" + msg + "\')"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      resdata.message = "success!";
      res.json(resdata);
    }
  })
})

//addfridend
router.post("/addfridend", function (req, res) {
  var myname = req.body.myname
  var addusername = req.body.addusername
  var myid = req.body.myid
  var Friendslength = req.body.Friendslength
  //console.info(myid)
  console.info(Friendslength)
  //return
  //jsp验证
  var check1 = check(myname)
  var check2 = check(addusername)
  var check3 = check(myid)
  if (check1 || check2 || check3) {
    return;
  }
  db.sql(("with r as( SELECT a.Friends,b.Username,b.Id,b.Password,b.Isadmin FROM Users as b LEFT JOIN Friend as a ON a.Username=b.Username)select * from r WHERE Username=\'" + addusername + "\'"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      if (result.recordset.length == 0) { //不存在用户
        resdata.code = 1;
        resdata.message = "用户名不存在！";
        res.json(resdata);
      } else {
        tragetuser = result.recordset[0]
        if (tragetuser.Friends == null) {
          if (Friendslength == '') { //自己没好友
            db.sql(("insert into Friend(Username,Friends) values (\'" + myname + "\',\'" + result.recordset[0].Id + "\');insert into Friend(Username,Friends) values (\'" + result.recordset[0].Username + "\',\'" + myid + "\')"), function (err, result) {
              if (err) {
                console.log(err);
                return;
              }
              if (result) {
                resdata.message = "添加好友成功！";
                res.json(resdata);
                return
              }
            })
          } else {//自己已经有好友
            Friendslength= Friendslength+','+tragetuser.Id
            db.sql(("insert into Friend(Username,Friends) values (\'" + result.recordset[0].Username + "\',\'" + myid + "\');UPDATE Friend SET Friends = \'" + Friendslength + "\' where Username ='" + myname + "\'"), function (err, result) {
              if (err) {
                console.log(err);
                return;
              }
              if (result) {
                resdata.message = "添加好友成功！";
                res.json(resdata);
                return
              }
            })
          }

        } else {
          var Friend_arr = checkifhavefriend(tragetuser.Friends)
          for (var i = 0; i < Friend_arr.length; i++) {
            if (parseInt(myid) == Friend_arr[i]) {
              resdata.message = "已是好友关系";
              res.json(resdata);
              return
            }
          }
          if (Friendslength == '') {//自己没好友
            var addlilst = tragetuser.Friends + ',' + myid
            db.sql(("UPDATE Friend SET Friends = \'" + addlilst + "\' where Username = '" + tragetuser.Username + "\'; insert into Friend(Username,Friends) values (\'" + myname + "\',\'" + tragetuser.Id + "\')"), function (err, result) {
              if (err) {
                console.log(err);
                return;
              }
              if (result) {
                resdata.message = "添加好友成功！";
                res.json(resdata);
                return
              }
            })
          } else {//自己有了好友
            //互相修改好友列表
            console.info('互相修改好友列表')
            var addlilst = tragetuser.Friends + ',' + myid
            var myaddUPDATE = Friendslength + ',' + tragetuser.Id
            db.sql(("UPDATE Friend SET Friends = \'" + addlilst + "\' where Username = '" + tragetuser.Username + "\';  UPDATE Friend SET Friends = \'" + myaddUPDATE + "\' where Username ='" + myname + "\'"), function (err, result) {
              if (err) {
                console.log(err);
                return;
              }
              if (result) {
                resdata.message = "添加好友成功！";
                res.json(resdata);
                return
              }
            })
          }


        }
      }

    }
  })
})
module.exports = router;