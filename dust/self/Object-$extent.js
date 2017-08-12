/**
 * typeof 类型检测
 * @param   {Mix}      test
 * @param   {String}   type
 * @return  {Boolean}
 */
function typeOf (test, type) {
	return typeof test === type;
}

/**
 * 是否是纯粹对象
 */
 function isPlainObject (object) {
	if (!object || !isObject(object) || object.nodeType || object === object.window) {
		return false;
	}

	if (object.constructor && !has.call(object.constructor.prototype, 'isPrototypeOf')) {
		return false;
	}

	return true;
}

/**
 * 是否是空对象
 * @param   {Object}   object
 * @return  {Boolean}
 */
 function isEmptyObject (object) {
	return Object.keys(object).length === 0;
}

/**
 * 扩展合并对象，摘自 jQuery
 */
 function extend () {
	var options, name, src, copy, copyIsArray, clone;
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

	// Handle a deep copy situation
	if (isBool(target)) {
		deep = target;
		target = arguments[i] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if (typeof target !== 'object' && !isFunc(target)) {
		target = {};
	}

	// Extend Util itself if only one argument is passed
	if (i === length) {
		target = this;
		i--;
	}
    

	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && isArray(src) ? src : [];

					} else {
						clone = src && isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = extend(deep, clone, copy);
				}
				// Don't bring in undefined values
				else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
}

/**
 * 返回 contrastObject 相对于 referObject 的差异对象
 * @param   {Object}  contrastObject  [对比对象]
 * @param   {Object}  referObject     [参照对象]
 * @return  {Object}
 */
function getUniqueObject (contrastObject, referObject) {
	var unique = {};

	each(contrastObject, function (value, key) {
		var _diff, oldItem = referObject[key];

		if (isObject(value)) {
			_diff = getUniqueObject(value, oldItem);
			if (!isEmptyObject(_diff)) {
				unique[key] = _diff;
			}
		} else if (isArray(value)) {
			var newArray = [];

			each(value, function (nItem, index) {
				var _diff;

				if (isObject(nItem)) {
					_diff = getUniqueObject(nItem, oldItem[index]);
					newArray.push(_diff);
				}
				else {
					// 新数组元素
					if (oldItem.indexOf(nItem) < 0) {
						newArray.push(nItem);
					}
				}
			});

			unique[key] = newArray;
		} else {
			if (value !== oldItem) {
				unique[key] = value;
			}
		}
	});

	return unique;
}