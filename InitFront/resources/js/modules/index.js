define(function(require, exports, module) {

    var Utils = require('manager/utils'),
        Ajax = require('manager/ajax'),
        Jsviews=require('manager/jsviews'),
        Indextpl=require('template/indextpl'); 

    var app = {
        init: function() {
            var _this = this;
            $('body').prop('class', 'sdfsdf');
            var isRegister = Utils.getParameter("isRegister");
            console.log(isRegister);
            _this.testAjax();
        },
        testAjax: function() {
            var res = {
                "lon": 120.58531,
                "level": 2,
                "address": "",
                "cityName": "",
                "alevel": 4,
                "lat": 31.29888
            };
            Jsviews.Render(Indextpl.indexTest,'#jsview',res);
            Jsviews.Render(Indextpl.tt,'#jsview',res);
           
            // ajaxData={a:'苏州市'};
            // Ajax.read({
            //     url:Ajax.url.TestInder,
            //     data : ajaxData,
            //     dataType: 'jsonp', 
            //     contentType: "application/json;charset=UTF-8",
            //     success:function(responce){
            //         $('body').append(responce)
            //     }
            // })
        }
    };

    app.init();
});