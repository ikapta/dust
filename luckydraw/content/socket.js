$(function() {
    




//全局Socket对象
var socket;
var myid = 0;
var myipcon = "ws://54.223.65.183:8050";
var connetInterval;
    var intArr = [];

var ImageUrl_LuckyStartSmall = "/Modules/Innocellence.GSK.WeChat.Frontend.Module/Views/LuckyDraw/content/ipad_start_small.png",
                ImageUrl_LuckyStartBig = "/Modules/Innocellence.GSK.WeChat.Frontend.Module/Views/LuckyDraw/content/ipad_start_big.png",
                ImageUrl_LuckyEndSmall = "/Modules/Innocellence.GSK.WeChat.Frontend.Module/Views/LuckyDraw/content/ipad_end_small.png",
                ImageUrl_LuckyEndBig = "/Modules/Innocellence.GSK.WeChat.Frontend.Module/Views/LuckyDraw/content/ipad_end_big.png";

var lucky_start = $('#lucky-start'),
    lucky_end = $('#lucky-end');
var isPhone = IsPhone();
var  clickEventStart = "click",clickEventEnd="click";
if (isPhone) {
    clickEventStart = 'touchstart';
    clickEventEnd = 'touchend';
}

    var flagStartFirst = false, flagEndFirst = false; //防止多次点击事件flag,以及开始和结束状态点击切换,socket 连接成功,初始化按钮状态

    $(lucky_start).on(clickEventStart, function () {
    if (flagStartFirst) {
        flagStartFirst = false;

        send('Start');
    }

});
    //send('Start')发送成功
    function Start1() {
        $(lucky_end).prop("src", ImageUrl_LuckyEndBig);
        $(lucky_start).prop("src", ImageUrl_LuckyStartSmall);
        $(lucky_end).addClass("lucky_scale");
        $(lucky_start).removeClass("lucky_scale");
        flagEndFirst = true;
    }

    $(lucky_end).on(clickEventEnd, function () {

    if (flagEndFirst) {
        flagEndFirst = false;
       
        send('End');
    }

    });
    function End1() {
        $(lucky_start).prop("src", ImageUrl_LuckyStartBig);
        $(lucky_end).prop("src", ImageUrl_LuckyEndSmall);
        $(lucky_start).addClass("lucky_scale");
        $(lucky_end).removeClass("lucky_scale");
        flagStartFirst = true;
    }

////显示并返回输入的ip
//function showPrompt() {
//    var b1x = 0, b2x = 0;
//    $('.lucky-title span').on('touchstart', function () {
//        b1x = event.changedTouches[0].clientX;
//    });
//    $('.lucky-title span').on('touchend', function () {
//        b2x = event.changedTouches[0].clientX;
//        if (b2x - b1x > 200) {
//            myipcon = prompt('请输入ip:', 'ws://127.0.0.1:8050');
//            if (myipcon != null || myipcon != "") {
//                InitConnet.ConnetInterval(); //初始化
//            } else {
//                popTip("重新输入");
//            }

//        }
//    });
//}
//showPrompt();
$('.lucky-title span').on('click', function () {
    myipcon = prompt('请输入ip:', 'ws://54.223.65.183:8050');
        if (myipcon != null || myipcon != "") {
                InitConnet.ConnetInterval(); //初始化
        } else {
            popTip("重新输入");
        }
   });

//调用connect function
var InitConnet =
{
    ConnetInterval: function() {
        connetInterval = setInterval(function() {
            connect();
        }, 5000);
        intArr.push(connetInterval);
    },
    closeInterval: function () {
        
        clearInterval(connetInterval);
        if (intArr.length > 0) {
            $.each(intArr, function(item) {
                clearInterval(intArr[item]);
            });
        }
    }
};


//连接至服务器
    function connect() {


        //尝试连接至服务器
        try {
            //ws://127.0.0.1:8050
            socket = new WebSocket(myipcon);
        } catch (exception) {
            alert("对不起，您所使用的浏览器不支持WebSocket.");
            return;
        }

        //连接成功
        socket.onopen = function() {
            popTip("connect success");
            InitConnet.closeInterval();
            socket.send("LIN,0,0,");
        }
        //收到消息
        socket.onmessage = function(msg) {
            //返回的数据msg.data，包含了协议中的4部分

            //alert(msg);

            var arrays = msg.data.split(',');
            if (arrays.length < 1) InitConnet.ConnetInterval();;

            if (arrays[0] == 'Start') {
                //可以开始抽奖
                flagStartFirst = true;
                $(lucky_start).prop("src", ImageUrl_LuckyStartBig);
                $(lucky_end).prop("src", ImageUrl_LuckyEndSmall);
                $(lucky_start).addClass("lucky_scale");
                $(lucky_end).removeClass("lucky_scale");

            } else if (arrays[0] == 'End') {
                //暂停抽奖
                flagStartFirst = false;
                flagEndFirst = false;
                $(lucky_start).prop("src", ImageUrl_LuckyStartSmall);
                $(lucky_end).prop("src", ImageUrl_LuckyEndSmall);
                $(lucky_start).removeClass("lucky_scale");
                $(lucky_end).removeClass("lucky_scale");
            }else if (arrays[0] == 'Start1') {
                Start1();  //开始抽奖回调
            }else if (arrays[0] == 'End1') {
                End1();  //结束抽奖回调
            }
            else if (arrays[0] == 'End2') {
                //暂停抽二等奖前
                flagStartFirst = false;
                flagEndFirst = false;
                $(lucky_start).prop("src", ImageUrl_LuckyStartSmall);
                $(lucky_end).prop("src", ImageUrl_LuckyEndSmall);
                $(lucky_start).removeClass("lucky_scale");
                $(lucky_end).removeClass("lucky_scale");
                popTip("Please wait...");
            }

        }

        //连接断开
        socket.onclose = function(event) {
            //alert('close');
            popTip("connect close,on reconnect...");
            flagStartFirst = false;
            flagEndFirst = false;
            $(lucky_start).prop("src", ImageUrl_LuckyStartSmall);
            $(lucky_end).prop("src", ImageUrl_LuckyEndSmall);
            $(lucky_start).removeClass("lucky_scale");
            $(lucky_end).removeClass("lucky_scale");
            InitConnet.closeInterval();
            InitConnet.ConnetInterval();
        }
        window.onbeforeunload = function() {
            send("close");
        };

    }


//发送
function send(strMsg) {
   
    try {
        socket.send("MSG," +strMsg);
    }
    catch (exception) {
        // message.innerHTML += "<p>发送数据出错.</p>";
        popTip("fail")
    }
}


//弹出tip
function popTip(tiptext) {
    var tipText = tiptext;
    var tip = '<div class="pop-tip"><div class="tip-text">' + tipText + '</div></div>';
    $('body').append(tip);
    setTimeout('$(".pop-tip").fadeOut().remove()', 3000);
}

})

function IsPhone() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            /* phone */
            flag = true;
            break;
        } else {
            /* PC */
            flag = false;
        }
    }
    return flag;
}