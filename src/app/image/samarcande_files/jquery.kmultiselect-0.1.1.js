/*
 * kmultiselect jQuery plugin
 * 
 * version 0.1.2
 * 
 * Kosmos
 * 
 * Files below need to be referenced in the calling page for the component to run correctly :
 * 
 * 	JS :
 * 	- jQuery ( jquery-XX.XX.XX.js )
 *  - jQuery UI ( jquery-ui-XX.XX.XX.custom.js )
 *  - jQuery Sort Functions ( jquery.ksort-functions-XX.XX.XX.js )
 *  
 *  CSS : 
 *  - a jQuery UI theme ( jquery-ui-XX.XX.XX.css )
 *  - component style ( kmultiselect-XX.XX.XX.css )
 * 
 * Versions :
 * 
 * 0.1.2 :
 *  - Added "prepend" argument to add method to specify if the item should be added to the head or the tail of the list
 * 
 */

(function ($) {

    $.kMultiSelect = function (root, options) {
        var $kMultiSelect = $(root),

            settings,

            $parent,
            $parentList,
            $composition,
            $compositionList,

            $toolbox,
            toolbox = {
                $addButton: null,
                $editButton: null,
                $removeButton: null
            },

            $oldEditToolbox,
            $oldSortToolbox,

            ua = navigator.userAgent;

        // Initialize the component
        function init() {

            // Default settings
            var defaults = {

                // Should the constructor return an instance of the created object
                instance: false,

                // List mode
                listMode: "LtL",

                // Labels
                parentLabel: LOCALE_BO.kselect.multi.parentLabel,
                compositionLabel: LOCALE_BO.kselect.multi.compositionLabel,

                // Ignore interactions on items carrying this class
                ignore: '.ignore',

                // Add functionnalities
                addAction: function () {
                },
                onBeforeItemAdd: function () {
                },
                onAfterItemAdd: function () {
                },

                // Edit functionnalities
                editable: false,
                editAction: function () {
                },
                onBeforeItemEdit: function () {
                },
                onAfterItemEdit: function () {
                },

                // Remove functionnalities
                removable: true,
                onBeforeItemRemove: function () {
                },
                onAfterItemRemove: function () {
                },

                // Sort functionnalities
                sortable: true,
                sortFunction: $.fn.sortFunctions.alphaNumSort,
                onItemSort: function () {
                },
                multiSelect: true,

                // Toolbox
                toolbox: {
                    add: true,
                    edit: false,
                    remove: true
                },

                // Retro actions support
                oldMode: false,

                // Custom selectors (prevent automatic building when provided)
                sourceListSelector: null,
                compositionListSelector: null
            };

            // Merge defaults and options settings
            settings = $.extend({}, defaults, options);

            // Store a reference to the kmultiselect object
            $.data(root, "kMultiSelect", $kMultiSelect);
        }

        // Initialize and add the toolbox to the DOM if necessary
        function createToolbox() {
            if (settings.toolbox && (settings.toolbox.add || settings.toolbox.edit || settings.toolbox.remove)) {

                $toolbox = $toolbox ? $toolbox.empty() : $("<div>").addClass("ui-widget-header ktoolbox").prependTo($kMultiSelect);

                // Add button
                if (settings.toolbox.add) {
                    toolbox.$addButton = $("<button type=\"button\">").button({
                        text: false,
                        icons: {
                            primary: "ui-icon-plus"
                        }
                    }).appendTo($toolbox);
                    if (settings.addAction) {
                        toolbox.$addButton.click(function () {
                            executeAction(settings.addAction, $kMultiSelect);
                            return false;
                        });
                    }
                }

                // Edit button
                if (settings.toolbox.edit) {
                    toolbox.$editButton = $("<button type=\"button\">").button({
                        text: false,
                        icons: {
                            primary: "ui-icon-pencil"
                        }
                    }).appendTo($toolbox);
                    if (settings.editAction) {
                        toolbox.$editButton.click(function (e) {
                            e.preventDefault();
                            var $selectedRow = $compositionList.find("li.ui-state-highlight");
                            settings.onBeforeItemEdit($compositionList, $selectedRow);
                            executeAction(settings.editAction, $selectedRow);
                            settings.onAfterItemEdit($compositionList, $selectedRow);
                            return false;
                        });
                    }
                }

                // Remove button
                if (settings.toolbox.remove) {
                    toolbox.$removeButton = $("<button type=\"button\">").button({
                        text: false,
                        icons: {
                            primary: "ui-icon-minus"
                        }
                    }).appendTo($toolbox);
                    toolbox.$removeButton.click(function (e) {
                        e.preventDefault();
                        removeAction();
                        return false;
                    });
                }
            }
        }

        // Initialize parent list (left list)
        function createParentList() {
            $parent = $('<div>').addClass('k-multiselect-parent').appendTo($kMultiSelect);
            if (settings.parentLabel) {
                $('<span>').addClass('k-multiselect-label').html(settings.parentLabel).appendTo($parent);
            }

            // No need to create it if specified in the settings
            if (settings.sourceListSelector) {
                $parentList = $(settings.sourceListSelector);
                $parentList.removeClass().addClass("ui-sortable kmultiselect-list kmultiselect-parent-list").disableSelection().appendTo($kMultiSelect);
                $parentList.find("li").each(function (index, item) {
                    var $item = $(item),
                        ignore = $item.is(settings.ignore);
                    $item.removeClass().addClass("ui-state-default kmultiselect-parent-list-row kconnected-sortable" + (ignore ? ' ignore' : ''));
                });
            } else if ($kMultiSelect.find('.kscrollable .kmultiselect-parent-list').length == 1) {
                $parentList = $kMultiSelect.find('.kscrollable .kmultiselect-parent-list');
                $parentList.find("li").each(function (index, item) {
                    var $item = $(item),
                        ignore = $item.is(settings.ignore);
                    $item.removeClass().addClass("ui-state-default kmultiselect-parent-list-row kconnected-sortable" + (ignore ? ' ignore' : ''));
                });
                $parentList.closest('.kscrollable').appendTo($parent);
            } else {
                var $scrollable = $('<div>').addClass('kscrollable').appendTo($parent);
                $parentList = $parentList ? $parentList.empty() : $("<ul>").addClass("ui-sortable kmultiselect-list kmultiselect-parent-list").disableSelection().appendTo($scrollable);
            }
        }

        // Initialize composition list
        function createCompositionList() {
            $composition = $('<div>').addClass('k-multiselect-composition').appendTo($kMultiSelect);
            if (settings.listMode == "LtL" && settings.compositionLabel) {
                $('<span>').addClass('k-multiselect-label').html(settings.compositionLabel).appendTo($composition);
            }

            // No need to create it if specified in the settings
            if (settings.compositionListSelector) {
                $compositionList = $(settings.compositionListSelector);
                $compositionList.removeClass().addClass("ui-sortable kmultiselect-list kmultiselect-composition-list").disableSelection().appendTo($kMultiSelect);
                $compositionList.find("li").removeClass().addClass("ui-state-default kmultiselect-composition-list-row kconnected-sortable");
            } else if ($kMultiSelect.find('.kscrollable .kmultiselect-composition-list').length == 1) {
                $compositionList = $kMultiSelect.find('.kscrollable .kmultiselect-composition-list');
                $compositionList.closest('.kscrollable').appendTo($composition);
            } else {
                var $scrollable = $('<div>').addClass('kscrollable').appendTo($composition);
                $compositionList = $compositionList ? $compositionList.empty() : $("<ul>").addClass("ui-sortable kmultiselect-list kmultiselect-composition-list").disableSelection().appendTo($scrollable);
            }

            if (settings.sortable) {
                if ($parentList) {
                    var wrapperSelector = "#" + $kMultiSelect.attr("id");
                    $kMultiSelect.find(".kmultiselect-parent-list, .kmultiselect-composition-list").sortable({
                        connectWith: wrapperSelector + " .kmultiselect-list",
                        items: 'li:not(' + settings.ignore + ')',
                        over: onOver,
                        out: onOut,
                        stop: onDrop,
                        delay: 300,
                        revert: 0,
                        helper: createHelper,
                        placeholder: 'ksortable-placeholder',
                        forcePlaceholderSize: true,
                        opacity: 0.9,
                        smooth: false
                    }).disableSelection();
                } else {
                    $compositionList.sortable({
                        items: 'li:not(' + settings.ignore + ')',
                        over: onOver,
                        out: onOut,
                        stop: onDrop,
                        delay: 300,
                        revert: 0,
                        helper: createHelper,
                        placeholder: 'ksortable-placeholder',
                        forcePlaceholderSize: true,
                        opacity: 0.9,
                        smooth: false
                    });
                }
                if ($parentList) $parentList.children().addClass("draggable");
                $compositionList.children().addClass("draggable");

                handleStates();
            }
        }

        // Function used to create old interactions toolbox
        function createOldModeToolbox() {

            // Add and remove buttons
            var $target;
            if (settings.listMode == "LtL" && $parentList) {
                $target = settings.sourceListSelector ? $parentList : $parentList.parent();
                $oldEditToolbox = $oldEditToolbox ? $oldEditToolbox.empty() : $("<div>").addClass("kold-edit-toolbox").insertAfter($target);
                $("<button type=\"button\">").button({
                    text: false,
                    icons: {
                        primary: "ui-icon-triangle-1-e"
                    }
                }).addClass("kold-edit-button kold-edit-add").click(oldAddAction).appendTo($oldEditToolbox);
                $("<button type=\"button\">").button({
                    text: false,
                    icons: {
                        primary: "ui-icon-triangle-1-w"
                    }
                }).addClass("kold-edit-button kold-edit-remove").click(removeAction).appendTo($oldEditToolbox);
            }

            // Sort buttons
            $target = settings.compositionListSelector ? $compositionList : $compositionList.parent();
            $oldSortToolbox = $oldSortToolbox ? $oldSortToolbox.empty() : $("<div>").addClass("kold-edit-toolbox").insertAfter($target);
            $("<button type=\"button\">").button({
                text: false,
                icons: {
                    primary: "ui-icon-triangle-1-n"
                }
            }).click(oldSortUpAction).addClass("kold-edit-button kold-edit-sort-up").appendTo($oldSortToolbox);
            $("<button type=\"button\">").button({
                text: false,
                icons: {
                    primary: "ui-icon-triangle-1-s"
                }
            }).click(oldSortDownAction).addClass("kold-edit-button kold-edit-sort-down").appendTo($oldSortToolbox);
        }

        // Function used to wrap actions passed through instanciation options
        function executeAction(action, params) {
            if (action) {
                if (typeof(action) == "function") {
                    action(params);
                }
            }
        }

        function createHelper(e, item) {
            var helper = $('<li/>').attr('data-value', item.data('value')).addClass("kmultiselect-composition-list-row kconnected-sortable ui-state-highlight ");
            if (!item.hasClass('ui-state-highlight')) {
                item.addClass('ui-state-highlight').siblings().removeClass('ui-state-highlight');
            }
            var elements = item.parent().children('.ui-state-highlight').clone(true, true);
            item.data('multidrag', elements);
            item.siblings('.ui-state-highlight').remove();
            return helper.append(elements);
        }

        //////////////////////////////////////////////////
        //					UI Updates					//
        //////////////////////////////////////////////////

        // Binds mouse events to update items' visual states
        function handleStates() {

            // So we don't trigger events more than once
            $kMultiSelect.find("li.kconnected-sortable").unbind('click mouseenter mouseleave');

            $kMultiSelect.find("li.kconnected-sortable").hover(function (e) {
                $(this).addClass('ui-state-hover');
            }, function () {
                $(this).removeClass('ui-state-hover');
            });

            $kMultiSelect.find("li.kconnected-sortable").click(function (e) {
                var $this = $(this);

                // Only useful in ltl mode
                if (settings.listMode == "LtL") {
                    var $otherLists = $(e.currentTarget).closest('.k-multiselect-parent').length > 0 ? $composition : $parent;
                    if ($otherLists.length != 0) {
                        $otherLists.find('.kconnected-sortable').removeClass('ui-state-highlight ui-state-hover');
                    }
                }

                // Reproduce desktop interractions ( "ctrl" and "shift" handling )
                if (e.ctrlKey == true && settings.multiSelect) {
                    $this.toggleClass('ui-state-highlight');
                } else if (e.shiftKey == true && settings.multiSelect) {
                    var $pivotItem = $this.siblings('.ui-state-highlight').first(),
                        $start = $this.index() > $pivotItem.index() ? $pivotItem.index() : $this.index(),
                        $end = $this.index() > $pivotItem.index() ? $this.index() : $pivotItem.index();

                    $pivotItem.siblings('.kconnected-sortable').removeClass('ui-state-highlight ui-state-hover');
                    $this.siblings('.kconnected-sortable').slice($start, $end).addClass('ui-state-highlight');
                    $this.addClass('ui-state-highlight');
                } else {
                    $this.addClass('ui-state-highlight').siblings('.kconnected-sortable').removeClass('ui-state-highlight ui-state-hover');
                }
                updateOldToolbox();
                updateToolbox();
                return false;
            });
        }

        // Assert composition items consistency according to initialization options
        function updateCompositionItems() {
            $compositionList.find('li').each(function () {
                var $this = $(this),
                    $label = $this.find('span.composition-list-label'),
                    ignore = $this.is(settings.ignore),
                    error = $this.is('.error');

                // Clean li
                $this.find('div, button').remove();
                $this.find('span.klist-icon').remove();
                if ($label.length == 0) {
                    var text = $this.text();
                    $this.empty();
                    $label = $('<span>').addClass('composition-list-label').text(text).appendTo($this);
                }
                if (error) {
                    $this.addClass('ui-state-error kmultiselect-composition-list-row');
                } else {
                    $this.removeClass().addClass('ui-state-default kmultiselect-composition-list-row kconnected-sortable' + (ignore ? ' ignore' : ''));
                }

                // Add helpers and buttons according to the settings
                if (settings.sortable) {
                    if (!ignore) {
                        if (!error) {
                            $this.addClass('draggable');
                            $('<span>').addClass('ui-icon ui-icon-arrowthick-2-n-s klist-icon').prependTo($this);
                        } else {
                            $('<span>').addClass('ui-icon ui-icon-alert klist-icon').prependTo($this);
                        }
                    } else {
                        $('<span>').addClass('ui-icon ui-icon-locked klist-icon').prependTo($this);
                    }
                }
                if (settings.removable && !ignore) {
                    $('<button type=\"button\">').button({
                        text: false,
                        icons: {
                            primary: 'ui-icon-minus'
                        }
                    }).click(function () {
                        settings.onBeforeItemRemove($compositionList, $this);

                        if ($parentList) {
                            settings.onBeforeItemAdd($parentList, $this);

                            if ($this.is('.error')) {
                                $this.detach();
                            } else {
                                $this.appendTo($parentList);
                            }

                            settings.onAfterItemAdd($parentList, $this);
                        } else {
                            $this.detach();
                        }

                        settings.onAfterItemRemove($compositionList, $this);

                        updateCompositionItems();
                        updateParentItems();
                        return false;
                    }).addClass('klist-button').appendTo($this);
                    $label.css({'max-width': '80%'});
                }
                if (settings.editable && !ignore && !error) {
                    $('<button type=\"button\">').button({
                        text: false,
                        icons: {
                            primary: 'ui-icon-pencil'
                        }
                    }).click(function (e) {
                        e.preventDefault();
                        settings.onBeforeItemEdit($compositionList, $(this).closest('li'));

                        executeAction(settings.editAction, $(this).closest('li'));

                        settings.onAfterItemEdit($compositionList, $(this).closest('li'));
                        return false;
                    }).addClass('klist-button').appendTo($this);
                    $label.css({'max-width': '70%'});
                }
                if (!$this.attr('title')) {
                    $this.attr('title', $label.text());
                }
            });
        }

        // Update items from parent list (only in "LtL" mode)
        function updateParentItems() {
            if ($parentList) {
                $parentList.find("li").each(function () {
                    var $this = $(this),
                        $label = $this.find('span.parent-list-label');

                    // Clean li
                    $this.find("div, button").remove();
                    $this.find("span.klist-icon").remove();
                    $this.removeClass('kmultiselect-composition-list-row').addClass('kmultiselect-parent-list-row');
                    if ($label.length === 0) {
                        var text = $this.html();
                        $this.empty();
                        $('<span>').addClass('parent-list-label').html(text).appendTo($this);
                    }

                    $("<button type=\"button\">").button({
                        text: false,
                        icons: {
                            primary: "ui-icon-plusthick"
                        }
                    }).addClass("klist-button").click({row: $this}, oldAddAction).appendTo($this);
                });
            }
        }

        // Update toolbox states
        function updateToolbox() {
            if ($toolbox) {
                var $selectedRows = $compositionList.find("li.ui-state-highlight:not(" + settings.ignore + ")"),
                    hasIgnorableRows = $selectedRows.find(settings.ignore).length > 0;
                if ($selectedRows.length == 0 || hasIgnorableRows) {
                    if (toolbox.$editButton) toolbox.$editButton.button("option", "disabled", true);
                    if (toolbox.$removeButton) toolbox.$removeButton.button("option", "disabled", true);
                } else if ($selectedRows.length == 1) {
                    if (toolbox.$editButton) toolbox.$editButton.button("option", "disabled", false);
                    if (toolbox.$removeButton) toolbox.$removeButton.button("option", "disabled", false);
                } else if ($selectedRows.length > 1) {
                    if (toolbox.$editButton) toolbox.$editButton.button("option", "disabled", true);
                    if (toolbox.$removeButton) toolbox.$removeButton.button("option", "disabled", false);
                } else {
                    if (toolbox.$editButton) toolbox.$editButton.button("option", "disabled", false);
                    if (toolbox.$removeButton) toolbox.$removeButton.button("option", "disabled", false);
                }
            }
        }

        // Update old toolbox states
        function updateOldToolbox() {
            var $selectedCompositionRows = $compositionList.find(".ui-state-highlight"),
                ignorableCompositionRows = $selectedCompositionRows.is(settings.ignore);
            if ($oldEditToolbox && settings.listMode == "LtL") {
                var $selectedParentRows = $parentList.find(".ui-state-highlight"),
                    ignorableParentRows = $selectedParentRows.is(settings.ignore);
                // Manage add button states
                if ($parentList && ($parentList.children().length <= 0 || $selectedParentRows.length <= 0 || ignorableParentRows)) {
                    $oldEditToolbox.find(".kold-edit-add").button("option", "disabled", true);
                } else {
                    $oldEditToolbox.find(".kold-edit-add").button("option", "disabled", false);
                }

                // Manage remove button states
                if ($compositionList.children().length <= 0 || $selectedCompositionRows.length <= 0 || ignorableCompositionRows) {
                    $oldEditToolbox.find(".kold-edit-remove").button("option", "disabled", true);
                } else {
                    $oldEditToolbox.find(".kold-edit-remove").button("option", "disabled", false);
                }
            }

            if ($oldSortToolbox) {
                // Manage sort up button states
                if ($compositionList.children().length <= 0 ||
                    $selectedCompositionRows.length > 1 ||
                    $selectedCompositionRows.length == 0 ||
                    $selectedCompositionRows.index() == 0 ||
                    ignorableCompositionRows) {

                    $oldSortToolbox.find(".kold-edit-sort-up").button("option", "disabled", true);

                } else {
                    $oldSortToolbox.find(".kold-edit-sort-up").button("option", "disabled", false);
                }

                // Manage sort down button states
                if ($compositionList.children().length <= 0 ||
                    $selectedCompositionRows.length > 1 ||
                    $selectedCompositionRows.length == 0 ||
                    $selectedCompositionRows.index() == ($compositionList.children().length - 1) ||
                    ignorableCompositionRows) {

                    $oldSortToolbox.find(".kold-edit-sort-down").button("option", "disabled", true);

                } else {
                    $oldSortToolbox.find(".kold-edit-sort-down").button("option", "disabled", false);
                }
            }
        }

        //////////////////////////////////////////////////
        //				Events Handling					//
        //////////////////////////////////////////////////

        // Triggered when an item is dropped on a list
        function onDrop(event, info) {
            var $removedList = $(event.target),
                $addedList;

            if (settings.listMode == "LtL") {
                if ($removedList.hasClass("kmultiselect-composition-list")) {
                    $addedList = $parentList;
                } else {
                    $addedList = $compositionList;
                }
            }

            if ($.contains($removedList[0], info.item[0])) {
                $kMultiSelect.find('.kscrollable').removeClass('droppable');
                var test = info.item.data('multidrag');
                info.item.after(info.item.data('multidrag'));
                info.item.remove();
                settings.onItemSort($removedList);
            } else {
                settings.onBeforeItemAdd($addedList, info.item.data('multidrag'));
                if ($removedList) settings.onBeforeItemRemove($removedList, info.item.data('multidrag'));

                $kMultiSelect.find('.kscrollable').removeClass('droppable');
                info.item.after(info.item.data('multidrag'));

                settings.onAfterItemAdd($addedList, info.item.data('multidrag'));
                if ($removedList) settings.onAfterItemRemove($removedList, info.item.data('multidrag'));

                info.item.remove();
            }

            updateCompositionItems();
            updateParentItems();
            updateToolbox();
            updateOldToolbox();
            handleStates();
        }

        // Triggered when drag starts
        function onStart(e, info) {
            if (userAgent.match(/firefox/)) {
                info.item.css('margin-top', $(window).scrollTop());
            }
        }

        // Triggered just before drag stops
        function onBeforeStop(e, info) {
            if (userAgent.match(/firefox/)) {
                info.item.css('margin-top', 0);
            }
        }

        // Triggered when a list item is dragged over
        function onOver(e, info) {
            $kMultiSelect.find('.kscrollable').removeClass('droppable');
            $(e.target).closest('.kscrollable').addClass('droppable');
        }

        // Triggered when a list item is dragged out
        function onOut(e, info) {
            $kMultiSelect.find('.kscrollable').removeClass('droppable');
            $(e.target).closest('.kscrollable').addClass('droppable');
        }

        // Triggered when remove button is clicked
        function removeAction(selector) {
            var $rows = selector && (typeof selector == 'string') ? $compositionList.find(selector) : $compositionList.find("li.ui-state-highlight"),
                result = settings.onBeforeItemRemove($compositionList, $rows),
                proceed = result ? result : true;

            // Secure selection
            $rows = $rows.filter(':not(' + settings.ignore + ')');
            if (proceed) {
                if ($parentList) {
                    $rows.appendTo($parentList);
                } else {
                    $rows.detach();
                }
                updateCompositionItems();
                updateParentItems();
                updateToolbox();
                updateOldToolbox();

                settings.onAfterItemRemove($compositionList, $rows);
            }
        }

        // Triggered when old add button is clicked
        function oldAddAction(event) {
            event.preventDefault();
            var $rows;
            if (event.data && event.data.row) {
                $rows = event.data.row;
            } else {
                $rows = $parentList.find("li.ui-state-highlight");
            }

            settings.onBeforeItemAdd($compositionList, $rows);

            $rows.appendTo($compositionList);

            updateCompositionItems();
            updateParentItems();
            updateToolbox();
            updateOldToolbox();

            settings.onAfterItemAdd($compositionList, $rows);
            return false;
        }

        // Triggered when old sort up button is clicked
        function oldSortUpAction() {
            //$( ".selector" ).sortable( "refreshPositions" );
            $compositionList.find("li.ui-state-highlight").each(function () {
                $(this).insertBefore($(this).prev());
            });
            updateOldToolbox();
            settings.onItemSort($compositionList);
            return false;
        }

        // Triggered when old sort down button is clicked
        function oldSortDownAction() {
            $compositionList.find("li.ui-state-highlight").each(function () {
                $(this).insertAfter($(this).next());
            });
            updateOldToolbox();
            settings.onItemSort($compositionList);
            return false;
        }

        //////////////////////////////////////////////////


        //////////////////////////////////////////////////
        //						API						//
        //////////////////////////////////////////////////

        $kMultiSelect.add = function ($item, prepend) {

            settings.onBeforeItemAdd($compositionList, $item);

            if (prepend) {
                $item.prependTo($compositionList);
            } else {
                $item.appendTo($compositionList);
            }
            this.update();

            settings.onAfterItemAdd($compositionList, $item);
        };

        // TODO : voir pour ajouter la possibilité de supprimer un item directement
        $kMultiSelect.remove = function (selector) {
            removeAction(selector);
        };

        $kMultiSelect.update = function () {
            updateCompositionItems();
            updateParentItems();
            updateToolbox();
            updateOldToolbox();
            handleStates();
        }

        //////////////////////////////////////////////////

        // Browser variables
        var msie = (/msie ([\w.]+)/i.exec(ua) || [])[1],
            opera = /opera/i.test(ua),
            safari = /webkit/i.test(ua) && !/chrome/i.test(ua);

        // Initialize the component
        init();

        // Create the toolbox if necessary
        if (settings.listMode !== "LtL") {
            createToolbox();
        } else {
            createParentList();
            updateParentItems();
        }

        // Create resulting list
        createCompositionList();
        updateCompositionItems();

        // To preserve old interactions habits
        if (options.oldMode) {
            createOldModeToolbox();
            updateOldToolbox();
        }

        updateToolbox();
    };

    $.fn.kMultiSelect = function (options, params) {
        if (options) {
            options = options || {};

            if (typeof options === "object") {
                this.each(function () {
                    if ($(this).data('kMultiSelect')) {
                        if (options.remove) {
                            $(this).data('kMultiSelect').remove();
                            $(this).removeData('kMultiSelect');
                        }
                    }
                    else if (!options.remove) {
                        if (options.enable === undefined && options.disable === undefined)
                            options.enable = true;

                        new $.kMultiSelect(this, options);
                    }
                });

                if (options.instance)
                    return $(this).data('kMultiSelect');

                return this;
            }
        } else {
            return $(this).data('kMultiSelect');
        }
        ;
    };

})(jQuery);
