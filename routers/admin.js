var express = require("express");
var db = require('../db/db.js');
var check = require('./checkJSP')
var router = express.Router();
//管理主页
router.get("/", function (req, res) {
  res.render("admin/index", {
    userInfo: req.userInfo
  });
});
//用户主页
router.get("/user", function (req, res) {
  //var userInfo = JSON.parse(req.cookies.get("userInfo"))
  //console.info(userInfo)
  db.sql(("select * from Users"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      result.recordset
      res.render("admin/userindex", {
        users: result.recordset,
        counts: result.recordset.length,
        userInfo: req.userInfo
      });
    }
  })
});
//分类页面
router.get("/category", function (req, res) {
  db.sql(("select * from Categorys"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {

      categories = result.recordset
      counts = result.recordset.length

      res.render("admin/category", {
        categories: categories,
        counts: counts,
        userInfo: req.userInfo
      });
    }
  })
});
//添加
router.get("/category/add", function (req, res) {
  res.render("admin/addcategory", {
    userInfo: req.userInfo
  });
});
//添加+
router.post("/category/add", function (req, res) {
  var name = req.body.name || "";
  //console.log(name);

  //jsp验证
  var check1 = check(name)
  if (check1) {
    res.render("admin/error", {
      errormessage: '输入了非法字符！',
      userInfo: req.userInfo
    });
    return
  }

  if (name == "") {
    res.render("admin/error", {
      errormessage: '不能为空！',
      userInfo: req.userInfo
    });
  } else {
    db.sql(("insert into Categorys(Name) values (\'" + name + "\')"), function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      if (result) {
        res.render("admin/success", {
          userInfo: req.userInfo
        });
      }
    })
  }
});
//编辑类别
router.get("/category/edit", function (req, res) {
  var cateid = req.query.id || "";
  var categoryName = req.query.categoryName
  res.render("admin/categoryedit", {
    userInfo: req.userInfo,
    categoryName: categoryName,
    cateid: cateid
  });
});
//提交编辑类别
router.post("/category/edit", function (req, res) {
  var name = req.body.name || "";
  //console.info(name)
  var id = req.body.cateid;

  //jsp验证
  var check1 = check(name)
  var check2 = check(id)
  if (check1 || check2) {
    res.render("admin/error", {
      errormessage: '输入了非法字符！',
      userInfo: req.userInfo
    });
    return
  }

  if (name == "") {
    res.render("admin/error", {
      errormessage: '不能为空！',
      userInfo: req.userInfo
    });
    return false;
  } else {
    db.sql(("UPDATE Categorys SET Name = \'" + name + "\' where Id = " + id), function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      if (result) {
        res.render("admin/success", {
          userInfo: req.userInfo
        });
      }
    })
  }
});
//删除分类确认
router.get("/category/delete", function (req, res) { //删除附加验证关联表
  var id = req.query.id || "";
  var categoryName = req.query.categoryName;
  db.sql(("select distinct Category from Content"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      contents_haved_categorys = result.recordset
      //console.info(categorys)
      for (var i = 0; i < contents_haved_categorys.length; i++) {
        //console.info('categoryName='+categoryName)
        //console.info('categoryNames[i]='+contents_haved_categorys[i].Category)
        if (categoryName == contents_haved_categorys[i].Category) {
          res.render("admin/error", {
            errormessage: '删除失败,该category下有content!',
            userInfo: req.userInfo
          });
          return
        }
      }
      res.render("admin/confirm", {
        userInfo: req.userInfo,
        id: id,
        categoryName: categoryName
      });
    }
  })
});

//删除分类
router.post("/category/delete", function (req, res) {
  var id = req.query.id || "";

  //jsp验证
  var check2 = check(id)
  if (check2) {
    res.render("admin/error", {
      errormessage: '输入了非法字符！',
      userInfo: req.userInfo
    });
  }

  db.sql(("delete Categorys where Id = " + id), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      res.render("admin/success", {
        userInfo: req.userInfo
      });
    }
  })
});
//加载content 页面
router.get("/content", function (req, res) {

  db.sql(("select * from Content"), function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      contents = result.recordset
      res.render("admin/content", {
        userInfo: req.userInfo,
        contents: contents
      });
    }
  })
});
//加载新增content页面
router.get("/content/add", function (req, res) {
  var cate = null;

  db.sql('select * from Categorys', function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      //console.info(result.recordset)
      categories = result.recordset
      res.render("admin/addcontent", {
        userInfo: req.userInfo,
        categories: categories
      });
    }
  })
});

//直接添加content
router.post("/content/add", function (req, res) {
  var d = new Date()
  var Addtime = d.toLocaleString()
  var user = req.userInfo.username || 'wangcheng';
  var title = req.body.name || "";
  var category = req.body.category || "";
  var description = req.body.description || "";
  var content = req.body.content || "";

  //jsp验证
  var check1 = check(user)
  var check2 = check(title)
  var check3 = check(category)
  var check4 = check(description)
  var check5 = check(content)
  if (check1 || check2 || check3 || check4 || check5) {
    res.render("admin/error", {
      errormessage: '输入了非法字符！',
      userInfo: req.userInfo
    });
    return
  }
  console.info('error!')
  if (title == "" || category == "" || description == "" || content == "") {
    res.render("admin/addok", {
      userInfo: req.userInfo,
      message: "这都填不好，你发个锤子啊！"
    });
    return false;
  } else {
    db.sql(("insert into Content(Title,Category,Composition,Description,Username,Num,Addtime,Comment) values (\'" + title + "\',\'" + category + "\',\'" + content + "\',\'" + description + "\',\'" + user + "\',\'" + 0 + "\',\'" + Addtime + "\',\'" + 0 + "\')"), function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      if (result) {
        res.render("admin/addok", {
          userInfo: req.userInfo,
          message: "ok!发博成功"
        });
      }
    })
  }
});

