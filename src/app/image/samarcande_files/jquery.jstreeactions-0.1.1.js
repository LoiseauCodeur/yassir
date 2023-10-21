/*
 * jsTree actions plugin
 * 
 * jQuery.jstreeactions v0.1.1
 * 
 * Kosmos
 * 
 * Add actions to a range of items
 * MAY BE HEAVY IN LARGE DOM
 */

(function ($) {
    'use strict';
    $.jstree.plugin('actions', {

        __init: function () {
            var that = this;
            that.get_container().bind('init.jstree loaded.jstree refresh.jstree clean_node.jstree rename_node.jstree create_node.jstree', $.proxy(function (e, data) {
                var $li = that.get_container().find('.jstree-open, .jstree-closed, .jstree-leaf').filter(that._get_settings().actions.filter);
                that.__buildActions($li);
            }, this));

            that.get_container().bind("after_open.jstree", $.proxy(function (e, data) {
                var $li = data.rslt.obj.children("ul").find('li');
                that.__buildActions($li);
            }, this));

            that.get_container().bind("hover_node.jstree", function (event, data) {
                var $li = data.rslt.obj;
                $li.find("> a > div.jstree-actions").css({opacity: "1", display: "inline-block"});
            });

            that.get_container().bind("dehover_node.jstree", function (event, data) {
                that.get_container().find('.jstree-actions').filter(function () {
                    return $(this).css('opacity') != "0";
                }).css({opacity: "0", display: "none"});
            });
        },
        defaults: {
            buttons: {},
            filter: function (index) {
                var $this = $(this);
                return $(this).attr('rel') != 'root';
            }
        },
        __destroy: function () {
            this.get_container().find('.jstree-actions').remove();
        },
        _fn: {
            __buildActions: function (root) {
                var that = this;
                root.each(function () {
                    var $actions = $(this).find('.jstree-actions');
                    if ($actions.length === 0) {
                        var $link = $(this).find('> a'),
                            $actions = $('<div>').addClass('jstree-actions').appendTo($link),
                            actions = $.extend({}, that._get_settings().actions.buttons["default"], that._get_settings().actions.buttons[$(this).attr('rel')]);
                        if (actions) {
                            $.each(actions, function (index, button) {
                                var $parent = $actions.closest('li');
                                if(!button.filter || (button.filter && $.isFunction(button.filter) && button.filter($parent))) {
                                    if (button.binding) {
                                        var $button = $('<button>').addClass('jstree-button' + (button.className ? ' ' + button.className : '')).appendTo($actions);
                                        $.each(
                                            button.binding, function (eventType, process) {
                                                $button.bind(eventType, process);
                                            });
                                    }
                                }
                            });
                        }
                    }
                });
            },
            // Basic operations: rename (deal with text)
            get_text: function (obj) {
                obj = this._get_node(obj);
                if (!obj.length) {
                    return false;
                }
                var s = this._get_settings().core.html_titles;
                obj = obj.children("a:eq(0)");
                if (s) {
                    obj = obj.clone();
                    obj.children("INS").remove();
                    obj.children(".jstree-actions").remove();
                    return obj.text();
                }
                else {
                    obj = obj.contents().filter(function () {
                        return this.nodeType == 3;
                    })[0];
                    return obj.nodeValue;
                }
            }
        },

    });
})(jQuery);