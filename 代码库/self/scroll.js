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