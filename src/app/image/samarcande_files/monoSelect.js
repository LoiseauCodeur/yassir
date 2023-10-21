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
 * Mono valued component instantiation for the backoffice
 */

(function ($) {
    'use strict';

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

    var $kMonoSelects = $('.kmonoselect');
    if ($kMonoSelects.length > 0) {
        $kMonoSelects.each(
            function (index, component) {
                var $component = $(component),
                    $input = $component.find('input[name="' + $component.attr('id').replace('kMonoSelect', '') + '"]'),
                    $inputLibelle = $component.find('input[name="LIBELLE_' + $input.attr('name') + '"]');
                var actions = {};
                if ($component.data('popinvalidate')) {
                    actions.validate = {
                        title: LOCALE_BO.valider,
                        callback: function ($iframeContent, event, $iframe) {
                            var iFrame$ = $iframe[0].contentWindow.jQuery,
                                datatable = iFrame$.fn.dataTable.fnTables(true),
                                $selected;
                            if (datatable.length > 0) {
                                $selected = iFrame$('.datatableUtilisateurRECHERCHE');
                            } else {
                                var jsTree = iFrame$.jstree._reference('.kTree');
                                $selected = jsTree.get_selected();
                            }
                            if ($selected.length === 1) {
                                $input.val($selected.data('sCode'));
                                $inputLibelle.val($selected.data('libelle'));
                                $component.kMonoSelect().value($selected.data('libelle'));
                            }
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
                $component.kMonoSelect(
                    {
                        isLabelOnButtonsVisible: false,
                        value: $component.data('value'),
                        title: $component.data('title'),
                        isClearable: !$component.hasClass('not-clearable'),
                        cultures: {
                            'fr': {
                                'placeholder': window.kMonoSelectPlaceHolder && window.kMonoSelectPlaceHolder[$component.data('placeholder')] ? window.kMonoSelectPlaceHolder[$component.data('placeholder')] : ''
                            }
                        },
                        editAction: function () {
                            try {
                                eval($component.data('editaction'));
                            } catch (err) {
                                var popin = $.iframePopin(
                                    {
                                        title: eval($component.data('popintitle')),
                                        url: $.parametizeString($component.data('editaction'), [$input.val(), '']),
                                        autoOpen: true,
                                        resizable: false,
                                        width: $component.data('popinwidth'),
                                        onClose: function ($iframe) {
                                            this.destroy();
                                        },
                                        buttons: actions
                                    });
                                var registeredId = iFrameHelper.registeriFrame(
                                    {
                                        onSendValues: function (object) {
                                            $input.val(object.sCode);
                                            $inputLibelle.val(object.libelle);
                                            fireVanillaEvent('change', $input);
                                            $component.kMonoSelect().value(object.libelle, object.fil);
                                            popin.destroy();
                                            iFrameHelper.unregisteriFrame(registeredId);
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
                        onFieldCleared: function () {
                            $input.val('');
                            fireVanillaEvent('change', $input);
                            $inputLibelle.val('');
                        }
                    });
            });
    }
})(jQuery);
