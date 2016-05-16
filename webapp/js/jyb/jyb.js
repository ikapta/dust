define(function(require, exports, module) {
 require('lib/layer');
    var Utils = require('common/utils'),
        Ajax = require('common/ajax'),
        Atpl = require('lib/art-template');

    var app = {
        init: function() {
            var that = this;
            $('body').prop('class', 'sdfsdf');
            var isRegister = Utils.getParameter("isRegister");
            console.log(isRegister);
            that.testAjax();
            
        },
        testAjax: function() {
            var data = {
                title: '前端攻城师',
                isPeople: false,
                list: [{
                    name: '贤心',
                    city: '杭州'
                }, {
                    name: '谢亮',
                    city: '北京'
                }, {
                    name: '浅浅',
                    city: '杭州'
                }, {
                    name: 'Dem',
                    city: '北京'
                }, {
                    name: 'chao',
                    city: '上海'
                }]
            };
            $('#jsview').after(Atpl('demo', data));
        }
    };

    app.init();
});