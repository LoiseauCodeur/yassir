/*
 * jsTree search plugin
 * Enables both sync and async search on the tree
 * DOES NOT WORK WITH JSON PROGRESSIVE RENDER
 */
(function ($) {
    if ($().jquery.split('.')[1] >= 8) {
        $.expr[':'].jstree_highlight = $.expr.createPseudo(function (search) {
            return function (a) {
                return (a.textContent || a.innerText || "").toLowerCase().indexOf(search.toLowerCase()) >= 0;
            };
        });
        $.expr[':'].jstree_title_highlight = $.expr.createPseudo(function (search) {
            return function (a) {
                return (a.getAttribute("title") || "").toLowerCase().indexOf(search.toLowerCase()) >= 0;
            };
        });
    }
    else {
        $.expr[':'].jstree_highlight = function (a, i, m) {
            return (a.textContent || a.innerText || "").toLowerCase().indexOf(m[3].toLowerCase()) >= 0;
        };
        $.expr[':'].jstree_title_highlight = function (a, i, m) {
            return (a.getAttribute("title") || "").toLowerCase().indexOf(m[3].toLowerCase()) >= 0;
        };
    }
    $.jstree.plugin("kfilter", {
        __init: function () {
            var _this = this;
            this.data.kfilter.defaultAjax = _this.get_settings().json_data.ajax;
        },
        defaults: {
            ajax: false,
            highlight_method: "jstree_highlight"
        },
        _fn: {
            kfilter: function (str, skip_async) {
                var _this = this;
                if (!this.data.kfilter.initial_state) this.data.kfilter.initial_state = this.get_rollback();
                if ($.trim(str) === "") {
                    this.clear_kfilter();
                    return;
                }
                var s = this.get_settings().kfilter,
                    t = this;
                this.get_container().addClass('jstree-filtered');
                var newSettings = _this.get_settings();
                newSettings.json_data.ajax = s.ajax;
                this._set_settings(newSettings);
                this.load_node_json(-1, false, false);
            },
            clear_kfilter: function (str) {
                var _this = this;
                var newSettings = _this.get_settings();
                newSettings.json_data.ajax = _this.data.kfilter.defaultAjax;
                this._set_settings(newSettings);
                this.load_node_json(-1, function () {
                    this.get_container().removeClass('jstree-filtered');
                    _this.__rollback(_this.data.kfilter.initial_state);
                    _this.data.kfilter.initial_state = null;
                }, false);
            }
        }
    });
})(jQuery);
//*/
