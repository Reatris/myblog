var socket;
//UI
var UI = {
    msg_send: $('#msg_send'),
    msg_input: $('#msg_input'),
    unread_msg_all: $('#unreadNumAll')
};
//全局变量
var RAM = {
    userInfo: readuser(),
    tid: 0, //正在会话id（0没有会话）
    chatList: {}, //会话列表集合
    friendList: [], //好友id数组
    unreadNumAll: 0, //所有未读消息

    //更新会话列表
    updateChatList(tid, obj) {
        $.each(obj, function (key, value) {
            RAM.chatList['tid_' + tid][key] = value;
        });
    },
    //更新历史记录
    updateChatHistory(tid, msg, time) {

    }
};
//获取好友消息
function Getmessage() {
    $.ajax({
        url: "/api/getmessage",
        type: "get",
        dataType: "json",
        data: {
            Username: $("#Username").val(),
        },
        success: function (result) {
            //console.info(RAM.chatList)

            for (var i = 0; i < result.length; i++) {
                //console.info(result[i])
                if (result[i].Sender != RAM.userInfo.username) {
                    var html = '<div class="left">' +
                        result[i].Time +
                        '<div class="msg">' +
                        '<img src="' + RAM.chatList['tid_' + result[i].senderid].avatar + '" />' +
                        '<p>' + result[i].Message + '</p>' +
                        '</div>' +
                        '</div>';
                    $('#tid_' + result[i].senderid).append(html);
                    RAM.chatList['tid_' + result[i].senderid].unread_num++;
                } else {
                    var html = '<div class="right">' +
                        result[i].Time +
                        '<div class="msg">' +
                        '<img src="' + RAM.userInfo.avatar + '" />' +
                        '<p>' + result[i].Message + '</p>' +
                        //'<span class="msg_error">!</span>'+
                        '</div>' +
                        '</div>';
                    $('#tid_' + result[i].receiverid).append(html);
                    console.info(result[i].receiverid)
                    RAM.chatList['tid_' + result[i].receiverid].unread_num = 0;
                }

            }
            for (var item in RAM.chatList) {
                console.info(item)
                if (RAM.chatList[item].unread_num > 0) {
                    $('.chatlist li[data-tid="' + RAM.chatList[item].id + '"]').find('.msg-num')
                        .text(RAM.chatList[item].unread_num);
                    RAM.unreadNumAll += RAM.chatList[item].unread_num
                }
            }
            if (RAM.unreadNumAll > 0) {
                document.getElementById('audio-msg').play();
                UI.unread_msg_all.text(RAM.unreadNumAll);
            }
        }



    });

}
//读取用户信息
ajaxGetFriedList();


//初始化好友和会话页面
function ajaxGetFriedList() {
    var Friends = $("#Friends").val()
    console.info('ss=' + Friends)
    if (Friends == '') {
        console.info('sss')
        return
    }
    var Friends_arr = new Array(); //定义一数组 
    Friends_arr = Friends.split(","); //字符分割 
    str = 'Id='
    var num = Friends_arr.length
    for (var i = 0; i < num; i++) {
        if (i < num - 1) {
            str += Friends_arr[i] + ' or Id='
            continue
        }
        str += Friends_arr[i]
    }
    $.ajax({
        url: "/api/getfriend",
        type: "get",
        dataType: "json",
        data: {
            Friends: str
        },
        success: function (result) {
            console.info(result)
            var online = '';
            count = result.length
            var chatlist = ''
            var mesglist = '';
            for (var j = 0; j < count; j++) {
                chatlist += '<li data-tid="' + result[j].Id + '">' +
                    '<div class="chatlist-avatar">' +
                    '<img class="' + online + '" src="' + result[j].Img +
                    '" />' +
                    '</div> ' +
                    '<div class="chatlist-name">' +
                    '<p>' + result[j].Username + '</p>' +
                    '<p class="brief"></p>' +
                    '</div>' +
                    '<span class="msg-time"></span>' +
                    '<span class="msg-num"></span>' +
                    '</li>';
                var user = {
                    id: parseInt(result[j].Id),
                    Username: result[j].Username,
                    avatar: result[j].Img,
                    unread_num: 0, //未读消息
                };
                RAM.chatList['tid_' + user.id] = user; //会话列表集合
                RAM.friendList.push(user.id); //好友id数组

                mesglist += '<div class="msglist" id="tid_' + user.id +
                    '"><input type="hidden" id="Username" name="Username" value="' + result[j].Username + '\"></div>';
            }
            $('.chatlist').append(chatlist);
            $('.message').html(mesglist);
            initUI();
            readHistory();
            Getmessage()
        }
    });
}


