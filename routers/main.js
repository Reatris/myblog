var express = require("express");
var db = require('../db/db');
//var swig = require("swig");
var router = express.Router();

var check = require('./checkJSP')

var data;



//处理通用的数据,首页，分类页，每篇blog详情页均需要的变量
router.use(function (req, res, next) {
  data = {
    userInfo: req.userInfo,
    Categories: []
  };
  db.sql('select * from Categorys', function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    if (result) {
      //console.info(result.recordset)
      data.Categories = result.recordset
      next();
    }
  })
  // data.categories = [
  //   {Id:1,Name:'技术'},
  //   {Id:2,Name:"分享"}
  // ];

});

//渲染首页
router.get("/", function (req, res) {
  data.Category = req.query.Category || "";

  //jsp验证
  var check1 = check(data.Category)
  if (check1) {
    res.render("main/index", data);
    return
  }
  //console.info('data.Category='+data.Category)
  data.count = 0;


  var where = {};
  if (data.Category) { //判断是否首页或者分类页面
    where.Category = data.Category;
    db.sql(("select * from Content where Category = " + "\'" + where.Category + "\'"), function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      if (result) {
        //console.info(result.recordset)

        data.contents = result.recordset
        //console.info(data.contents )
        //获取元素长度
        data.count = data.contents.length
        for (var i = 0; i < data.count; i++) {
          data.contents[i].Commits = eval("(" + data.contents[i].Comment + ")") //str转array
          data.contents[i].Commits_num = data.contents[i].Commits.length //评论的数量
        }
        //var test='["colkey", "col", "colsinfo","NameList" ]'
        //var Commits=eval("("+data.contents[0].Comment+")");
        //console.info(data.contents)
        //data.Commits_num = JSON

        res.render("main/index", data);
        //console.info(data.Categories.length)
      }
    })
  } else {
    db.sql(("select * from Content"), function (err, result) {
      if (err) {
        console.log(err);
        return;
      }

      if (result) {
        //console.info(result.recordset)

        data.contents = result.recordset
        //获取元素长度
        data.count = data.contents.length

        for (var i = 0; i < data.count; i++) {
          data.contents[i].Commits = parseInt(data.contents[i].Comment) //str转int
          //data.contents[i].Commits_num=data.contents[i].Commits.length//评论的数量
        }
        // for(var i=0;i<data.count;i++){
        //   data.contents[i].Commits=eval("("+data.contents[i].Comment+")")//str转array
        //   data.contents[i].Commits_num=data.contents[i].Commits.length//评论的数量
        // }

        res.render("main/index", data);
        //console.info(data.Categories.length)
      }
    })
  }
})
//     data.contents = [{
//       Title: 'String',
//       Category :'技术交流',
//       Composition :'这是内容',
//       Description :'这是描述',
//       Username:'wangcheng',
//       Num:100,
//       Addtime:'2020年6月9日 11:11:23',
//       Comment :'henbang'
//   }];
//       //console.log(data);
//     res.render("main/index", data);

//进入详细阅读部分

router.get("/view", function (req, res) {
  var Id = req.query.contentId || "";
  var num = parseInt(req.query.num || 0)
  //console.info(Id)
  //d=Id.toString()
  //jsp验证
  var check1 = check(Id)
  var check2 = check(num)
  if (check1 || check2) {
    res.render("main/view", data);
    return
  }
  

  //阅读量+1
  num += 1
  db.sql(("UPDATE Content SET Num = \'" + num + "\' where Id = " + Id), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      db.sql(("select * from Content where Id=" + Id), function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        if (result) {
          data.content = result.recordset[0]
          //console.info(data.content)
          res.render("main/view", data);
        }
      })
    }
  })
  //   data.content= {
  //     Title: 'String',
  //     Category :"技术交流",
  //     Composition :'这是内容',
  //     Description :'这是描述',
  //     Username:'wangcheng',
  //     Num:100,
  //     Addtime:'2020年6月9日 11:11:23',
  //     Comment :'henbang'
  // };

});

module.exports = router;