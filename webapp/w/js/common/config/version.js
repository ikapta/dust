(function(global) {
     
    
	var config = function(key) {
        return {
           'app/appOpenLink':'common/app/appOpenLink.js?v='+key,
           'lib/art-template':'common/lib/template.js?v='+key,
           'lib/laypage':'common/lib/laypage.js?v='+key,
           'lib/jweixin':'common/lib/jweixin-1.0.0.js?v='+key,
           
           'common/utils':'common/utils.js?v='+key,
           'common/ajax':'common/ajax.js?v='+key,
           'common/LinkStop':'common/linkStop.js?v='+key,
           
        };
    } ;

	window.version = function(key) {
		return !key ? config() : config(key);
	};
    
})(this);