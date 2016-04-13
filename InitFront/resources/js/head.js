var $ = jQuery.noConflict();// 解决命名冲突的问题
$(".header-wrap").prepend(
'<script src="/p/js/bootstrap-modal.js"></script>\
<link href="/p/css/modal-login.css" rel="stylesheet">\
<div class="top-banner-wrap">\
    <div class="top-banner">\
        <div class="contact">\
            <span>客服热线：<b>400-808-7988</b></span>\
			<em style=""></em>\
            <a class="wechat-link" title=""><div class="top-weixinb"></div>\</a>\
            <a class="weibo-link" title=""><div class="top-weibob"></div>\</a>\
		</div>\
        <div class="top-banner-link">\
            <a class="app-link">链车app<div class="top-app"></div>\</a>\
            <span>|</span>\
            <a title="新手指引" href="/p/pages/userGuide.html">新手指引</a>\
            <span>|</span>\
            <a title="最新活动" href="/p/pages/noviciateActivity.html">最新活动</a>\
            <span>|</span>\
            <a data-toggle="modal" title="登录" id="loginButton">登录</a>\
            <span>|</span>\
            <a class="red" title="注册" href="/p/pages/register.html" id="registerButton">注册</a>\
        </div>\
    </div>\
</div>\
<div class="header">\
    <div class="nav-wrap">\
        <div class="logo-box"><a href="/p/pages/index.html"></a></div>\
        <div class="nav-box">\
            <a id="index" href="/p/pages/index.html" >首页</a>\
            <a id="inves" href="/p/pages/invest.html" >我要投资</a>\
            <a id="safet" href="/p/pages/safety.html" >安全保障</a>\
            <a id="novic" href="/p/pages/noviciateActivity.html" >新手专区</a>\
            <a id="conta" href="/p/pages/company_introduce.html" >关于链车</a>\
            <a class="my-account-link" href="/p/page/myAccount.do" >我的账户</a>\
        </div>\
    </div>\
</div>\
<!--登录模态框-->\
<div id="loginpopup" class="modal fade" style="display: none;">\
<div class="modal-header">\
<a class="close" data-dismiss="modal"></a>\
</div>\
<div class="modal-body">\
<div class="modal-login-title">\
<b>登录</b>\
<span>没有账号？<a href="/p/pages/register.html" title="立即注册">立即注册</a></span>\
</div>\
<div class="modal-login-box modal-user">\
<input type="text" placeholder="请输入手机号码" id="cellphone" maxlength="11">\
</div>\
<div class="modal-login-box modal-psd">\
<input type="password" placeholder="请输入登录密码" id="login_password" maxlength="20">\
</div>\
<div class="modal-login-box">\
<p><span class="md-ck md-ckt">记住用户名</span><a href="/p/pages/findPassword.html" title="忘记密码？">忘记密码？</a> </p>\
</div>\
<div class="showError" style="position:absolute;bottom:60px;left:-41px;width:350px"></div>\
<div class="modal-login-btn">\
<a  title="立即登录" id="login">立即登录</a>\
</div>\
<div class="modal-login-error"></div>\
</div>\
</div>\
<!--登录模态框-->\
<script type="text/javascript">\
$(document).ready(function(){\
	$(".wechat-link").hover(function () {\
        $(".top-weixinb").show();\
    }, function () {\
		$(".top-weixinb").hide();\
    });\
	$(".weibo-link").hover(function () {\
        $(".top-weibob").show();\
    }, function () {\
		$(".top-weibob").hide();\
    });\
	$(".app-link").hover(function () {\
        $(".top-app").show();\
    }, function () {\
		$(".top-app").hide();\
    });\
    $(".nav-box a").hover(function () {\
        $(this).siblings("a").addClass("nav-default");\
    }, function () {\
        $(this).siblings("a").removeClass("nav-default");\
    });\
    $(".menu-wrap a").hover(function () {\
        $(this).siblings("a").addClass("nav-default");\
    }, function () {\
        $(this).siblings("a").removeClass("nav-default");\
    });\
	$(".myAccout_nav a").hover(function () {\
        $(this).siblings("a").addClass("nav-default");\
    }, function () {\
        $(this).siblings("a").removeClass("nav-default");\
    });\
	 $(".modal-login-btn a").click(function () {\
	  $(document.body).css({\
	  "overflow-x":"auto",\
	  "overflow-y":"auto"\
	  });\
	});\
	var path = window.location.pathname.substring(9,14);\
	$("[id="+path+"]").addClass("active");\
});\
</script>')
