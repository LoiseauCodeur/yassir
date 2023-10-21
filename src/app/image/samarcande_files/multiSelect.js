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
(function ($) {

    /**
     * Multi-valued component (list to list mode)
     */
    function fireVanillaEvent(type, $inputs) {
        var event;
        if (document.createEvent) {
            event = document.createEvent('HTMLEvents');
            event.initEvent(type, true, true);
        } else {
            event = document.createEventObject();
            event.eventType = type;
        }
        event.eventName = type;
        $inputs.each(
            function (index, component) {
                if (document.createEvent) {
                    component.dispatchEvent(event);
                } else {
                    component.fireEvent('on' + event.eventType, event);
                }
            });
    }

    function buildCompositionList($iframeContent, $iframe, $component) {
        var $selected = $iframe[0].contentWindow.treeSelection;
        if ($selected) {
            var jsTree = $iframe[0].contentWindow.jQuery.jstree._reference('.kTree'),
                $compositionList = $component.find('.kmultiselect-composition-list'),
                $input = $component.find('input[name="' + $component.attr('id').replace('kmultiselect', '') + '"]'),
                values = $.cleanArray($input.val().split(';')),
                $libelles = $component.find('input[name="LIBELLE_' + $component.attr('id').replace('kmultiselect', '') + '"]'),
                libelles = $.cleanArray($libelles.val().split(';')),
                keepValues = [];

            for (var select in $selected) {
                var currentSelect = $selected[select];
                var $foundItem = $compositionList.find('li').filter(function () {
                    return $(this).attr('data-value') === currentSelect.sCode;
                });
                var path = jsTree.get_path('#' + select);
                path = $.map(path, function(value) { return $('<div>').html(value).text(); });
                path = $.cleanArray(path).join(' > ');
                if (!currentSelect.locked) {
                    if ($foundItem.length > 0) {
                        // Used later so we can keep items order
                        keepValues.push(currentSelect.sCode);
                        $foundItem.html(currentSelect.libelle);
                    } else {
                        // Used later so we can keep items order
                        keepValues.unshift(currentSelect.sCode);
                        values.unshift(currentSelect.sCode);
                        libelles.unshift(currentSelect.libelle);
                        // Must wrap the element with the "jQuery" from iframe context in order to retrieve the datas
                        $('<li>').html(currentSelect.libelle).attr('data-value', currentSelect.sCode).attr('title', path).prependTo($compositionList);
                    }
                }
            }
            // Clean up composition list
            for (var i = 0; i < values.length; i++) {
                if ($.inArray(values[i], keepValues) === -1) {
                    var $li = $compositionList.find('li[data-value="' + values[i] + '"]:not(.ignore)');
                    if ($li.length > 0) {
                        $compositionList.find('li[data-value="' + values[i] + '"]').remove();
                        libelles.splice(i, 1);
                        values.splice(i, 1);
                        i--;
                    }
                }
            }
            $input.val(values.join(';'));
            $libelles.val(libelles.join(';'));
            $component.kMultiSelect().update();
            fireVanillaEvent('change', $input);
        }
    }

    var $kMultiselectsLtl = $('.kmultiselect-ltl');
    if ($kMultiselectsLtl.length > 0) {
        $kMultiselectsLtl.each(function (index, component) {
            $(component).kMultiSelect({
                instance: false,
                listMode: 'LtL',
                sortable: true,
                editable: $(component).hasClass('editable') ? true : false,
                removable: true,
                multiSelect: true,
                oldMode: true,
                editAction: function (row) {
                    if (window.specificEditAction) {
                        window.specificEditAction(row);
                    }
                },
                onAfterItemAdd: function (list, items) {
                    if (list.hasClass('kmultiselect-composition-list')) {
                        var $kMultiSelect = list.closest('.kmultiselect-ltl'),
                            $input = $kMultiSelect.find('input[name="' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]'),
                            $libelles = $kMultiSelect.find('input[name="LIBELLE_' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]'),
                            values = $.cleanArray($input.val().split(';')).join(';'),
                            libellesValues = $.cleanArray($libelles.val().split(';')).join(';');

                        $input.val(values);
                        $libelles.val(libellesValues);
                        items.each(function () {
                            if ($input.val()) {
                                $input.val($input.val() + ';' + $(this).data('value'));
                            } else {
                                $input.val($(this).data('value'));
                            }
                            if ($libelles.val()) {
                                $libelles.val($libelles.val() + ';' + $(this).attr('title'));
                            } else {
                                $libelles.val($(this).attr('title'));
                            }
                        });
                        if (window.specificAfterItemAdd) {
                            window.specificAfterItemAdd(list, items);
                        }
                        fireVanillaEvent('change', $input);
                    }
                },
                onAfterItemRemove: function (list, items) {
                    if (list.hasClass('kmultiselect-composition-list')) {
                        var $kMultiSelect = list.closest('.kmultiselect-ltl'),
                            $input = $kMultiSelect.find('input[name="' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]'),
                            $libelles = $kMultiSelect.find('input[name="LIBELLE_' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]'),
                            values = $.cleanArray($input.val().split(';')),
                            libellesValues = $.cleanArray($libelles.val().split(';'));

                        items.each(function () {
                            values.removeByValue($(this).data('value'));
                            libellesValues.removeByValue($(this).attr('title'));
                        });
                        $input.val(values.join(';'));
                        $libelles.val(libellesValues.join(';'));
                        fireVanillaEvent('change', $input);
                    }
                    if (window.specificAfterItemRemove) {
                        window.specificAfterItemRemove(list, items);
                    }
                },
                onItemSort: function (list) {
                    var $kMultiSelect = list.closest('.kmultiselect-ltl'),
                        $input = $kMultiSelect.find('input[name="' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]'),
                        $libelles = $kMultiSelect.find('input[name="LIBELLE_' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]');
                    if (list.hasClass('kmultiselect-composition-list')) {
                        $input.val('');
                        $libelles.val('');
                        list.find('li').each(function () {
                            if ($input.val()) {
                                $input.val($input.val() + ';' + $(this).data('value'));
                                $libelles.val($libelles.val() + ';' + $(this).attr('title'));
                            } else {
                                $input.val($(this).data('value'));
                                $libelles.val($(this).attr('title'));
                            }
                        });
                        fireVanillaEvent('change', $input);
                    }
                }
            });
        });

        $kMultiselectsLtl.each(function () {
            var $this = $(this),
                $compositionList = $this.find('.kmultiselect-composition-list'),
                $parentList = $this.find('.kmultiselect-parent-list'),
                inputName = $this.attr('id').replace('kmultiselect', ''),
                values = $this.find('input[name="' + inputName + '"]').val().split(';');

            $.each(values, function (index, value) {
                if (value) {
                    var $parentItem = $parentList.find('li[data-value="' + value + '"]');
                    if ($parentItem.length === 0) {
                        $('<li data-value="' + value + '" class="error">' + LOCALE_BO.libelle.inconnu + '</li>').appendTo($compositionList);
                    } else {
                        $parentList.find('li[data-value="' + value + '"]').appendTo($compositionList);
                    }
                }
            });
            $this.kMultiSelect().update();
        });
    }

    /**
     * Multi-valued component (popin to list mode)
     */
    var $kMultiselectsTtl = $('.kmultiselect-ttl');
    if ($kMultiselectsTtl.length > 0) {
        $kMultiselectsTtl.each(function (index, component) {

            var $component = $(component),
                actions = {};

            // Determine wether or not we should display popin action buttons
            if ($component.data('popinvalidate')) {
                actions.validate = {
                    title: LOCALE_BO.valider,
                    callback: function ($iframeContent, event, $iframe) {
                        buildCompositionList($iframeContent, $iframe, $component);
                        this.destroy();
                    }
                };
                actions.cancel = {
                    title: LOCALE_BO.annuler,
                    callback: function () {
                        this.destroy();
                    }
                };
            }

            // Component initialization
            $component.kMultiSelect({
                listMode: 'TtL',
                addAction: function () {
                    try {
                        // In case 'data-addaction' refers to a js function
                        eval($component.data('addaction'));
                    } catch (err) {
                        var $input = $component.find('input[name="' + $component.attr('id').replace('kmultiselect', '') + '"]');
                        var popin = $.iframePopin({
                                title: eval($component.data('popintitle')),
                                url: $.parametizeString($component.data('addaction') + '&MULTISELECT=true', [encodeURIComponent($input.val()), '']),
                                autoOpen: true,
                                resizable: true,
                                width: $component.data('popinwidth'),
                                buttons: actions,
                                onClose: function () {
                                    this.destroy();
                                }
                            });
                        var registeredId = iFrameHelper.registeriFrame({
                            onSendValues: function (object) {
                                var $multiInput = $component.find('input[name="' + $component.attr('id').replace('kmultiselect', '') + '"]'),
                                    $libelles = $component.find('input[name="LIBELLE_' + $component.attr('id').replace('kmultiselect', '') + '"]'),
                                    values = $.cleanArray($multiInput.val().split(';')),
                                    libelles = $.cleanArray($libelles.val().split(';'));
                                if ($.inArray(object.sCode, values) === -1) {
                                    var $li = $('<li>').attr('data-value', object.sCode).html(object.libelle);
                                    $component.kMultiSelect().add($li, true);
                                    values.unshift(object.sCode);
                                    libelles.unshift(object.libelle);
                                    $multiInput.val(values.join(';'));
                                    $libelles.val(libelles.join(';'));
                                    fireVanillaEvent('change', $multiInput);
                                }
                                if (object.destroy !== false ) {
                                    popin.destroy();
                                    iFrameHelper.unregisteriFrame(registeredId);
                                }
                            },
                            onAbort: function () {
                                popin.destroy();
                                iFrameHelper.unregisteriFrame(registeredId);
                            },
                            iFrame: popin.iFrame,
                            caller: $component
                        });
                    }
                },
                editAction: function ($item) {

                    var $input = $component.find('input[name="' + $component.attr('id').replace('kmultiselect', '') + '"]'),
                        $libelles = $component.find('input[name="LIBELLE_' + $component.attr('id').replace('kmultiselect', '') + '"]'),
                        values = $.cleanArray($input.val().split(';')),
                        libelles = $.cleanArray($libelles.val().split(';')),
                        itemIndex = $item.index(),
                        popinUrl = $.parametizeString(specificModifyItem($item), [$item.data('value'), '']);

                    var popin = $.iframePopin({
                        title: eval($component.data('popintitle')),
                        url: popinUrl,
                        autoOpen: true,
                        resizable: true,
                        width: $component.data('popinwidth'),
                        buttons: actions,
                        onClose: function () {
                            this.destroy();
                        }
                    });
                    var registeredId = iFrameHelper.registeriFrame({
                        onSendValues: function (object) {
                            $item.attr('data-value', object.sCode).html(object.libelle);

                            values[itemIndex] = object.sCode;
                            libelles[itemIndex] = object.libelle;

                            $input.val(values.join(';'));
                            $libelles.val(libelles.join(';'));
                            fireVanillaEvent('change', $input);

                            $component.kMultiSelect().update();
                            if (object.destroy !== false) {
                                popin.destroy();
                                iFrameHelper.unregisteriFrame(registeredId);
                            } 
                        },
                        onAbort: function () {
                            popin.destroy();
                            iFrameHelper.unregisteriFrame(registeredId);
                        },
                        iFrame: popin.iFrame,
                        caller: $component
                    });
                },
                sortable: true,
                editable: $(component).hasClass('editable') ? true : false,
                removable: true,
                multiSelect: true,
                toolbox: {
                    add: true,
                    edit: false,
                    remove: true
                },
                oldMode: true,
                onAfterItemRemove: function (list, items) {
                    if (list.hasClass('kmultiselect-composition-list')) {
                        var $kMultiSelect = list.closest('.kmultiselect-ttl'),
                            $input = $kMultiSelect.find('input[name="' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]'),
                            $libelles = $kMultiSelect.find('input[name="LIBELLE_' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]'),
                            values = $.cleanArray($input.val().split(';')),
                            libelles = $.cleanArray($libelles.val().split(';'));

                        items.each(function () {
                            values.removeByValue($(this).data('value'));
                            libelles.removeByValue($(this).text());
                        });

                        $input.val(values.join(';'));
                        $libelles.val(libelles.join(';'));
                        fireVanillaEvent('change', $input);
                    }
                },
                onItemSort: function (list) {
                    var $kMultiSelect = list.closest('.kmultiselect-ttl'),
                        $input = $kMultiSelect.find('input[name="' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]'),
                        $libelles = $kMultiSelect.find('input[name="LIBELLE_' + $kMultiSelect.attr('id').replace('kmultiselect', '') + '"]');

                    $input.val('');
                    $libelles.val('');

                    list.find('li').each(function () {
                        if ($input.val()) {
                            $input.val($input.val() + ';' + $(this).data('value'));
                        } else {
                            $input.val($(this).data('value'));
                        }
                        if ($libelles.val()) {
                            $libelles.val($libelles.val() + ';' + $(this).text());
                        } else {
                            $libelles.val($(this).text());
                        }
                        fireVanillaEvent('change', $input);
                    });
                }
            });
        });

        // Fill the various inputs on page loading
        $kMultiselectsTtl.each(function () {
            var $this = $(this),
                $compositionList = $this.find('.kmultiselect-composition-list'),
                $input = $this.find('input[name="' + $this.attr('id').replace('kmultiselect', '') + '"]'),
                $libelles = $this.find('input[name="LIBELLE_' + $this.attr('id').replace('kmultiselect', '') + '"]'),
                $arianes = $this.find('input[name="ARIANE_' + $this.attr('id').replace('kmultiselect', '') + '"]'),
                values = $.cleanArray($input.val().split(';')),
                libelles = $.cleanArray($libelles.val().split(';')),
                arianes = $.cleanArray($arianes.val().split(';'));

            $.each(values, function (index, value) {
                var ignore = value.lastIndexOf('#AUTO#', 0) === 0;
                $('<li>').addClass(ignore ? 'ignore' : '').html(libelles[index]).attr('data-value', value).attr('title', arianes[index]).appendTo($compositionList);
            });
            $this.kMultiSelect().update();
        });
    }

})(jQuery);
