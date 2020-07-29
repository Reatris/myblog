var APP = {
    api: '../php/api.php',
    ws: 'ws://192.168.1.128:2000',
    debug: true,
    version: 'v0.2',

    /*
    * 格式化年月日时间
    * @param fmt {String} 年月+时间："yyyy-mm-dd hh:ii:ss"（可以只显示年月日或时间）
    * return {String} 返回yyyy-mm-dd hh:ii:ss格式的字符串
    */
    dateFormat: function (fmt,time) {
        fmt = fmt || "yyyy-mm-dd hh:ii:ss";
        let date;
        if(time){
            date = new Date(time);
        }
        else {
            date=new Date();
        }
        var o = {
            "m+": date.getMonth() + 1,  //月份
            "d+": date.getDate(),       //日
            "h+": date.getHours(),      //小时
            "i+": date.getMinutes(),    //分
            "s+": date.getSeconds(),    //秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },

    //时间戳转时间
    timestampToTime: function (timestamp) {
        return APP.dateFormat('',timestamp);
    },
    //时间转时间戳
    timeToTimestamp: function (time) {
        return Date.parse(time);
    },
}
//弹出信息
APP.alert = function (msg) {
    layer.open({
        content: msg,
        skin: 'msg',
        time: 2
    });
}
//post
APP.post = function (url, data, success, error) {
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'JSON',
        data: data,
        success: function (data) {
            //if (APP.debug) { console.log(data); }
            if (success) return success(data);
        },
        error: function (e) {
            console.error(e);
            if (error) return error(e);
        }
    });
}
//存储数据
function saveData(key, data) {
    key = 'data_' + key;
    data = JSON.stringify(data);
    if (window.localStorage) {
        localStorage.setItem(key, data);
    }
}

//读取数据
function readData(key) {
    if (!window.localStorage) return '';
    key = 'data_' + key;
    return JSON.parse(localStorage.getItem(key));
}

function readuser(){
    var username=document.getElementById('Username').value
    var userid=document.getElementById('Userid').value
    var useraavatar=window.localStorage.getItem('header_photo')
    var userinfo={
        uid:userid,
        avatar:useraavatar,
        username:username
    }
    //console.info(userinfo)
    return userinfo
}

Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
}
