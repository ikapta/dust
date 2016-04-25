define(function(require, exports, module) {
    require('lib/jsviews');
    
    var jsviews = {
        /**
         * jsViews 渲染 
         * 
         * @param htmlTPL (html模板)
         * @param target (传入目标选择器 id(推荐) or class)
         * @param renderData (传入的数据)
	 * $('body').append($.templates(IndexTemp.kaptaTest).render(data));
	 * $.templates(IndexTemp.kaptaTest).link('body',data)
         */
        Render:function(htmlTPL,target,renderData) {
            $.templates("htmlTPL", htmlTPL);
            var html = $.templates.htmlTPL.render(renderData);
            $(target).append(html);
        }
        
	}

   
    module.exports = jsviews;
});