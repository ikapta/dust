var util;

function getCookie(name) {
    //读取COOKIE
    var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"),
        val = document.cookie.match(reg);
    return val ? (val[2] ? unescape(val[2]) : "") : null;
}

function setCookie(name, value, expires, path, domain, secure) {
    //写入COOKIES
    var exp = new Date(),
        expires = arguments[2] || null,
        path = arguments[3] || "/",
        domain = arguments[4] || null,
        secure = arguments[5] || false;
    expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
    document.cookie = name + '=' + escape(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
}

function deleteCookie(name, path, domain, secure) {
    //删除cookie
    var value = this.get(name);
    if (value != null) {
        var exp = new Date();
        exp.setMinutes(exp.getMinutes() - 1000);
        path = path || "/";
        document.cookie = name + '=;expires=' + exp.toGMTString() + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    }
}

function urlSetHash(name) {
    setTimeout(function() {
        location.hash = name;
    }, 0);
}

function urlGetHash(url) {
    var u = url || location.hash;
    return u ? u.replace(/.*#/, "") : "";
}

function urlGetHashParam(name) {
    var result = this.getHash().match(new RegExp("(^|&)" + name + "=([^&]*)(&|$)"), "i");
    return result != null ? result[2] : "";
}

function urlGetUrlParam(name, url) {
    //参数：变量名，url为空则表从当前页面的url中取
    var u = arguments[1] || window.location.search,
        reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
        r = u.substr(u.indexOf("\?") + 1).match(reg);
    return r != null ? r[2] : "";
}

function urlParseUrl(url) {
    var a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function() {
            var ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

function toolGetuin (uin) {
    uin = uin || util.cookie.get('uin') || util.cookie.get('pt2gguin') || '';

    if (!uin) {
        try {
            uin = window.external.extendHuaYangGetUin();
        } catch (e) {}
    }
    if (uin && uin.indexOf('o') == 0) {
        uin = parseInt(uin.substring(1, uin.length), 10) || null;
    }

    return uin;

}

function device() {
    var ua = navigator.userAgent;
    var obj={
        isH5:/(Android|iPhone|iPad|iPod|iOS|Windows Phone)/i.test(ua),//手机
        isQQ:/\b(V1_AND_SQI?_([\d\.]+))|(.*? QQ\/([\d\.]+))/.test(ua),//手Q
        isQQPA:/.*? PA QQ\/([\d\.]+)/.test(ua),//手Q公众号（注：仅android下有效，iOS下无法区分是否公众号）
        isWX:/\bMicroMessenger\/([\d\.]+)/.test(ua),//微信
        isiOS:/(iPad|iPhone|iPod).*? (IPad)?/.test(ua),//iOS
        isAndroid:/\bandroid/i.test(ua),//Android
    };
    return obj;
}

/**
 * 如果支持webp 会把标示存到cookie中（_supWebp），7天
 * 使用的时候可以先判断 supportedWebP 如果否 在调用 isSupportedWebP 并传入回调函数
 * @returns {{supportedWebPQueue: Array, supportedWebP: undefined, supportedWebPIsLoading: boolean, isSupportedWebP: isSupportedWebP}}
 *
 * isSupportedWebP 如果不传回调函数 返回是否支持webp true 支持 false 不支持 undefined 还不知道支不支持这时需要传回调函数异步判断下
 */
function isSupWebp() {

    var obj = {
        'supportedWebPQueue': [],
        'supportedWebP': getCookie('_supWebp') || undefined,
        'supportedWebPIsLoading': false,
        'isSupportedWebP': isSupportedWebP
    };

	/**
     *
     * @param cb 回调函数 传入是否支持web的参数
     */
    function isSupportedWebP(cb) {

        if (obj.supportedWebP == '1') {
            obj.supportedWebP = true;
        } else if (obj.supportedWebP == '2') {
            obj.supportedWebP = false;
        }

        // 如果没有回调函数返回是否支持webp
        if (!cb) return obj.supportedWebP;

        var execute = function () {
            for (var i = 0, len = obj.supportedWebPQueue.length; i < len; i++) {
                obj.supportedWebPQueue[i](obj.supportedWebP);
            }
            obj.supportedWebPQueue = [];
        };
        if (obj.supportedWebP === undefined) {
            cb && obj.supportedWebPQueue.push(cb);
            if (!obj.supportedWebPIsLoading) {
                obj.supportedWebPIsLoading = true;

                var images = {
                    basic: "data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA=="
                }, $img = new Image(), startTime = new Date();
                $img.onload = function () {
                    obj.supportedWebP = this.width === 2 && this.height === 1;
                    obj.supportedWebPIsLoading = false;
                    execute();
                    setCookie('_supWebp', 1, 7 * 24 * 60);
                    //						console.log('supportedWebP', new Date() - startTime);

                };
                $img.onerror = function () {
                    obj.supportedWebP = false;
                    obj.supportedWebPIsLoading = false;
                    execute();
                    //						console.log('supportedWebP', new Date() - startTime);
                    setCookie('_supWebp', 2, 7 * 24 * 60);

                };
                $img.src = images.basic;
            }
        } else {
            cb && cb(obj.supportedWebP);
        }
    }

    isSupportedWebP();

    return obj
}

util = {
    'cookie': {
        get: getCookie,
        set: setCookie,
        del: deleteCookie
    },
    'url': {
        /**
         * 设置hash
         * @param name
         */
        setHash: urlSetHash,
        /**
         * 获取当前url中的hash值
         * @param url
         * @return String
         */
        getHash: urlGetHash,
        /*
         * 从hash中获取name对应的值
         */
        getHashParam: urlGetHashParam,
        /*
         *  从URL中获取参数对应的值
         */
        getUrlParam: urlGetUrlParam,
        parseUrl: urlParseUrl
    },
    tool: {
        getUin: toolGetuin
    },
    device: device,
    webp: isSupWebp()

};


module.exports = util;