/*
 * Copyright (C) 2015 - 2018 Kosmos contact@kosmos.fr
 *
 * Projet: frontgen
 * Version: 6.07.25
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
    /**
     * jQuery validation
     */

        // Custom date format validation
    $.validator.addMethod(
        'ksupDate',
        function ksupDate(value) {
            if (!value) {
                return true;
            }
            var patternElement = document.querySelector('[name=DATE_PATTERN_FORMAT]'),
                pattern = 'dd/MM/yyyy';
            if (patternElement) {
                pattern = patternElement.value;
            }
            var monthIndex = pattern.split('/').findIndex(function (current) {
                return current.toLowerCase() === 'mm';
            });
            var dayIndex = pattern.split('/').findIndex(function (current) {
                return current.toLowerCase() === 'dd';
            });
            var regExp = /([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/g,
                values = regExp.exec(value);
            if (values == null || regExp.test(value)) {
                return false;
            }
            var day = $.parseInteger(values[dayIndex + 1]),
                month = $.parseInteger(values[monthIndex + 1]);
            if (day > 31 || month > 12) {
                return false;
            }
            return !(month === 2 && day > 29);
        }, LOCALE_BO.validationMessages.ksupDate);
    // Custom phone format validation
    $.validator.addMethod(
        'ksupPhone',
        function ksupPhone(value) {
            if (!value) {
                return true;
            }
            var regExp = /^((\+)*[0-9]{1,3}|0)[0-9]{9}$/;
            return regExp.test(value);
        }, LOCALE_BO.validationMessages.ksupPhone);
    // Custom phone format validation
    $.validator.addMethod(
        'constraint',
        function constraint(value, element) {
            var hasInvalidClass = $(element).hasClass('js-constraint-violation__field');
            if (hasInvalidClass) {
                $(element).removeClass('js-constraint-violation__field');
            }
            return !hasInvalidClass;
        }, LOCALE_BO.validationMessages.constraint);
    $.validator.addClassRules(
        'type_phone', {
            required: function (element) {
                return $(element).prop('required');
            },
            ksupPhone: true
        });
    $.validator.addClassRules(
        'type_email', {
            required: function (element) {
                return $(element).prop('required');
            },
            'email': true
        });
    $.validator.addClassRules(
        'type_date', {
            required: function (element) {
                return $(element).prop('required');
            },
            ksupDate: true,
            maxlength: 10
        });
    $.validator.addClassRules(
        'type_url', {
            required: function (element) {
                return $(element).prop('required');
            },
            url: true
        });
    $.validator.addClassRules(
        'numeric_input', {
            required: function (element) {
                return $(element).prop('required');
            },
            digits: true
        });
    $.validator.addClassRules(
        'js-constraint-violation__field', {
            constraint: true
        });
    var $formToValidate = $('form');
    $formToValidate.find('input + .js-constraint-violation__message').each(
        function () {
            var $currentElement = $(this);
            var input = $currentElement.prev();
            input.addClass('js-constraint-violation__field');
            input.attr('data-msg-constraint', $currentElement.text());
        });
    $formToValidate.find('div.validation_saisie_captcha + .js-constraint-violation__message').each(
        function () {
            var $currentElement = $(this);
            var captcha = $currentElement.prev();
            var input = captcha.find('input');
            input.addClass('js-constraint-violation__field');
            input.attr('data-msg-constraint', $currentElement.text());
        });
    var validateOptions = {
        ignore: '.ignore, :hidden',
        focusCleanup: true,
        errorElement: 'div'
    };
    $formToValidate.each(
        function (index, component) {
            var $component = $(component);
            $component.validate(validateOptions);
        });
    var serverErrorFields = $formToValidate.find('[data-msg-constraint]');
    if (serverErrorFields.length > 0) {
        serverErrorFields.valid(validateOptions);
    }

    /**
     * Input helper
     */
    /**
     * Tooltips : montre le nombre de caractères qui peuvent être saisis
     */
    function updateToolTip() {
        var $this = $(this),
            popover = $(this).data('tooltip'),
            tip = popover.tip(),
            len = $this[0].value.replace(/(\r\n|\n|\r)/g, '--').length;
        popover.options.content = LOCALE_FO.tooltip.char_remaining.replace('{0}', len).replace('{1}', $(this).attr('maxlength'));
        popover.options.title = popover.options.content;
        var visible = popover && tip && tip.is(':visible');
        if (visible) {
            tip.find('.tooltip-inner').html(popover.options.content);
        } else {
            popover.show();
        }
    }

    var $maxedInputs = $('form:not([data-no-tooltip]) input[type="text"][maxlength], form:not([data-no-tooltip]) textarea[maxlength]');
    if ($maxedInputs.length > 0) {
        $maxedInputs.removeAttr('title');
        $maxedInputs.each(
            function (index, component) {
                var $component = $(component);
                $component.tooltip(
                    {
                        placement: 'right',
                        title: LOCALE_FO.tooltip.char_remaining.replace('{0}', $component.val().length).replace('{1}', $component.attr('maxlength')),
                        trigger: 'focus',
                        template: '<span aria-atomic="true" aria-live="polite" class="tooltip">' +
                                    '<span class="tooltip-arrow"></span>' +
                                    '<span class="tooltip-inner"></span>' +
                                  '</span>'
                    });
                $component.bind('change keyup blur input focus', updateToolTip);
                if ($component.is(':focus')) {
                    $component.tooltip('show');
                }
            });
    }

    $('textarea[maxlength]').bind(
        'keyup blur', function () {
            var $this = $(this),
                len = $this[0].value.replace(/(\r\n|\n|\r)/g, '--').length,
                maxlength = $this.attr('maxlength');
            if (maxlength && len > maxlength) {
                var delta = len - maxlength;
                $this.val($this.val().slice(0, maxlength - delta));
            }
        });

    /**
     * Password strength meter
     */
    var options = {
        ui: {
            bootstrap2: true,
            showVerdicts: false,
            showErrors: true,
            verdicts: LOCALE_BO.validationMessages.pwdVerdicts,
            errorMessages: LOCALE_BO.validationMessages.pwdErrorMessages,
            viewports: {
                progress: ".pwd--progress",
                errors: "pwd--error-list"
            }
        }
    };
    if (window.pwsOptions) {
        $.extend(true, options, window.pwsOptions);
    }
    $('.pwdStrength :password').pwstrength(options);
    $formToValidate.triggerHandler('validate.ready');
})(jQuery.noConflict());
