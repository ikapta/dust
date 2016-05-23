/**
 * kapta
 * 实现本地分页，数据库分页同理
 */

define(function(require, exports, module) {
    require('manager/pages');
    var Utils = require('manager/utils'),
        Ajax = require('manager/ajax'),
        Jsviews = require('manager/jsviews'),
        Indextpl = require('template/indextpl');

    var app = {
        init: function() {
            var _this = this;

            _this.pageSize = 4;
            _this.pageIndex=1;

            _this.datas = _this.initData();
            _this.page_initial(_this.pageIndex); //默认从第一页开始渲染数据
        },


        page_initial: function(pageIndex) {
            var _this = this;
            var p = new Page('page');
            p.pageIndex=_this.pageIndex;
            p.recordCount = _this.datas.length; //数据总数
            p.numericButtonCount = 3; //显示的分页按钮数量
            p.pageSize = _this.pageSize;
            //p.getPageHtml=function () {} //重写原型方法生成自己的pageHTML，因为多个页面都引用pages.js的话，可能设计不一样，需要显示的按钮不一样
            
            //容器
            p.pageCanvas = 'pageContainerId'; // 显示分页页码的容器id
            var contentContainerId = '#jsview'; //列表内容容器id

            p.addListener('pageChanged', function() {
                /**
                 * 如果是数据库分页，此处就不需要自己进行拆分数据，拿数据了，直接渲染数据OK
                 * 
                 * 此处使用数组的原生方法slice()截取数组，还可以使用loadsh.js 中的chunk()方法直接分割成新的数据 newArray，然后每次通过 newArray[p.pageIndex] ，直接获得数据
                 *  _.chunk(['a', 'b', 'c', 'd'], 2);
                 *  => [['a', 'b'], ['c', 'd']]
                 */
                var onePageData = _this.datas.slice((p.pageIndex - 1) * _this.pageSize, (p.pageIndex) * _this.pageSize);
                $('#jsview').empty();
                Jsviews.Render(Indextpl.indexTest, contentContainerId, onePageData);
                p.render();
            });
            p.initialize();
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
            },{
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
            }];

            return res;
        }

    };

    app.init();
});