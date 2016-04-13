(function(global) {
     
    
	var config = function(key) {
        return {
            "lib/jsviews":"lib/jsviews.min.js",
           
           "manager/version" : "manager/version.js?v="+key, 
           'manager/utils':'manager/utils.js?v='+key,
           'manager/ajax':'manager/ajax.js?v='+key,
           'manager/jsviews':'manager/jsviewsFun.js?v='+key,
           
           'template/indextpl':'template/index.tpl.js?v='+key,
           
           'modules/index':'modules/index.js?v='+key
        }
    } ;

	window.version = function(key) {
		return !key ? config() : config(key);
	}
    
    seajs.config({
        base: "../resources/js/", 
        alias: version(2),
    });
})(this);