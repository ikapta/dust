define(function(require, exports, module) {
    // var $ = require('lib/jQuery'),
    urlPrefix = "http://"+window.location.host+"/",
        _defaultConfig = {
            write: {
                type:'POST',
                dataType: 'json',
                cache:false
            },
            read: {
                type:'GET',
                dataType: 'json',
                cache: false
            }
        };
    
    var ajax={
    		urlAddress:urlPrefix,
            url:{
            	"userOpenId":"pub/getOpenId.json",
                'TestInder':'http://gc.ditu.aliyun.com/geocoding'
            },
            write: function(config){
                if(config.url.indexOf('http://')<0 && config.url.indexOf('https://')<0){
                    config.url = urlPrefix + config.url;
                }

                // config.url = urlPrefix + encodeURIComponent(config.url);
                return $.ajax($.extend(_defaultConfig.write, config));
            },
            read: function(config){
                if(config.url.indexOf('http://')<0 && config.url.indexOf('https://')<0){
                    config.url = urlPrefix + config.url;
                }
                // config.url = urlPrefix + encodeURIComponent(config.url);
                return $.ajax($.extend(_defaultConfig.read, config));
            },
            errorCode:{
                
            }
        };
     
     
    module.exports = ajax;
});