//普通加载新增content页面
router.get("/content/specialadd", function (req, res) {
  var cate = null;

  db.sql('select * from Categorys', function (err, result) {
    if (err) {
      console.log(err);
      return;
    }
    if (result) {
      //console.info(result.recordset)
      categories = result.recordset
      res.render("admin/addcontent", {
        userInfo: req.userInfo,
        categories: categories
      });
    }
  })
});


//普通用户发布BLOG
router.post("/content/specialadd", function (req, res) {
  var d = new Date()
  var Addtime = d.toLocaleString()
  var user = req.userInfo.username || 'wangcheng';
  var title = req.body.name || "";
  var category = req.body.category || "";
  var description = req.body.description || "";
  var content = req.body.content || "";

  //jsp验证
  var check1 = check(user)
  var check2 = check(title)
  var check3 = check(category)
  var check4 = check(description)
  var check5 = check(content)
  if (check1 || check2 || check3 || check4 || check5) {
    req.userInfo.Isadmin = true
    res.render("admin/specialadderror", {
      userInfo: req.userInfo,
      message: "输入了非法字符！"
    });
    return
  }


  if (title == "" || category == "" || description == "" || content == "") {
    req.userInfo.Isadmin = true
    res.render("admin/specialadderror", {
      userInfo: req.userInfo,
      message: "输入不能为空！"
    });
    return
  } else {
    db.sql(("insert into Content(Title,Category,Composition,Description,Username,Num,Addtime,Comment) values (\'" + title + "\',\'" + category + "\',\'" + content + "\',\'" + description + "\',\'" + user + "\',\'" + 0 + "\',\'" + Addtime + "\',\'" + 0 + "\')"), function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      if (result) {
        req.userInfo.Isadmin = true
        res.render("admin/specialaddok", {
          userInfo: req.userInfo,
          message: "ok!发博成功"
        });
      }
    })
  }
});


//修改content
router.get("/content/edit", function (req, res) {
  var cate = null;
  var id = req.query.id || "";

  //jsp验证
  var check1 = check(id)
  if (check1) {
    res.render("admin/error", {
      errormessage: '输入了非法字符！',
      userInfo: req.userInfo
    });
    return
  }

  db.sql('select * from Categorys', function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    if (result) {
      //console.info(result.recordset)
      cate = result.recordset

      db.sql(("select * from Content where Id=" + id), function (err, result) {
        if (err) {
          console.log(err);
          return;
        }
        if (result) {
          content = result.recordset[0]
          res.render("admin/editcontent", {
            userInfo: req.userInfo,
            info: content,
            categories: cate
          });
        }
      })

    }
  })

});
//提交修改content
router.post("/content/edit", function (req, res) {
  var id = req.query.id || "";
  var title = req.body.name || "";
  var category = req.body.category || "";
  var description = req.body.description || "";
  var content = req.body.content || "";
  var d = new Date()
  var Addtime = d.toLocaleString()
  //jsp验证
  var check1 = check(id)
  var check2 = check(title)
  var check3 = check(category)
  var check4 = check(description)
  var check5 = check(content)
  if (check1 || check2 || check3 || check4 || check5) {
    res.render("admin/error", {
      errormessage: '输入了非法字符！',
      userInfo: req.userInfo
    });
    return
  }

  if (title == "" || category == "" || description == "" || content == "") {
    res.render("admin/addok", {
      userInfo: req.userInfo,
      message: "有地方是空的，请填满！"
    });
    return false;
  } else {

    db.sql(("UPDATE Content SET Title = \'" + title + "\', Category = \'" + category + "\', Description = \'" + description + "\', Composition = \'" + content + "\', Addtime = \'" + Addtime + "\'  where Id = " + id), function (err, result) {
      if (err) {
        console.log(err);
        return;
      }
      if (result) {
        res.render("admin/addok", {
          userInfo: req.userInfo,
          message: "ok!修改成功"
        });
      }
    })
  }
});
//确认删除content
router.get("/content/delete", function (req, res) {
  var id = req.query.id || "";
  var content_Title = req.query.content_Title;
  var Comment = req.query.Comment
  //console.log(id);
  res.render("admin/confirm2", {
    userInfo: req.userInfo,
    id: id,
    content_Title: content_Title,
    Comment
  });
});
//删除content
router.post("/content/delete", function (req, res) { //删除附加验证关联表
  var id = req.query.id || "";
  var Comment = parseInt(req.query.Comment);

  //jsp验证
  var check1 = check(id)
  var check2 = check(Comment)
  if (check1 || check2) {
    res.render("admin/error", {
      errormessage: '输入了非法字符！',
      userInfo: req.userInfo
    });
    return
  }

  //console.info(Comment)
  if (Comment > 0) {
    res.render("admin/error", {
      errormessage: '删除失败,该content 有评论!',
      userInfo: req.userInfo
    });
    return
  }
  //console.log(id);
  db.sql(("delete Content where Id = " + id), function (err, result) {
    if (err) {
      console.info(err)

    }
    if (result) {
      res.render("admin/addok", {
        userInfo: req.userInfo,
        message: "ok！删除成功"
      });
    }
  })
});


module.exports = router;