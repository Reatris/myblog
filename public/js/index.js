$(function () {
  var loginbox = $("#login");
  var registerbox = $("#register");
  var userinfobox = $("#userinfo");
  loginbox.find("a").on("click", function () {
    loginbox.hide();
    registerbox.show();
  });
  registerbox.find("a").on("click", function () {
    loginbox.show();
    registerbox.hide();
  });
  registerbox.find("input[name='submit']").on("click", function () {
    //上传图片
    var fileUrl = $("#img").prop("files");
    if (fileUrl.length == 0) {
      alert("请选择头像");
      return
    }
    var img_traned
    var reader = new FileReader();
    reader.readAsDataURL(fileUrl[0]);
    reader.onload = function (e) {
      img2base64 = e.target.result;
      img_traned = img2base64
      if (img_traned == undefined) {
        alert('请选择头像')
        return false
      }
      $.ajax({
        type: "post",
        url: "/api/user/register",
        dataType: "json",
        data: {
          username: registerbox.find('input[name="username"]').val(),
          password: registerbox.find('input[name="password"]').val(),
          repassword: registerbox.find('input[name="repassword"]').val(),
          img_traned: img_traned
        },
        success: function (result) {
          registerbox.find(".warning").html(result.message);
          setTimeout(function () {
            registerbox.find(".warning").html("");
          }, 1500);
          if (!result.code) { //注册成功就清空
            setTimeout(function () {
              loginbox.show();
              registerbox.hide();
              registerbox.find('input[name="username"]').val("");
              registerbox.find('input[name="password"]').val("");
              registerbox.find('input[name="repassword"]').val("");
            }, 1500);
          }
        }
      });
    }

  });

  loginbox.find("input[name='submit']").on("click", function () {
    $.ajax({
      type: "post",
      url: "/api/user/login",
      dataType: "json",
      data: {
        username: loginbox.find('input[name="username"]').val(),
        password: loginbox.find('input[name="password"]').val()
      },
      success: function (result) {
        console.log(result);
        window.localStorage.clear()
        window.localStorage.setItem('header_photo', result.Img);
        loginbox.find(".warning").html(result.message);
        setTimeout(function () {
          loginbox.find(".warning").html("");
        }, 1500);
        if (!result.code) {
          setTimeout(function () {
            window.location.reload();
          }, 1500);
        }
      }
    });
  });
  userinfobox.find(".logout").on("click", function () {
    $.ajax({
      url: "/api/user/logout",
      success: function (result) {
        console.log(result);
        if (!result.code) {
          window.location.reload();
        }
      }
    });
  });

  //在页面加载时获取评
  $.ajax({
    url: "/api/pinglun",
    type: "get",
    dataType: "json",
    data: {
      contentid: $("#contentid").val()
    },
    success: function (result) {
      for (var i = 0; i < result.postdata.length; i++) {
        var commit_content = document.createElement('div')
        commit_content.innerHTML = result.postdata[i].Username + '发表了评论:  ' + result.postdata[i].Commitcontent
        $("#commentlist").append(commit_content);
      }
    }
  });

  //提交评论
  $("#addcomment").on("click", function () {
    var comment = $("#comment").find("textarea").val()
    var comment_num = $("#commit_num").val()
    var Username = $("#Username").val()
    if (comment) {
      $.ajax({
        type: "post",
        url: "/api/comment",
        dataType: "json",
        data: {
          comment: comment,
          contentid: $("#contentid").val(),
          comment_num: comment_num,
          Username: Username

        },
        success: function (result) {
          alert(result.message)
          window.location.reload();
        }
      });
    } else {
      alert('请输入评论')
    }
  });
  //设置头像
  var header_photo = window.localStorage.getItem('header_photo');
  //console.info(header_photo)
  $("#header_photo").attr('src', header_photo);



});


