define(function(require, exports, module) {
    require('lib/sodarender');
  var laypage= require('lib/laypage');
    var Utils = require('common/utils'),
        Ajax = require('common/ajax'),
        Atpl = require('lib/art-template');

    var app = {
        init: function() {
            var _this = this;
            $('body').prop('class', 'sdfsdf');
            var isRegister = Utils.getParameter("isRegister");
            console.log(isRegister);
            _this.testAjax();
            _this.testSodaRender();

            _this.pageSize = 4;
            _this.pageIndex = 1;
            _this.datas = _this.initData();
            _this.page(); //默认从第一页开始渲染数据

        },
        //测试artTemplate
        testAjax: function() {
            var data = {
                title: 'TEST',
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
        },
        
        //测试sodaRender
        testSodaRender: function() {
            var response = {
                 title: 'TEST',
                 isPeople: true,
                peoples: [{
                    name: '贤心',
                    city: '杭州',
                    isPeople: true,
                }, {
                    name: '谢亮',
                    city: '北京',
                    isPeople: false,
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
            $('#sodaCont').after(sodaRender($('#sodaCont_tpl').html(), response));
        },

        //使用Inno New Page()分页见InitFront项目目录
        //使用laypage分页
        page: function() {
           /**
              本地分页直接能拿到数据总数
              服务器分页，得递归调用，见官网
            */
            var _this=this;
            laypage({
                cont: 'forPage',
                pages:Math.ceil(_this.datas.length/_this.pageSize) , //总页数
                curr:  _this.pageIndex, //当前页码
                prev: '<', //若不显示，设置false即可
                next: '>', //若不显示，设置false即可
                first: false,
                last: false, 
                //skip:true, //开启跳页
                groups:3,//只显示3个分页
                jump: function(obj) {
                    //少一个暂无数据判断
                    var onePageData = _this.datas.slice((obj.curr - 1) * _this.pageSize, (obj.curr) * _this.pageSize);
                     json={
                         list:onePageData
                     };
                    $('#pageCont').html(Atpl('pageCont_tpl',json));   
                }
            });

        },
        initData: function(params) {
            var _this = this;
            var res = [{
                    "index": 1,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 2,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 3,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 4,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 5,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 6,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 7,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 8,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 9,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 10,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 11,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 12,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 13,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 14,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 15,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 16,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 17,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 18,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 19,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 20,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 21,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }

                , {
                    "index": 18,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 19,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 20,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }, {
                    "index": 21,
                    "lon": 120.58531,
                    "level": 2,
                    "address": "",
                    "cityName": "",
                    "alevel": 4,
                    "lat": 31.29888
                }
            ];

            return res;
        }
    };

    app.init();
});