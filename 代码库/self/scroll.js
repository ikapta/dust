function autoScroll(obj) {
    if ($('.s4-line').length > 5) {
        $(obj).find(".s4-wrap").animate({
            marginTop: "-60px"
        }, 500, function() {
            $(this).css({
                marginTop: "0px"
            }).find(".s4-line:first").appendTo(this);
        })
    }
    if ($('.s3-line').length > 5) {
        $(obj).find(".s3-wrap").animate({
            marginTop: "-60px"
        }, 500, function() {
            $(this).css({
                marginTop: "0px"
            }).find(".s3-line:first").appendTo(this);
        })
    }
}
$(function() {
    setInterval('autoScroll(".s4-line-box")', 3000);
    setInterval('autoScroll(".s3-line-box")', 3000);
})



function autoScroll(obj) {
    $(obj).find(".rank-list").animate({
        marginTop: "-20px"
    }, 500, function() {
        $(this).css({
            marginTop: "0px"
        }).find("li:first").appendTo(this);
    })
}
$(function() {
    setInterval('autoScroll(".maquee")', 3000);
})


// ways 2
// 壕主滚动列表构造
var AutoScroll = function(scrollData) {
    var _this = this;
    _this.top = 0;
    _this.dataList = scrollData.find('dl');
    _this.singleHeight = _this.dataList.eq(0).height();
    _this.setScroll = function() {
        setInterval(function() {
            _this.top++;
            if (_this.top <= _this.singleHeight * (_this.dataList.length - 5)) {
                scrollData.animate({
                    'top': -_this.top + 'px'
                }, 1);
            } else {
                _this.top = 0;
            }
        }, 50)
    }
}