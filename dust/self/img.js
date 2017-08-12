;
(function($) {
    'use strict';

    var kpa_Img = function() {
            var self = this;
        }
    // 预加载图片
    // .preoload('/img/p1.png','/img/p2.png')
    kap_img.prototype.preload = function() {
        for (var i = 0; i < arguments.length; i++) {
            $('<img>').attr('src', arguments[i]);
        }
    }

    // 图片加载完成
    kap_img.prototype.load = function(imgDom) {
            $(imgDom).load(function() {
                console.log('image load successful');
            });
        }
     // 自动修复失效的图片
    kap_img.prototype.error = function(imgDom) {
        $(imgDom).on('error', function() {
            if (!$(this).hasClass('broken-image')) {
                $(this).prop('src', 'img/broken.png').addClass('broken-image');
            }
        });
    }

})(window.Zepto || window.jQuery);