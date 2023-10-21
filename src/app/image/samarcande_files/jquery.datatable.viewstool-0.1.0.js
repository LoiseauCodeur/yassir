/*
 * jsTree actions plugin
 * 
 * Kosmos
 * 
 * Add actions to a range of items
 * MAY BE HEAVY IN LARGE DOM
 */

(function ($, w, d) {

    ViewsTool = function (a, b) {
        !this instanceof ViewsTool && alert("Warning: ViewsTool must be initialised with the keyword 'new'");
        this.settings = {
            that: this,
            dt: a.fnSettings(),
            custom: {}
        };
        this.dom = {
            container: null,
            dropdown: null,
            dropdownToggle: null,
            buttonSet: null,
            table: null
        };
        this.originalStates = [];
        this.classes = $.extend(!0, {}, ViewsTool.classes);
        this.fnSettings = function () {
            return this.settings;
        };
        "undefined" == typeof b && (b = {});
        this._fnConstruct(b);
        return this;
    };

    ViewsTool.prototype = {

        // Init point
        _fnConstruct: function (a) {
            var b = this;
            this._fnCustomiseSettings(a);

            this.dom.container = d.createElement(this.settings.tags.container);
            $(this.dom.container).css({'position': 'relative', 'float': 'right'});

            if (this.settings.custom.actionsWrapper === 'dropdown') {
                this._fnCreateDropDown(this.dom.container, this.settings.custom.actions);
            } else {
                this._fnCreateButtonSet(this.dom.container, this.settings.custom.actions);
            }
            this._fnHandleActions();

            this.settings.dt.aoDestroyCallback.push({
                sName: "ViewTools",
                fn: function () {
                    $(b.dom.container).empty();
                }
            });
        },

        // Merge defaults and provided settings
        _fnCustomiseSettings: function (a) {
            "undefined" == typeof this.settings.dt._ViewsToolInit &&
            (this.settings.master = !0, this.settings.dt._ViewsToolInit = !0);
            this.dom.table = this.settings.dt.nTable;
            this.settings.custom = $.extend({}, ViewsTool.DEFAULTS, a);
            this.settings.tags = this.settings.custom.oTags;
        },

        // Creates dropdown element
        _fnCreateDropDown: function (root, actions) {
            if (actions && actions.oDefault && actions.oDefault.label) {
                if (actions.oOptions) {
                    this.dom.dropdown = $('<div>').addClass(this.classes.dropdown.root).appendTo(root);

                    this.dom.dropdownToggle = $('<strong>').attr('data-toggle', 'dropdown').addClass(this.classes.dropdown.oDefault).appendTo(this.dom.dropdown);
                    if (actions.oDefault.icon) {
                        $('<img>').attr('src', actions.oDefault.icon).attr('alt', actions.oDefault.label).appendTo(this.dom.dropdownToggle);
                    }
                    this.dom.dropdownToggle.html(this.dom.dropdownToggle.html() + actions.oDefault.label);

                    $('<span>').html(actions.oDefault.label);

                    var $menu = $('<div>').addClass(this.classes.dropdown.menu).appendTo(this.dom.dropdown),
                        $rootUl = $('<ul>').appendTo($menu);

                    $.each(actions.oOptions, function (groupIndex, group) {
                        if (group.group.length > 0) {
                            var $groupLi = $('<li>').appendTo($rootUl);
                            $('<strong>').html(group.groupLabel).appendTo($groupLi);

                            var $groupUl = $('<ul>').appendTo($groupLi);
                            $.each(group.group, function (actionIndex, action) {
                                if (action.label) {
                                    var $actionLi = $('<li>').appendTo($groupUl);
                                    if (action.icon) {
                                        $('<img>').attr('alt', action.label).attr('src', action.icon).appendTo($actionLi);
                                    }
                                    var $a = $('<a>').data('actionbinding', action).attr('href', '#').html(action.label).appendTo($actionLi);
                                    if (action.metadatas) {
                                        $.each(action.metadatas, function (metaIndex, metaElement) {
                                            $a.data(metaIndex, metaElement);
                                        });
                                    }
                                }
                            });
                        }
                    });

                } else {
                    this.dom.dropdownToggle = $('<strong>').addClass(this.classes.dropdown.oDefault).appendTo(this.dom.dropdown);
                    if (actions.oDefault.icon) {
                        $('<img>').attr('src', actions.oDefault.icon).attr('alt', actions.oDefault.label).appendTo(this.dom.dropdownToggle);
                    }
                    $('<span>').html(actions.oDefault.label);
                }
            }
        },

        // Creates dropdown element
        _fnCreateButtonSet: function (root, actions) {
            var that = this;
            if (actions && actions.oDefault && actions.oDefault.label) {
                if (actions.oOptions) {
                    this.dom.buttonSet = $('<div>').addClass(that.classes.toggle.root).attr('data-toggle', 'buttons-radio').appendTo(root);
                    $.each(actions.oOptions, function (groupIndex, group) {
                        if (group.group.length > 0) {
                            $.each(group.group, function (actionIndex, action) {
                                if ((action.label && that.settings.custom.bLabel) || (action.icon && that.settings.custom.bIcon)) {
                                    var $radio = $('<input>').attr({
                                        'type': 'radio',
                                        'name': 'viewsRadio',
                                        'id': 'viewsRadio' + actionIndex,
                                        'data-button-bootstrap-class': that.classes.toggle.button
                                    }).appendTo(that.dom.buttonSet);
                                    if (action.icon && that.settings.custom.bIcon) {
                                        $radio.attr({'data-icon-src': action.icon, 'data-icon-alt': action.label});
                                    }
                                    if (action.label && that.settings.custom.bLabel) {
                                        $('<label>').attr('for', 'viewsRadio' + actionIndex).html(action.label).appendTo(that.dom.buttonSet);
                                    }
                                    if (action.metadatas) {
                                        $.each(action.metadatas, function (metaIndex, metaElement) {
                                            $radio.data(metaIndex, metaElement);
                                        });
                                    }
                                    $radio.data('actionbinding', action);
                                }
                            });
                        }
                    });
                }
            }
        },

        // Merge defaults and provided settings
        _fnHandleActions: function () {
            var that = this,
                $actions = that.dom.dropdown.find(':data(actionbinding)');

            $actions.click(function () {
                that._fnProcessAction($(this), $(this).data('actionbinding'));
                return false;
            });
        },

        _fnProcessAction: function (element, action) {
            this._fnProcessCss(element, action.css);
            this._fnProcessJs(element, action.js);

            // Reflect selected option
            if (this.settings.bReflectSelection) {
                this.dom.dropdownToggle.html('');
                if (action.icon) {
                    $('<img>').attr('src', action.icon).attr('alt', action.label).appendTo(this.dom.dropdownToggle);
                }
                this.dom.dropdownToggle.html(this.dom.dropdownToggle.html() + action.label);
            }

            return false;
        },

        _fnRestoreOriginalState: function () {
            var that = this;
            $('link[data-viewstool="true"]').remove();
            $.each(that.originalStates, function (index, element) {
                var $element = that.settings.dt.oInstance.find('' + element);
                if ($element.length > 0) {
                    $element.removeAttr('style');
                }
            });
            that.originalStates = [];
        },

        _fnProcessCss: function (element, css) {
            if (css) {
                var that = this;

                this._fnRestoreOriginalState();

                if (typeof css === 'string') {
                    $('<link>').attr({
                        'rel': 'stylesheet',
                        'media': 'screen, projection',
                        'href': css,
                        'data-viewstool': 'true'
                    }).appendTo('head');
                    return;
                }
                $.each(css, function (index, element) {
                    var $element = that.settings.dt.oInstance.find('' + index);
                    if ($element.length > 0) {
                        that.originalStates.push(index);
                        $element.css(element);
                    }
                });
                that.settings.dt.oInstance.fnAdjustColumnSizing();
            }
        },

        _fnProcessJs: function (element, js) {
            if (js) {
                js(element, this.settings.dt.oInstance); // TODO : add useful params (table, dropdown, etc...)
            }
        }
    };

    ViewsTool._aInstances = [];
    ViewsTool._aListeners = [];
    ViewsTool.fnGetMasters = function () {
        for (var a = [], b = 0, c = ViewsTool._aInstances.length; b < c; b++) ViewsTool._aInstances[b].settings.master && a.push(ViewsTool._aInstances[b]);
        return a;
    };
    ViewsTool.fnGetInstance = function (a) {
        "object" != typeof a && (a = g.getElementById(a));
        for (var b = 0, c = ViewsTool._aInstances.length; b < c; b++)
            if (ViewsTool._aInstances[b].settings.master && ViewsTool._aInstances[b].dom.table == a) return ViewsTool._aInstances[b];
        return null;
    };
    ViewsTool._fnEventListen = function (a, b, c) {
        ViewsTool._aListeners.push({
            that: a,
            type: b,
            fn: c
        });
    };
    ViewsTool._fnEventDispatch = function (a, b, c, d) {
        for (var f = ViewsTool._aListeners, e = 0, g = f.length; e < g; e++) a.dom.table == f[e].that.dom.table && f[e].type == b && f[e].fn(c, d);
    };

    ViewsTool.classes = {
        container: 'ViewsTool_container',
        dropdown: {
            root: 'dropdown',
            oDefault: 'dropdown-toggle button',
            menu: 'dropdown-menu pull-right'
        },
        toggle: {
            root: 'btn-group',
            button: 'btn btn-mini'
        }
    };

    ViewsTool.DEFAULTS = {
        bLabel: true,
        bIcon: true,
        bReflectSelection: true,
        actionsWrapper: 'dropdown',
        actions: {},
        oTags: {
            container: "div",
            button: "a",
            liner: "span",
            collection: {
                container: "div",
                button: "a",
                liner: "span"
            }
        }
    };

    $.fn.dataTableExt.aoFeatures.push({
        "fnInit": function (oSettings) {
            oSettings = new ViewsTool(oSettings.oInstance, "undefined" != typeof oSettings.oInit.oViewsTool ? oSettings.oInit.oViewsTool : {});
            ViewsTool._aInstances.push(oSettings);
            return oSettings.dom.container;
        },
        "cFeature": "V",
        "sFeature": "ViewsTool"
    });
    $.fn.DataTable.ViewsTool = ViewsTool;

})(jQuery, window, document);