var kapta = {

    /**
     * 获取参数
     *  window.search = localParam().search
     *  var s= kapta.localParam();
     *  if(s.search.parameName)
     */
    localParam: function (search, hash) {
        search = search || window.location.search;
        hash = hash || window.location.hash;
        var fn = function (str, reg) {
            if (str) {
                var data = {};
                str.replace(reg, function ($0, $1, $2, $3) {
                    data[$1] = $3;
                });
                return data;
            }
        }
        return {
            search: fn(search, new RegExp("([^?=&]+)(=([^&]*))?", "g")) || {},
            hash: fn(hash, new RegExp("([^#=&]+)(=([^&]*))?", "g")) || {}
        };
    },
    /**
     * 获取URL中的数据
     */
    getParameter: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    },
    // 获取文件扩展名
    // console.log(getFileExtension3(''));                            // ''
    // console.log(getFileExtension3('filename'));                    // ''
    // console.log(getFileExtension3('filename.txt'));                // 'txt'
    // console.log(getFileExtension3('.hiddenfile'));                 // ''
    // console.log(getFileExtension3('filename.with.many.dots.ext')); // 'ext'
    getFileExtension3: function (filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    },
    getFileExtension2: function (filename) {
        return filename.split('.').pop(); //不支持多个点
    },

    //设备判断  
    device: function () {
        var ua = navigator.userAgent;
        var obj = {
            isH5: /(Android|iPhone|iPad|iPod|iOS|Windows Phone)/i.test(ua), //手机
            isQQ: /\b(V1_AND_SQI?_([\d\.]+))|(.*? QQ\/([\d\.]+))/.test(ua), //手Q
            isQQPA: /.*? PA QQ\/([\d\.]+)/.test(ua), //手Q公众号（注：仅android下有效，iOS下无法区分是否公众号）
            isWX: /\bMicroMessenger\/([\d\.]+)/.test(ua), //微信
            isiOS: /(iPad|iPhone|iPod).*? (IPad)?/.test(ua), //iOS
            isAndroid: /\bandroid/i.test(ua), //Android
        };
        return obj;
    },
    /**
     * 生成区间随机数
     * Math.random()返回区间(0,1)
     */
    getRandom: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    /**
     * 生成指定长度字符串
     */
    generateRandomAlphaNum: function (len) {
        var rdmString = "";
        for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
        return rdmString.substr(0, len);
    },
    /**
     * 获取对象类型
     * @param {object} object 对象
     * @return {string} 类型
     * 可判断类型：Boolean Number String Function Array Date RegExp Object
     */
    getParamType: function (obj) {
        var self = this;
        return obj === null || obj === undefined ? String(obj) :
            Object.prototype.toString.call(obj).replace(/\[object\s+(\w+)\]/i, "$1") || "object";
    },

    /**
     * 停止事件继续进行
     * @param {event} e 事件
     * @return {dom} 
     */
    preventDefault: function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    },
    /**
     * 阻止事件冒泡传递
     * @param {event} e 事件
     * @return {dom} 
     */
    stopPropagation: function (e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
    },


    /**
     * 银行卡号显示信息
     * 6217***7988
     */
    bankAccount: function (acc) {
        var name = "";
        if (acc != null && acc.length > 4) {
            name = acc.substr(0, 4) + " *** " + acc.substr(acc.length - 4);
        }
        return name;
    },
    /**
     * 银行卡号显示4位尾号
     */
    bankEnd4No: function (acc) {
        var name = "";
        if (acc != null && acc.length > 4) {
            name = acc.substr(acc.length - 4);
        }
        return name;
    },
    //将投资金额以100,000.00的格式显示
    showMoney: function (data) {
        var data = data + '';
        var str = data.split('.')[0];
        var temp = '';
        if (str.length > 3) {
            while (str.length > 3) {
                if (temp == '') {
                    temp = str.substr(str.length - 3, str.length);
                } else {
                    temp = str.substr(str.length - 3, str.length) + ',' + temp;
                }
                str = str.substr(0, str.length - 3);
            }
            if (str != null || str != '') {
                temp = str + ',' + temp;
            }
        } else {
            temp = str;
        }
        if (data.split(".")[1] && data.split(".")[1] != null) {
            temp = temp + '.' + data.split(".")[1];
        } else {
            temp = temp + '.00';
        }

        return temp;
    },
    //显示手机号
    passMobile: function (tel) {
        if (tel != null) {
            return tel.substr(0, 3) + '****' + tel.substr(7, 11);
        }
        return null;
    },
    /**
     * 毫秒转为yyyy.MM.dd HH:mm:ss格式
     */
    dateFormat: function (millisecond) {
        if (millisecond == null || !millisecond || millisecond == '') {
            return '--';
        }
        var _this = this;
        var date = new Date(millisecond);
        var seperator1 = ".";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var temp_hours = date.getHours();
        var temp_minutes = date.getMinutes();
        var temp_seconds = date.getSeconds();
        if (temp_hours >= 1 && temp_hours <= 9) {
            temp_hours = "0" + temp_hours;
        }
        if (temp_minutes >= 1 && temp_minutes <= 9) {
            temp_minutes = "0" + temp_minutes;
        }
        if (temp_seconds >= 1 && temp_seconds <= 9) {
            temp_seconds = "0" + temp_seconds;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + temp_hours + seperator2 + temp_minutes + seperator2 + temp_seconds;
        return currentdate;

    },
    /**
     *   对Date的扩展，将 Date 转化为指定格式的String 
     *   月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
     *   年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     *   例子：
     *   (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     *   (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
     */
    fmtDate: function (date, fmt) { //author: meizz 
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },

    /**
     * 毫秒转为yyyy-MM-dd 格式
     */
    date2Format: function (millisecond) {
        if (millisecond == null || !millisecond || millisecond == '') {
            return "--";
        }
        var _this = this;
        var date = new Date(millisecond);
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
    /**
     * 毫秒转为yyyy.MM.dd 格式
     */
    date3Format: function (millisecond) {
        if (millisecond == 'null' || millisecond == null || !millisecond || millisecond == '') {
            return "----.--.--";
        }
        var _this = this;
        var date = new Date(millisecond);
        var seperator1 = ".";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
    /**
     * 毫秒转为MM月dd日 格式
     */
    date4Format: function (millisecond) {
        if (millisecond == null || !millisecond || millisecond == '') {
            return "--";
        }
        var _this = this;
        var date = new Date(millisecond);
        var seperator1 = "月";
        var seperator2 = "日";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var currentdate = month + seperator1 + strDate + seperator2;
        return currentdate;
    },
    /**
     * 剩余时间倒计时 ： 2016/05/19 13:32:19
     */
    showTime: function () {
        /*	    var endTime =" 2016/05/19 13:32:19";*/
        time_end = new Date(endTimelist1); //结束的时间
        var tt = time_end.getTime();
        var now = new Date().getTime();
        var cha = tt - now;
        var SysSecond = parseInt(cha);

        if (SysSecond > 0) {
            int_day = Math.floor(SysSecond / 86400000);
            SysSecond -= int_day * 86400000;
            int_hour = Math.floor(SysSecond / 3600000);
            SysSecond -= int_hour * 3600000;
            int_minute = Math.floor(SysSecond / 60000);
            SysSecond -= int_minute * 60000;
            int_second = Math.floor(SysSecond / 1000);

            if (int_hour < 10) {
                int_hour = "0" + int_hour;
            }

            if (int_minute < 10) {
                int_minute = "0" + int_minute;
            }

            if (int_second < 10) {
                int_second = "0" + int_second;
            }

            $(".m_index_box3 li:first-child .dayZ").html(int_day);
            $(".m_index_box3 li:first-child .hoursZ").html(int_hour);
            $(".m_index_box3 li:first-child .minutesZ").html(int_minute);
            $(".m_index_box3 li:first-child .secondsZ").html(int_second);
        } else {
            $(".m_index_box3 li:first-child .dayZ").html("00");
            $(".m_index_box3 li:first-child .hoursZ").html("00");
            $(".m_index_box3 li:first-child .minutesZ").html("00");
            $(".m_index_box3 li:first-child .secondsZ").html("00");
        }
        setTimeout('showTime()', 1000);
    },


    /**
     * 加上逗号
     */
    addComma: function (id) {
        id = id + "";
        var v, j, sj, rv = "";
        v = id.replace(/,/g, "").split(".");
        j = v[0].length % 3;
        sj = v[0].substr(j).toString();
        for (var i = 0; i < sj.length; i++) {
            rv = (i % 3 == 0) ? rv + "," + sj.substr(i, 1) : rv + sj.substr(i, 1);
        }
        var rvalue = (v[1] == undefined) ? v[0].substr(0, j) + rv : v[0].substr(0, j) + rv + "." + v[1];
        if (rvalue.charCodeAt(0) == 44) {
            rvalue = rvalue.substr(1);
        }
        return rvalue;
    },
    /**
     * 去掉逗号
     */
    removeComma: function (id) {
        id = id + "";
        var v;
        v = id.replace(/,/g, "");
        return Number(v);
    },
    /**
     * 金额用逗号隔开
     * @param s 金额
     * @param n 保留的小数点数，默认两位 00
     * @return
     */
    fmoney: function (s, n) {
        var self = this;
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(),
            r = s.split(".")[1];
        t = "";

        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }

        return t.split("").reverse().join("") + "." + r;
    },

    /**
     * 金额格式转化 ,调用 fmoney
     * @param money
     * @return
     */
    amountFormat: function (money) {
        var self = this;
        var amount, result, money2;


        if (1000 == money || 1000 < money && money <= 100000000) {
            amount = (money / 10000).toFixed(2);
            amount = self.fmoney(amount, 2);
            result = amount + "万";
            return result;
        }

        if (money > 100000000) {
            amount = (money / 100000000).toFixed(4);
            amount = self.fmoney(amount, 4);
            reslut = amount + "亿";
            return result;
        }

        money2 = fmoney(money, 2);
        result = money2 + "";

        if (result.indexOf(".") == -1) {
            result += ".00";
        }

        return result;
    },



    /**
     * 倒计时
     */
    timer: function (button, timer, msg) {
        var time = 90;
        var t = setInterval(function () {
            if (time == 0) {
                $(button).removeAttr("disabled");
                clearInterval(t);
                time = 90;
                $(timer).html("获取验证码");
                if (msg) {
                    $(timer).html(msg);
                }
            } else if (time > 0) {
                time = time - 1;
                $(timer).html("获取" + time + "秒");
            }
        }, 998);
    },

    /**
     * 获取分页总数 可以替换为 
     * Math.ceil(total/pageSize)
     */
    totalPage: function (total, pageSize) {
        var totalPage = 1;
        if (total != null && total != 0) {
            if (total % pageSize == 0) {
                totalPage = total / pageSize;
            } else {
                totalPage = parseInt(total / pageSize) + 1;
            }
        }
        return totalPage;
    },

    /**
     * js 浮点数计算值精确到多少位
     * eg:
     *    100-98.02=1.980000000000004
     *    decimalFormat((100-98.02),2) == 1.98
     */
    decimalFormat: function (value, n) {
        var f = parseFloat(value);
        return f.toFixed(n);
    },

    /** 
     * 判断是不是enter键
     */
    isEnterDown: function (e) {
        var keynum;
        if (window.event) // IE
        {
            keynum = e.keyCode;
        } else if (e.which) // Netscape/Firefox/Opera
        {
            keynum = e.which;
        }
        if (keynum != 13) return false;
        return true;
    },
    /**
     * 预加载图片
     * preloadImages('img/hover-on.png', 'img/hover-off.png');
     */
    preloadImages: function () {
        for (var i = 0; i < arguments.length; i++) {
            $('<img>').attr('src', arguments[i]);
        }
    },
    /**
     * 复制对象
     */
    clone: function (obj) {
        if(obj == null || typeof(obj) != 'object')
            return obj;

        var temp = obj.constructor(); // changed

        for(var key in obj) {
            if(obj.hasOwnProperty(key)) {
                temp[key] = clone(obj[key]);
            }
        }
        return temp;
    },

    /**
     * 为对象进行扩展属性和方法
     * @param {object} object 对象
     * @return {bool} 是/否
     */
    extend: function (destination, source) {
        var _this = this;
        if (destination == null) {
            destination = source
        } else {
            for (var property in source) {
                if (_this.getParamType(source[property]).toLowerCase() === "object" &&
                    _this.getParamType(destination[property]).toLowerCase() === "object")
                    _this.extend(destination[property], source[property])
                else
                    destination[property] = source[property];
            }
        }
        return destination;
    },

    extendLess: function (destination, source) {
        var newopt = source;
        for (var i in destination) {
            if (isObject(source) && typeof (source[i]) != 'undefined') {
                destination[i] = newopt[i]
            }
        }
        return destination
    }
}