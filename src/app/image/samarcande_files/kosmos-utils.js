/*
 * Copyright (C) 2015 - 2018 Kosmos contact@kosmos.fr
 *
 * Projet: webapp
 * Version: 6.07.65
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Array functions
 */
    // Function to remove a value if found in a array
Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};
/**
 * Origin fix
 */
if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}

var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

function escapeHtml(string) {
	return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
		return entityMap[s];
	});
}
/**
 * jQuery extensions
 */
(function ($) {
    var _old = $.unique;
    // Extends jQuery default 'unique' to all kind of object
    $.unique = function (arr) {
        if (arr && $.isArray(arr) && arr.length > 0) {
            // do the default behavior only if we got an array of elements
            if (!!arr[0].nodeType) {
                return _old.apply(this, arguments);
            } else {
                // reduce the array to contain no dupes via grep/inArray
                return $.grep(
                    arr, function (v, k) {
                        return $.inArray(v, arr) === k;
                    });
            }
        } else {
            return [];
        }
    };
    // Convert a value to an int
    $.parseInteger = function (value) {
        return parseInt(value, 10) || 0;
    };
    // Protect a string by escaping characters with slashes
    $.protectString = function (str) {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    };
    // Clean an array of its empty or null values
    $.cleanArray = function (array) {
        var newArray = [],
            whiteSpace = /^\s$/i;
        for (var i = 0; i < array.length; i++) {
            if (array[i] && !whiteSpace.test(array[i])) {
                newArray.push(array[i]);
            }
        }
        return newArray;
    };
    // Replace all '{n}' by parameters[n] in the given string
    $.parametizeString = function (string, parameters) {
        var regExp = new RegExp("\{[0-9]+\}", "gi"),
            stringParams = $.unique(string.match(regExp)),
            parametizedString = string;
        // For each stringParams found
        for (var i = 0; i < stringParams.length; i++) {
            var replaceExp = new RegExp(stringParams[i].replace('{', '\\{').replace('}', '\\}'), 'g');
            parametizedString = parametizedString.replace(replaceExp, parameters[i] ? parameters[i] : '');
        }
        return parametizedString;
    };
    // Check if a value is of type 'int'
    $.isInt = function (value) {
        return !isNaN(value) && parseInt(Number(value)) == value && !isNaN(parseInt(value, 10));
    }
    // Check if a value is of type 'function'
    $.isFunction = function (functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    }
    // Retrieve 'source' css style (inherited, native, descended, inline, etc)
    // only : whitelist (property wich WILL be included in the final style)
    // except : blacklist (property wich will NOT be included in the final style)
    $.fn.getStyles = function (only, except) {

        // the map to return with requested styles and values as KVP
        var product = {};
        // the style object from the DOM element we need to iterate through
        var style;
        // recycle the name of the style attribute
        var name;
        // if it's a limited list, no need to run through the entire style object
        if (only && only instanceof Array) {
            for (var i = 0, l = only.length; i < l; i++) {
                // since we have the name already, just return via built-in .css method
                name = only[i];
                product[name] = this.css(name);
            }
        } else {

            // otherwise, we need to get everything
            var dom = this.get(0);
            // standards
            if (window.getComputedStyle) {

                // convenience methods to turn css case ('background-image') to camel ('backgroundImage')
                var pattern = /\-([a-z])/g;
                var uc = function (a, b) {
                    return b.toUpperCase();
                };
                var camelize = function (string) {
                    return string.replace(pattern, uc);
                };
                // make sure we're getting a good reference
                if (style = window.getComputedStyle(dom, null)) {
                    var camel, value;
                    // opera doesn't give back style.length - use truthy since a 0 length may as well be skipped anyways
                    if (style.length) {
                        for (var i = 0, l = style.length; i < l; i++) {
                            name = style[i];
                            camel = camelize(name);
                            value = style.getPropertyValue(name);
                            product[camel] = value;
                        }
                    } else {
                        // opera
                        for (name in style) {
                            camel = camelize(name);
                            value = style.getPropertyValue(name) || style[name];
                            product[camel] = value;
                        }
                    }
                }
            }
            // IE - first try currentStyle, then normal style object - don't bother with runtimeStyle
            else if (style = dom.currentStyle) {
                for (name in style) {
                    product[name] = style[name];
                }
            }
            else if (style = dom.style) {
                for (name in style) {
                    if (typeof style[name] != 'function') {
                        product[name] = style[name];
                    }
                }
            }
        }
        // remove any styles specified...
        // be careful on blacklist - sometimes vendor-specific values aren't obvious but will be visible...  e.g., excepting 'color' will still let '-webkit-text-fill-color' through, which will in fact color the text
        if (except && except instanceof Array) {
            for (var i = 0, l = except.length; i < l; i++) {
                name = except[i];
                delete product[name];
            }
        }
        // one way out so we can process blacklist in one spot
        return product;
    };
    // Extends selectors abilities
    var matcher = /\s*(?:((?:(?:\\\.|[^.,])+\.?)+)\s*([!~><=]=|[><])\s*("|')?((?:\\\3|.)*?)\3|(.+?))\s*(?:,|$)/g;

    function _resolve(element, data) {
        data = data.match(/(?:\\\.|[^.])+(?=\.|$)/g);
        var cur = jQuery.data(element)[data.shift()];
        while (cur && data[0]) {
            cur = cur[data.shift()];
        }
        return cur || undefined;
    }

    $.expr[':'].data = function (el, i, match) {
        matcher.lastIndex = 0;
        var expr = match[3],
            m,
            check, val,
            allMatch = null,
            foundMatch = false;
        while (m = matcher.exec(expr)) {
            check = m[4];
            val = _resolve(el, m[1] || m[5]);
            switch (m[2]) {
                case '==':
                    foundMatch = val === check;
                    break;
                case '!=':
                    foundMatch = val !== check;
                    break;
                case '<=':
                    foundMatch = val <= check;
                    break;
                case '>=':
                    foundMatch = val >= check;
                    break;
                case '~=':
                    foundMatch = new RegExp(check).test(val);
                    break;
                case '>':
                    foundMatch = val > check;
                    break;
                case '<':
                    foundMatch = val < check;
                    break;
                default:
                    if (m[5]) {
                        foundMatch = !!val;
                    }
            }
            allMatch = allMatch === null ? foundMatch : allMatch && foundMatch;
        }
        return allMatch;
    };
    // private : used to generate parts of GUID
    function s4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    // Used to generate GUID
    $.generateGuid = function () {
        return (s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4());
    };
})(jQuery);
