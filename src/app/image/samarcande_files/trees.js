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
var treeSelection = {};

(function ($) {
    var treeReady = false;
    var treeRollback;

    var $kTree = $('.kTree'),
        cancel = {position: -1};
    var actionButtonsTemplates = {
        'default': {
            'default': [{
                label: LOCALE_BO.creer,
                className: 'ajouter',
                binding: {
                    'click': function (event) {
                        if (treeReady && window.specificTreeCreate) {
                            var $node = $(this).closest('li');
                            window.specificTreeCreate(event, $node);
                            return false;
                        }
                    }
                }
            },{
                label: LOCALE_BO.editer,
                className: 'editer',
                binding: {
                    'click': function (event) {
                        if (treeReady && window.specificTreeSelect) {
                            var $node = $(this).closest('li');
                            window.specificTreeSelect(event, $node);
                            return false;
                        }
                    }
                }
            },{
                    label: LOCALE_BO.supprimer,
                    className: 'supprimer',
                    binding: {
                        'click': function (event) {
                            if (treeReady && window.specificTreeRemove) {
                                var $node = $(this).closest('li'),
                                    tree = $.jstree._reference('.kTree');
                                $('<div>')
                                    .html($.parametizeString(LOCALE_BO.services.arbre.confirmerSuppression, ['"' + $node.find('.jstree-node-title').html() + '"']))
                                    .dialog({
                                        buttons: [{
                                            text: LOCALE_BO.ok,
                                            click: function () {
                                                window.specificTreeRemove(event, $node, tree);
                                                $(this).dialog('close');
                                            }
                                        }, {
                                            text: LOCALE_BO.fermer,
                                            click: function () {
                                                $(this).dialog('close');
                                            }
                                        }],
                                        title: LOCALE_BO.confirmer
                                    });
                                return false;
                            }
                        }
                    }
                }]
        },
        'multiselect': {
            'default': [{
                label: LOCALE_BO.selectall,
                className: 'selectall',
                binding: {
                    'click': function (event) {
                        if (treeReady) {
                            // Sélection de toutes les nodes 'enfants' (1 niveau)
                            var tree = $.jstree._reference('.kTree');
                            var node = tree._get_node($(this));
                            tree.open_node(node, function () {
                                tree._get_children(node).each(function () {
                                    tree.check_node($(this));
                                });
                            });
                        }
                        return false;
                    }
                }
            }, {
                label: LOCALE_BO.selectnone,
                className: 'selectnone',
                binding: {
                    'click': function (event) {
                        if (treeReady) {
                            // Désélection de toutes les nodes 'enfants' (1 niveau)
                            var tree = $.jstree._reference('.kTree');
                            var node = tree._get_node($(this));
                            tree.open_node(node, function () {
                                tree._get_children(node).each(function () {
                                    tree.uncheck_node($(this));
                                });
                            });
                        }
                        return false;
                    }
                }
            }]
        }
    };

    /*
     * Custom search method : search through text and possible datas
     */
    $.expr[':'].jstree_full_search = function (a, i, m) {
        var word, words = [];
        var searchFor = m[3].toLowerCase().replace(/^\s+/g, '').replace(/\s+$/g, '');
        if (searchFor.indexOf(' ') >= 0) {
            words = searchFor.split(' ');
        }
        else {
            words = [searchFor];
        }
        for (var i = 0; i < words.length; i++) {
            word = words[i];
            if (((a.textContent || a.innerText || "").toLowerCase().indexOf(word) == -1) && !_isInDatas(a, word)) {
                return false;
            }
        }
        return true;
    };

    function _isInDatas(a, word) {
        var inDatas = false;
        if (a) {
            var $item = $(a).closest('li');
            $.each($item.data(), function (index, value) {
                if (value.toLowerCase().indexOf(word) > -1) {
                    inDatas = true;
                    return false;
                }
            });
        }
        return inDatas;
    }

    function jsonUrl() {

    }

    $kTree.each(function (index, component) {
        var $component = $(component),
            filterUrl = $component.data('filterurl'),
            dataUrl = $component.data('url'),
            dnd = $component.data('dnd') ? $component.data('dnd') : false,
            multiselect = $component.data('multiselect') ? $component.data('multiselect') : false,
            twoState = $component.data('twostate') === true,
            actions = $component.data('actions') ? $component.data('actions') : false,
            actionsTemplate = $component.data('actionstemplate') || 'default',
            selected = $component.data('selected'),
            initialSelection = selected ? ( $.isNumeric(selected) ? [selected] : $component.data('selected').split(';') ) : [],
            disabled = [],
            finalSelection = [];

        dataUrl = dataUrl.replace(/#AUTO#/g, '');

        // Si l'id de l'item en cours est préfixé par #AUTO#, on l'ajoute à la liste des "disabled" et on le supprime de la liste des "selected"
        $.each(initialSelection, function (indexSelected, value) {
            if (('' + value).lastIndexOf('#AUTO#', 0) === 0) {
                var realValue = value.replace('#AUTO#', '');
                disabled.push(realValue);
            } else {
                finalSelection.push(value);
            }
        });

        initialSelection = finalSelection;

        // Only enable checkboxes in multiselect cases
        var plugins = ["themes", "ui", "json_data", "kfilter", "types"];
        if (multiselect) {
            plugins.push("kcheckbox");
        }
        if (dnd) {
            plugins.push("dnd");
            plugins.push("crrm");
        }
        if (actions) {
            plugins.push("actions");
        }

        // Only way to not trigger the 'select_node.jstree' event on load with the param 'initially_select' for 'ui' plugin
        $component.bind("reselect.jstree", function () {
            treeReady = true;
        }).jstree({
            core: {
                animation: 300,
                html_titles: true
            },
            "json_data": {
                "ajax": {
                    "url": function (node) {
                        if (node == -1) {
                            $component.attr('data-root')
                            return encodeURI($.parametizeString(dataUrl, ["00"]));
                        } else {
                            return encodeURI($.parametizeString(dataUrl, [node.data('sCode')]));
                        }
                    },
                    "type": "get",  // this is a GET not a POST
                    "success": function (ops) {
                        if (ops[0]) {
                            if (ops[0].attr.rel == "root") {
                                return ops;
                            }
                            return ops[0].children;
                        }
                    },
                    "progressive_render": true,
                    "progressive_unload": true
                }
            },
            "kfilter": {
                "ajax": {
                    "url": function () {
                        return $.parametizeString(filterUrl, [$('#kTreeSearch').val()]);
                    }
                }
            },
            "themes": {
                "theme": "ksup",
                "url": "/adminsite/scripts/libs/css/jstree-1.0/themes/ksup/style.css",
                "dots": true,
                "icons": true
            },
            "ui": {
                "select_limit": (multiselect ? -1 : 1),
                "initially_select": initialSelection
            },
            "types": {
                "valid_children": ["root"],
                "types": {
                    "root": {
                        "valid_children": ["default"],
                        "hover_node": false,
                        "select_node": function () {
                            return false;
                        }
                    },
                    "default": {
                        "valid_children": ["default"]
                    },
                    "locked": {
                        "check_node": false,
                        "uncheck_node": false,
                        "open_node": false,
                        "hover_node": false,
                        "close_node": false
                    },
                    "not_selectable": {
                        "check_node": false,
                        "uncheck_node": false,
                        "hover_node": false,
                        "select_node": function () {
                            return false;
                        }
                    }
                }
            },
            "kcheckbox": {
                "override_ui": true,
                "two_state": twoState
            },
            "crrm": {
                "move": {
                    "check_move": function (m) {
                        if (m.np.attr('rel') != 'not_selectable') {
                            return true;
                        }
                        return false;
                    }
                }
            },
            "dnd": {
                "drop_finish": function (data) {
                    data.r.transition({scale: 2.0}, function () {
                        data.r.transition({scale: 1.0});
                    });
                },
                "drop_target": false,
                "drag_target": false
            },
            "actions": {
                buttons: actionButtonsTemplates[actionsTemplate]
            },
            "plugins": plugins
        });

        $kTree.bind("loaded.jstree", function (event, data) {
            $.each(disabled, function (index, value) {
                $.jstree._reference('.kTree').set_type('not_selectable', '#' + value);
            });
        });
    });

    $kTree.bind("check_node.jstree uncheck_node.jstree", function (event, data) {
        var $root = $('.kTree li[rel="root"]'),
            $jsTreeNodes = data.inst.get_selected($root);
        treeSelection = {};
        $jsTreeNodes.each(function () {
            var $node = $(this);
            treeSelection[$node.attr('id')] = {
                sCode: $node.data('sCode'),
                libelle: $node.data('libelle'),
                locked: $node.is('.locked')
            };
        });
    });
//
//    $kTree.bind("uncheck_node.jstree", function (event, data) {
//        var $node = data.rslt.obj;
//        delete treeSelection[$node.attr('id')];
//    });

    $kTree.bind("select_node.jstree", function (event, data) {
        if (treeReady && window.specificTreeSelect) {
            window.specificTreeSelect(event, data.rslt.obj);
        } else {
            if (treeReady && window.iFrameRegistration) {
                var path = $.jstree._reference('.kTree').get_path('#' + data.rslt.obj.data('sCode'));
                path = $.cleanArray(path).join(' > ');
                if (/PARAMETRAGE=/.test(document.location.href)) {
                    document.location.href = '/servlet/com.jsbsoft.jtf.core.SG?EXT=core&PROC=SAISIE_RUBRIQUE&ACTION=PARAMETRAGE_RUBRIQUE&CODE='
                        + encodeURIComponent(data.rslt.obj.data('sCode'))
                        + '&LIBELLE='
                        + encodeURIComponent(data.rslt.obj.data('libelle'));
                } else {
                    iFrameHelper.sendValues(window.iFrameRegistration, {
                        sCode: data.rslt.obj.data('sCode'),
                        libelle: data.rslt.obj.data('libelle'),
                        fil: path
                    });
                }
            }
        }
    });

    $(document).bind("drag_start.vakata", function (e, data) {
        var $node = data.data.obj;
        cancel = {
            node: $node,
            parent: $.jstree._reference('.kTree')._get_parent($node),
            position: $node.index()
        };
    });

    function cancelMove() {
        if (cancel && cancel.node && cancel.parent && cancel.position != -1) {
            $.jstree._reference('.kTree').move_node(cancel.node, cancel.parent, cancel.position);
            cancel = {position: -1};
        }
    }

    $kTree.bind("move_node.jstree", function (event, data) {
        if (cancel && cancel.node && cancel.parent && cancel.position != -1) {
            var $node = data.rslt.o,
                codeMere = data.rslt.np.data('sCode'),
                jsTreeBean = this.dataset.jstreebean || 'rubriquesJsTree',
                $messageApplicatif = $('#messageApplicatif'),
                $p = $('<p>').addClass('message alert fade in'),
                $closeButton = $('<button>').addClass('close').attr({
                    'type': 'button',
                    'data-dismiss': 'alert',
                    'aria-hidden': true
                }).html('&times;');
            $.ajax({
                type: "POST",
                url: '/servlet/com.kportal.servlet.JsTreeServlet',
                data: {
                    'JSTREEBEAN': jsTreeBean,
                    'ACTION': 'DEPLACER',
                    'CODES_RUBRIQUES': [$node.data('sCode')],
                    'CODES_MERE': [codeMere],
                    'ORDRES': [$node.index()]
                },
                success: function (data, status) {
                    $p.addClass('alert-success');
                    $p.html(data);
                    $p.appendTo($messageApplicatif);
                    $closeButton.appendTo($p);
                    $p.alert();
                    $node.transition({'background-color': '#eda619', duration: 500}, function () {
                        $node.transition({'background-color': '#fff', delay: 500});
                    });
                },
                error: function (jqXHR, status, error) {
                    var message = jqXHR.responseText ? jqXHR.responseText : LOCALE_BO.services.arbre.indisponible;
                    $p.addClass('alert-danger');
                    $p.html(message);
                    $p.appendTo($messageApplicatif);
                    $closeButton.appendTo($p);
                    $p.alert();
                    cancelMove();
                }
            });
        } else {
            data.rslt.o.transition({'background-color': '#eda619', duration: 500}, function () {
                data.rslt.o.transition({'background-color': '#fff', delay: 500});
            });
        }
    });
    $('.kTree-search').keyup(function () {
        var $this = $(this);
        if ($this.val().length > 2) {
            $('.jstree').jstree('kfilter', $this.val());
        } else if ($this.val().length == 0) {
            $('.jstree').jstree('kfilter', '');
        }
    });
})(jQuery.noConflict());
