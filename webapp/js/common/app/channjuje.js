/**
 * Created by lenovo on 2015/12/28.
 */


//WebViewJavascriptBridge 相关函数

//js向native 发送信息
function testClick() {
    //send message to native
    var data = {id: 1, content: "this is html test <img src=\"a.png\"/> test\r\nhahaha"};
    window.WebViewJavascriptBridge.send(
        data
        , function(responseData) {
            document.getElementById("show").innerHTML = "repsonseData from java, data = " + responseData
        }
    );

}
//调用native 的goLogin函数，去登录
function bg_goLogin() {

    //call native method
    window.WebViewJavascriptBridge.callHandler(
        'goLogin'
        , {'param': '登录测试'}
        , function(responseData) {
            document.getElementById("show").innerHTML = "send get responseData from java, data = " + responseData
        }
    );
}
//调用native 的goRedPackage函数，去提现/红包提现
function bg_goRedPackage() {

    //call native method
    window.WebViewJavascriptBridge.callHandler(
        'goRedPackage'
        , {'param': '红包提现测试'}
        , function(responseData) {
            document.getElementById("show").innerHTML = "send get responseData from java, data = " + responseData
        }
    );
}

//调用native 的goProductsPage函数，去去购买/ 去产品页面
function bg_goProductsPage() {

    //call native method
    window.WebViewJavascriptBridge.callHandler(
        'goProductsPage'
        , {'param': '产品购买测试'}
        , function(responseData) {
            document.getElementById("show").innerHTML = "send get responseData from java, data = " + responseData
        }
    );
}

//调用native 的shareActivity函数，去分享
function bg_shareActivity() {
	
    //call native method
    window.WebViewJavascriptBridge.callHandler(
        'shareActivity'
        , {'param': '分享测试'}
        , function(responseData) {
        	
            document.getElementById("show").innerHTML = "send get responseData from java, data = " + responseData
        }
    );
}

//bridge日志
function bridgeLog(logContent) {
    document.getElementById("show").innerHTML = logContent;
}

function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener(
            'WebViewJavascriptBridgeReady'
            , function() {
                callback(WebViewJavascriptBridge)
            },
            false
        );
    }
}

//bridge连接
connectWebViewJavascriptBridge(function(bridge) {
    //bridge初始化
    bridge.init(function(message, responseCallback) {
        //console.log('JS got a message', message);
        var data = {
            'Javascript Responds': 'Wee!'
        };
       // console.log('JS responding with', data);
        responseCallback(data);
    });
    //bridge 注册一个可以被Object-C 调用的方法
    bridge.registerHandler("functionInJs", function(data, responseCallback) {
        document.getElementById("show").innerHTML = ("data from Java: = " + data);
        var responseData = "Javascript Says Right back aka!";
        responseCallback(responseData);
    });
})

//获取URL参数值
function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}

//判断浏览器是否是微信内置浏览器
function is_weixin(){
    var ua = navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i)=="micromessenger") {
        return true;
    } else {
        return false;
    }
}

var $ = jQuery.noConflict();// 解决命名冲突的问题
$(function(){
    
    var channelName=getParameter("channel");
    var userName=getParameter("userId");
    
    if(channelName==null){channelName="";}
    if(userName==null){userName="";}
    
   /* $('.f_btn_register').click(function(event){
    	alert(userName)
    	if(userName == null || userName == ''){
            //调用native的对应方法,没有登录则需要登录
            alert(1)
        }
        else{
            //调用native的对应方法
           alert(2)
        }
        //阻止a标签跳转
        return false;
    });*/
    //非微信端不可以跳转（目前只有APP端？），用 return false阻止默认动作。
    //点击更多详情将转移userId至新url
    var thisHref=$("#yiqizhuanMore").attr("href");
    $("#yiqizhuanMore").attr("href",thisHref+"?userId="+userName+"&channel="+channelName);
    //if(!isWx){
    if(channelName=="app"){
    	
        // 红包攻略页面
        $("#hongbaotixianBT").click(function(event){
            //alert(event.type+"来自app的点击");
            //console.log(event.type+"来自app的点击");
            //调用native的对应方法
            bg_goRedPackage();
            //阻止a标签跳转
            return false;
        });

        // 一起赚钱-攻略页面                                +登录判断
        $("#yiqizhuanBT").click(function(event){
            //alert(event.type+"来自app的点击");
            //console.log(event.type+"来自app的点击");
            if(userName==null){
                //调用native的对应方法,没有登录则需要登录
                bg_goLogin();
            }
            else{
                //调用native的对应方法
                bg_shareActivity();
            }
            //阻止a标签跳转
            return false;
        });

        // 体验金-攻略页面
        $("#tiyanjinBT").click(function(event){
            //alert(event.type+"来自app的点击");
            //console.log(event.type+"来自app的点击");
            //调用native的对应方法
            bg_goProductsPage();
            //阻止a标签跳转
            return false;
        });

        // 加息券-攻略页面
        $("#jiaxiquanBT").click(function(event){
            //alert(event.type+"来自app的点击");
            //console.log(event.type+"来自app的点击");
            //调用native的对应方法
            bg_shareActivity();
            //阻止a标签跳转
            return false;
        });

        // 新手礼遇-页面                                 +第二个按钮加登录判断
        $("#xinshouliTopBT").click(function(event){
            //alert(event.type+"来自app的点击");
            //console.log(event.type+"来自app的点击");
            //调用native的对应方法
            bg_goLogin();
            //阻止a标签跳转
            return false;
        });
        $("#xinshouliBT").click(function(event){
            //alert(event.type+"来自app的点击");
            //console.log(event.type+"来自app的点击");
        	
            if(userName==null){
                //调用native的对应方法,没有登录则需要登录
                bg_goLogin();
            }
            else{
                //调用native的对应方法
            	bg_goProductsPage();
            }
            //阻止a标签跳转
            return false;
        });

        // 一起赚钱页面                                 +登录判断
        $("#yiqizhuanShare").click(function(event){
            //alert(event.type+"来自app的点击");
            //console.log(event.type+"来自app的点击");
            if(userName==null){
                //调用native的对应方法,没有登录则需要登录
                bg_goLogin();
            }
            else{
                //调用native的对应方法
                bg_shareActivity();
            }
            //阻止a标签跳转
            return false;
        });

        // 安全保障页面
        $("#safeControlBT").click(function(event){
            //alert(event.type+"来自app的点击");
            //console.log(event.type+"来自app的点击");
            //调用native的对应方法
            bg_goProductsPage();
            //阻止a标签跳转
            return false;
        });

        //新人新 钱 途 立即注册
       /* $('.f_btn_register').click(function(event){
            if( userName==null){
            	alert(1)
                //调用native的对应方法,没有登录则需要登录
                bg_goLogin();
            }
            else{
            	//立即投资 --》去产品页
            	bg_goProductsPage();
            }
            //阻止a标签跳转
            return false;
        });
*/
        //新人新 钱 途 立即分享好友
        $('.f_btn_friends').click(function(event){
            // 立即分享好友
        	
            ////阻止a标签跳转
            return false
        })
        //
    }
    //是微信端则继续跳转
    else if(channelName==" weixin"){
        //do nothing;
//        alert(event.type+"是来自微信端的点击");
        //console.log(event.type+"不是来自微信端的点击");
    }
    //其他情况
    else if(channelName==""){
//        alert(event.type+"通道值为空");
        //console.log(event.type+"通道值为空");
    }
    else {
//        alert(event.type+"来自未知通道"+navigator.userAgent.toLowerCase());
        //console.log(event.type+"来自未知通道"+navigator.userAgent.toLowerCase());
    }
});

