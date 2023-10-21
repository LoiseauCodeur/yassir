(function ($) {
    'use strict';
    $.fn.sortFunctions = {};
    $.fn.sortFunctions.alphaNumSort = function (m, n) {
        var cnt = 0, tem;
        var a = jQuery(m).text().toLowerCase();
        var b = jQuery(n).text().toLowerCase();
        if (a === b) {
            return 0;
        }
        var x = /^(\.)?\d/;
        var L = Math.min(a.length, b.length) + 1;
        while (cnt < L && a.charAt(cnt) === b.charAt(cnt) &&
        x.test(b.substring(cnt)) === false && x.test(a.substring(cnt)) === false) {
            cnt++;
        }
        a = a.substring(cnt);
        b = b.substring(cnt);
        if (x.test(a) || x.test(b)) {
            if (x.test(a) === false) {
                return (a) ? 1 : -1;
            } else if (x.test(b) === false) {
                return (b) ? -1 : 1;
            } else {
                tem = parseFloat(a) - parseFloat(b);
                if (tem !== 0) {
                    return tem;
                } else {
                    tem = a.search(/[^\.\d]/);
                }
                if (tem === -1) {
                    tem = b.search(/[^\.\d]/);
                }
                a = a.substring(tem);
                b = b.substring(tem);
            }
        }
        if (a === b) {
            return 0;
        } else {
            return (a > b) ? 1 : -1;
        }
    };
})(jQuery);

