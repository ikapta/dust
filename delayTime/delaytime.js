(function ($) {
    $.fn.delaytime = function(options){
        var defaults = {
            time:5,
            autoExec:false, //是否页面加载的时候自动执行倒计时，或者实例化这个方法的时候执行
            startExec:function(){},//如果autoExec设置为false的话(先实例化了)，可以在需要的时候执行这个方法开始倒计时
            timeOn:function(o){}, //倒计时过程中,可以捕获到当前时间
            timeOut:function(){}//倒计时结束
        }
        var options = $.extend(defaults, options);
        var _thisDom=$(this);

        var progress = function() {
            var timenow=options.time;
                        if (timenow < 0) {
                            options.timeOut();
                            return false;
                        } else {
                            options.timeOn(timenow);
                            _thisDom.text(timenow);
                            timenow--;
                            options.time=timenow;
                        }
                        setTimeout(function () {
                            progress();
                        }, 1000);
                    };  
       if(options.autoExec){
         progress()
       }              
       this.startExec=function(){
            progress()
        }
        return this;
        }

})(jQuery);