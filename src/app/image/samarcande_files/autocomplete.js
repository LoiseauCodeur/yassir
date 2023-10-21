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
    'use strict';
    // Retrieve inputs with an auto-complete service url
    var $autoCompleteInputs = $('input[data-autocompleteurl]');

    function getDataValue(data) {
        if (typeof data === 'string') {
            return data;
        } else {
            if (data && data.value) {
                return data.value;
            }
        }
    }

    if ($autoCompleteInputs.length > 0) {
        $autoCompleteInputs.each(
            function () {
                var $this = $(this),
                    width = $.parseInteger($this.data('width'));
                $this.autocomplete(
                    {
                        serviceUrl: $this.data('autocompleteurl'),
                        params: {
                            'BEAN_AUTO_COMPLETION': $this.data('bean'),
                            'BEANKEY_AUTO_COMPLETION' : $this.data('beankey'),
                            'l' : $this.data('langue')
                        },
                        groupBy: $this.data('groupby') || '',
                        position: $this.data('position') || 'left',
                        width: width !== 0 ? width : 'auto',
                        minChars: 3,
                        deferRequestBy : 400,
                        showNoSuggestionNotice: $this.data('display-noresult') ? $this.data('display-noresult') : true,
                        noSuggestionNotice: LOCALE_BO.services.auto_complete.noresult,
                        onSearchStart: function () {
                            var $suggestions = $($(this).autocomplete().suggestionsContainer);
                            $suggestions.css(
                                {
                                    display: 'block',
                                    height: '30px'
                                });
                            $('<div>').addClass('throbber').appendTo($suggestions);
                            $('<span>').addClass('message').html(LOCALE_BO.services.auto_complete.search).appendTo($suggestions);
                        },
                        onSearchComplete: function () {
                            var $suggestions = $($(this).autocomplete().suggestionsContainer);
                            $suggestions.css(
                                {
                                    display: 'block',
                                    height: 'auto'
                                });
                            $suggestions.find('.message, .throbber').remove();
                        },
                        onSelect: function (suggestion) {
                            var $form = $this.closest('form'),
                                $hidden = $('input[type="hidden"][data-inputfor="' + $this.attr('id') + '"]'),
                                ignoreValidation = $this.attr('data-ignorevalidation'),
                                submitOnSelect = $this.attr('data-submitonselect');
                            if ($hidden.length > 0) {
                                var value = getDataValue(suggestion.data) || '';
                                $hidden.attr('data-selectedvalue', suggestion.value);
                                $hidden.val(value);
                                $hidden.trigger('change');
                            }
                            if (ignoreValidation && $form.validate) {
                                $this.addClass(ignoreValidation);
                                $form.valid();
                                $this.trigger('change');
                            }
                            if (submitOnSelect === undefined || submitOnSelect === 'true') {
                                $form.submit();
                            }
                        }
                    });
                $this.on(
                    'change keyup', function () {
                        var $form = $this.closest('form'),
                            $hidden = $('input[type="hidden"][data-inputfor="' + $this.attr('id') + '"]');
                        if ($hidden.length > 0 && $hidden.attr('data-selectedvalue') !== $this.val()) {
                            $('input[type="hidden"][data-inputfor="' + $this.attr('id') + '"]').val($this.val());
                            if ($this.is('.' + $this.attr('data-ignorevalidation')) && $form.validate) {
                                $this.removeClass($this.attr('data-ignorevalidation'));
                                $form.valid();
                            }
                        }
                    });
            });
    }
})(jQuery.noConflict());
