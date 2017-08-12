define(function(require, exports, module) {

    var util = {
        /**
         * jsViews 渲染 
         * 
         * @param htmlTPL (html模板)
         * @param target (传入目标选择器 id(推荐) or class)
         * @param renderData (传入的数据)
         */
        jsViews:function(htmlTPL,target,renderData) {
            $.templates("htmlTPL", htmlTPL);
            var html = $.templates.htmlTPL.render(renderData);
            $(target).append(html);
        },
        
		/**
		 * 获取URL中的数据
		 */
		getParameter : function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		},
        /**
         * 倒计时
         */
        
        Timer:function(button,time,callBack){
            $(button).prop("disabled",true);
			var time = time,
                tempTime=time;
			var t = setInterval(function() {
				if (time == 0) {
					$(button).removeAttr("disabled");
					clearInterval(t);
					time = tempTime;
					$(button).html("获取验证码");
				} else if (time > 0) {
					time = time - 1;
					$(button).html("获取" + time + "秒");
				}
			}, 998);
			callBack || callBack(t);
		},
	}

   
    module.exports = util;
});