//发送消息按钮
function sendBtn() {
    checkInput()
    if (UI.msg_send.hasClass('active') == false) return false;
    UI.msg_send.removeClass('active');
    var msg = UI.msg_input.val();
    UI.msg_input.val('');
    UI.msg_input.focus();
    var friendname
    var inputhidden = $(".msglist")
    $.each(inputhidden, function (i, n) {
        if ($(this).css("display") == "block") {
            friendname = $(this).find('input').val()
        }
    });
    var message = {
        username: RAM.userInfo.username,
        friendname: friendname,
        msg: msg,
    };
    sendMsg(message);
}

function sendMsg(message) {
    $.ajax({
        url: "/api/sendmessage",
        type: "post",
        dataType: "json",
        data: {
            username: message.username,
            friendname: message.friendname,
            msg: message.msg,
        },
        success: function (result) {
            window.location.reload();
        }
    });
}
document.onkeydown = function (event) {
    e = event ? event : (window.event ? window.event : null);
    if (e.keyCode == 13 && RAM.tid != 0) {
        sendBtn();
    }
}

//初始化UI事件
function initUI() {
    //打开消息
    $('.chatlist li').click(function () {
        RAM.tid = $(this).data('tid');
        RAM.unreadNumAll -= RAM.chatList['tid_' + RAM.tid].unread_num;
        if (RAM.unreadNumAll > 0) {
            UI.unread_msg_all.text(RAM.unreadNumAll);
        } else {
            UI.unread_msg_all.text('');
        }
        RAM.chatList['tid_' + RAM.tid].unread_num = 0;
        $(this).find('.msg-num').text('');

        var title = RAM.chatList['tid_' + RAM.tid].Username;

        $('.talk-header .title').text(title);

        $('#index,#talk').addClass('active');
        $('#tid_' + RAM.tid).show().scrollTop($('#tid_' + RAM.tid)[0]
            .scrollHeight);
        //UI.msg_input.focus();
    });
    //返回消息列表
    $('#talk .back').click(function () {
        $('#index,#talk').removeClass('active');
        $('#tid_' + RAM.tid).hide();
        RAM.tid = 0;
    });
};

//检测消息是否为空
function checkInput() {
    if (UI.msg_input.val() != '') {
        UI.msg_send.addClass('active');
    } else {
        UI.msg_send.removeClass('active');
    }
}



//读取历史记录
function readHistory() {
    RAM.chatHistory = readData('chat_histoty');
    RAM.chatTime = readData('chat_time');
    if (RAM.chatHistory == null) RAM.chatHistory = {};
    if (RAM.chatTime == null) RAM.chatTime = {};
    $.each(RAM.chatHistory, function (name, value) {
        if (value == '') return;
        $('#' + name).append(value);
        var tid = name.substr(4, name.length);
        var msg = $('#' + name).find('.msg:last p').text();
        updateChatlist(tid, msg, RAM.chatTime[name]);
    });
}

function myenuchange(id) {
    var targetdiv = $('#unapp').find('.select')
    $.each(targetdiv, function (i, n) {
        if ($(this).attr("id") == id) {
            $(this).css("display", "block");
        } else {
            $(this).css("display", "none");
        }
    });
}
//添加好友
var adfriend = $("#addfriend_from");
adfriend.find("input[name='addfriend_submit']").on("click", function () {
    var Friendslength = $('#user_header_info').find("input[name='Friends']").val()
    var inputval = adfriend.find('input[name="addusername"]').val()
    if (inputval == '') {
        alert('请输入用户名')
        return
    }
    $.ajax({
        type: "post",
        url: "/api/addfridend",
        dataType: "json",
        data: {
            Friendslength: Friendslength,
            addusername: inputval,
            myname: adfriend.find('input[name="myname"]').val(),
            myid: adfriend.find('input[name="myid"]').val(),
        },
        success: function (result) {
            console.log(result.message);
            adfriend.find(".warning").html(result.message);
            if (result.message=='添加好友成功！') {
                setTimeout(function () {
                    $.ajax({
                        url: "/api/user/logout",
                        success: function (result) {
                          console.log(result);
                          if (!result.code) {
                            window.location.reload();
                          }
                        }
                      });
                }, 1500);
            }
        }
    });
});