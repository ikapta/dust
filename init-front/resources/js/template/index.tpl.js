define(function(require, exports, module) {
	
	var templates = {
		indexTest: '<div class="productDCon">\
						<div class="col-xs-12">lon: {{:index}}</div>\
		               <div class="col-xs-12">lon: {{:lon}}</div>\
		               <div class="col-xs-12">level: {{:level}}</div>\
		            </div> <hr>',
        tt: '你好'
	}

	module.exports = templates;
});