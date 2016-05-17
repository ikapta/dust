/** 
 * @author tiantian
 * @version 0.1.0.0 
 * @class milo.util.Object 
 * 对象方法集<br/>
 * added to milo by cathzhang on 2011-12-27<br/>
 * modified: 原类名为JsonObject考虑以Object命名更符合各中方法。
 * modified: 移除clone和extend方法 milo.base已涵盖<br/>
 * modified: 移除encode和decode方法 暂无具体可用案例<br/>
 * modified: toJsonString 方法名修改为 jsonToString 保持和其他命令的一致<br/>
 * @demo http://gameact.qq.com/milo/util/object.html
 */

var JsonObject = {
	_option : {
		'SERIALIZE_ILLEGAL_CHARACTER' : ['=', '|'] //序列化的非法字符配置
	},
	/**
	 * 序列化JSON对象
	 * 对object转化为url参数字符串，各属性间以&分隔，如a=1&b=2&c=3
	 * 对象属性为string 则进行encodeURIComponent编码
	 * 对象属性为bool 则以0代表false 1代表true
	 * 对象属性为对象，则会继续进行递归序列化
	 * 对象属性为function 则返回function.toString
	 * @param {object} jsonObj json对象
	 * @return {string}
	 */
	serialize : function(jsonObj){
		var newJsonObj = null;
		if (typeof(jsonObj) == 'undefined' || typeof(jsonObj) == 'function') 
			newJsonObj = '';
		if (typeof(jsonObj) == 'number') 
			newJsonObj = jsonObj.toString();			
		if (typeof(jsonObj) == 'boolean') 
			newJsonObj = (jsonObj) ? '1' : '0';
		if (typeof(jsonObj) == 'object') {
			if (!jsonObj) newJsonObj = '';
			if (jsonObj instanceof RegExp) newJsonObj = jsonObj.toString();
		}
		if (typeof(jsonObj) == 'string') 
			newJsonObj = jsonObj;		
		if (typeof(newJsonObj) == 'string') 
			return encodeURIComponent(newJsonObj);
			
		var ret = [];
		if (jsonObj instanceof Array) {
			for (var i = 0; i < jsonObj.length; i++) {
				if (typeof(jsonObj[i]) == 'undefined') 	continue;
				ret.push(typeof(jsonObj[i]) == 'object' ? '' : JsonObject.serialize(jsonObj[i]))
			}
			return ret.join('|')
		} 
		else {
			for (var i in jsonObj) {				
				if (typeof(jsonObj[i]) == 'undefined') 	continue;
				newJsonObj = null;
				if (typeof(jsonObj[i]) == 'object') {
					if (jsonObj[i] instanceof Array) {
						newJsonObj = jsonObj[i];
						ret.push(i + '=' + JsonObject.serialize(newJsonObj));
					} else {
						ret.push(i + '=')
					}
				} else {
					newJsonObj = jsonObj[i];
					ret.push(i + '=' + JsonObject.serialize(newJsonObj));
				}
			}
			return ret.join('&')
		}
	},
	/**
	 * 反序列化为JSON对象
	 * 对url参形形式的对象反序列化成为JSON对象
	 * 与serialize相对应
	 * @param {object} jsonObj json对象
	 * @return {string}
	 */
	unSerialize : function(jsonStr){
		jsonStr = jsonStr.toString();
		if (!jsonStr) return {};
		var retObj = {}, 
			obj1Ret = jsonStr.split('&');
		if (obj1Ret.length == 0) return retObj
		for (var i = 0; i < obj1Ret.length; i++) {
			if (!obj1Ret[i]) continue;
			var ret2 = obj1Ret[i].split('=');
			if (ret2.length >= 2) {
				var ret0 = obj1Ret[i].substr(0, obj1Ret[i].indexOf('=')),
					ret1 = obj1Ret[i].substr(obj1Ret[i].indexOf('=') + 1);
				if (!ret1) ret1 = '';
				if (ret0) retObj[ret0] = ret1
			}
		}
		return retObj;
	},
	/**
	 * 得到一个新对象，对象中的属性a对象有，b对象没有
	 * @param {object} a json对象	
	 * @param {object} b json对象
	 * @return {object}
	 */
	minus : function(option, opt){
		var newopt = {};
		for(var i in option){
			if(typeof(opt[i]) == 'undefined'){
				newopt[i] = option[i];
			}
		}
		return newopt;
	},
	/**
	 * 得到一个新对象，对象中的属性是a对象和b对象中都存在的
	 * @param {object} a json对象	
	 * @param {object} b json对象
	 * @return {object}
	 */
	intersect : function(option, opt){
		var newopt = {};
		for(var i in option){
			if(typeof(opt[i]) != 'undefined'){
				newopt[i] = option[i];
			}
		}
		return newopt;
	},
	/**
	 * 遍例对象中的每个属性，将属性的key和value返回执行回调方法
	 * 类似于jquery中的each方法
	 * @param {object} jsonObj json对象	
	 * @param {method} callBackFun json对象
	 * @return {undefined}
	 */
	each : function(jsonObj, callBackFun){
		if(typeof(jsonObj) != 'object' || typeof(callBackFun) != 'function'){
			return;
		}
		if(jsonObj instanceof Array){//数组
			for(var i = 0; i < jsonObj.length; i++){
				if(callBackFun(i, jsonObj[i])){
					return;
				}
			}
		}else{
			for(var i in jsonObj){//对象
				if(callBackFun(i, jsonObj[i])){
					return;
				}
			}
		}
	},
	/**
	 * 字符串转化成json对象
	 * @param {string} str 字符串
	 * @return {object}
	 */
	stringToJson : function(str){
		var a;
		eval('a=' + str + ';');
		return a; 
	},
	/**
	 * object对象转化为string
	 * 原方法名toJsonString
	 * @param {object} obj 对象
	 * @return {string}
	 */
	jsonToString : function(obj){
		switch(typeof(obj)){
			case 'object':
				var ret = [];
				if (obj instanceof Array){
					for (var i = 0, len = obj.length; i < len; i++){
						ret.push(JsonObject.jsonToString(obj[i]));
					}
					return '[' + ret.join(',') + ']';
				}else if (obj instanceof RegExp){
					return obj.toString();
				}else{
					for (var a in obj){
						ret.push('"' + a + '":' + JsonObject.jsonToString(obj[a]));
					}
					return '{' + ret.join(',') + '}';
				}
			case 'function':
				return 'function() {}';
			case 'number':
				return obj.toString();
			case 'string':
				return "\"" + obj.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function(a) {return ("\n"==a)?"\\n":("\r"==a)?"\\r":("\t"==a)?"\\t":"";}) + "\"";
			case 'boolean':
				return obj.toString();
			case 'undefined':
				return 'undefined';
			default:
				return obj.toString();
		}
	},
	/**
	 * 将Xml转化为json对象。如：
	 * <menu_item id="1"><item>abcv</item></menu_item> 将转化为：
	 * {menu_item:{@id:"1",item:{#text:"abcv"}}}
	 * @param {xmldom} xmlDocOrStr xml对象
	 * @return {object} object对象
	 */
	xmlToJson : function(xmlDocOrStr){
		var xmlDoc = null;
		if(typeof(xmlDocOrStr) == 'string'){
			var createXml = function(str){
				if(document.all){ 
						var Dom=new ActiveXObject("Microsoft.XMLDOM");
						Dom.loadXML(str);
						return Dom;
					}else{
						return new DOMParser().parseFromString(str, "text/");
					}
			};
			xmlDoc = createXml(xmlDocOrStr);
		}else if(typeof(xmlDocOrStr) == 'object'){
			xmlDoc = xmlDocOrStr;
		}
		
		if(!xmlDoc){
			return null;
		}   
		/**
		 * 判断该节点是否只包含文本节点
		 * @private
		 * @param {Object} node 用于判断的 节点
		 * @return {Boolean} 如果只包含文本内容为 true
		 */
		var nodeHasValue = function(node){
			if(node){
				var child = node.firstChild;
				if (child && child.nextSibling === null && (child.nodeType === 3 /* Node.TEXT_NODE */ || child.nodeType === 4 /* CDATA_SECTION_NODE */))
					return true;
			}
			return false;
		};
		/**
		 * 把 Node 转换成 JSON 格式
		 * @private
		 * @param {Object} node 用于转换的 节点
		 * @requires EYoo.XML.nodeHasValue 判断该节点是否只包含文本节点
		 * @return {Object} obj JSON 格式的信息
		*/
		var nodeToObject = function(node){
			if (!node)
				return null;
			var obj = {};
			// Add all attributes as properties of the object.
			for (var i = 0; i < node.attributes.length; i++){
				var attr = node.attributes[i];
				var attrName = "@" + attr.name;
				obj[attrName] = attr.value;
			}
		
			var child;
			// 判断该节点是否只包含文本节点
			if(nodeHasValue(node)){
				try{
					child = node.firstChild;
					if (child.nodeType == 3 /* TEXT_NODE */){
						obj[child.nodeName] = child.data;
					}else if (child.nodeType == 4 /* CDATA_SECTION_NODE */){
						obj[child.nodeName] = child.data;
					}
				}catch(e){
					throw("nodeToObject() exception caught: " + e + "\n");
				}
		
			}else{
				// 如果不是文本节点
				child = node.firstChild;
				while(child){
					if (child.nodeType == 1 /* Node.ELEMENT_NODE */){
						var isArray = false;
						var tagName = child.nodeName;
		
						// 如果已经存在该节点信息了，则转换成 Array 类型
						if(obj[tagName]){
							if(obj[tagName].constructor != Array){
								var curValue = obj[tagName];
								obj[tagName] = new Array;
								obj[tagName].push(curValue);
							}
							isArray = true;
						}
						var childObj = nodeToObject(child);
		
						if (isArray)
							obj[tagName].push(childObj);
						else
							obj[tagName] = childObj;
					}
					child = child.nextSibling;
				}
			}
			return obj;
		};
		
		var xmlToObject = function(xmlDoc){
			var obj = null;
			if(xmlDoc && xmlDoc.firstChild){
				var child = xmlDoc.firstChild;
				while(child){
					if(child.nodeType == 1 /* Node.ELEMENT_NODE */){
						obj = {};
						obj[child.nodeName] = nodeToObject(child);
						break;
					}
					child = child.nextSibling;
				}
			}
			return obj;
		};
		return xmlToObject(xmlDoc);
	},
	/**
	 * 对整个object进行utf8格式的url编码
	 * @param {object} newopt 编码对象
	 * @return {object} 已编码对象
	 */
	encode : function(newopt) {
		if (typeof(newopt) == 'string') {
			return encodeURIComponent(newopt)
		}
		if (typeof(newopt) == 'object') {
			if (newopt == null) {
				return null
			}
			if (newopt instanceof Array) {
				for (var i = 0; i < newopt.length; i++) {
					newopt[i] = JsonObject.encode(newopt[i])
				}
				return newopt
			} else if (newopt instanceof RegExp) {
				return newopt
			} else {
				for (var i in newopt) {
					newopt[i] = JsonObject.encode(newopt[i])
				}
				return newopt
			}
		}
		return newopt
	},
	/**
	 * 对整个object进行utf8格式的url解码
	 * @param {object} newopt 解码对象
	 * @return {object} 已解码对象
	 */
	decode : function(newopt) {
		if (typeof(newopt) == 'string') {
			try {
				return decodeURIComponent(newopt)
			} catch(e) {}
			return newopt
		}
		if (typeof(newopt) == 'object') {
			if (newopt == null) {
				return null
			}
			if (newopt instanceof Array) {
				for (var i = 0; i < newopt.length; i++) {
					newopt[i] = JsonObject.decode(newopt[i])
				}
				return newopt
			} else if (newopt instanceof RegExp) {
				return newopt
			} else {
				for (var i in newopt) {
					newopt[i] = JsonObject.decode(newopt[i])
				}
				return newopt
			}
		}
		return newopt
	},
	/**
	 * 为对象进行扩展属性和方法
	 * @param {object} object 对象
	 * @return {bool} 是/否
	 * 兼容老代码 will添加
	 */
	extend : function(destination, source) {
		var newopt = source;
		for (var i in destination) {
			if (isObject(source) && typeof(source[i]) != 'undefined') {
				destination[i] = newopt[i]
			}
		}
		return destination
	},
	/*
	 * 兼容老代码 will添加
	 *
	 */
	toJsonString : function(obj){
        switch(typeof(obj)){
            case 'object':
                var ret = [];
                if (obj instanceof Array){
                    for (var i = 0, len = obj.length; i < len; i++){
                        ret.push(JsonObject.toJsonString(obj[i]));
                    }
                    return '[' + ret.join(',') + ']';
                }else if (obj instanceof RegExp){
                    return obj.toString();
                }else{
                    for (var a in obj){
                        ret.push('"' + a + '":' + JsonObject.toJsonString(obj[a]));
                    }
                    return '{' + ret.join(',') + '}';
                }
            case 'function':
                return 'function() {}';
            case 'number':
                return obj.toString();
            case 'string':
                return "\"" + obj.replace(/(\\|\")/g, "\\$1").replace(/\n|\r|\t/g, function(a) {return ("\n"==a)?"\\n":("\r"==a)?"\\r":("\t"==a)?"\\t":"";}) + "\"";
            case 'boolean':
                return obj.toString();
            case 'undefined':
                return 'undefined';
            default:
                return obj.toString();
        }
    },
	/*
	 * 兼容老代码 will添加
	 *
	 */
	isFunction: function( fn ) {
		return !!fn && typeof fn != "string" && !fn.nodeName &&
			fn.constructor != Array && /^[\s[]?function/.test( fn + "" );
	}

};

define( "Object", [], function () { return JsonObject; } );/*  |xGv00|dce47957d93bef48de4101e27795d369 */