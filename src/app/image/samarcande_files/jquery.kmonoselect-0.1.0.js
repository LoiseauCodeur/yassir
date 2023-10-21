/*
 * $kmonoselect jQuery plugin
 * 
 * version 0.1.0
 * 
 * Kosmos
 * 
 * Files below need to be referenced in the calling page for the component to run correctly :
 * 
 * 	JS :
 * 	- jQuery ( jquery-XX.XX.XX.js )
 *  - jQuery UI ( jquery-ui-XX.XX.XX.custom.js )
 *  
 *  CSS : 
 *  - a jQuery UI theme ( jquery-ui-XX.XX.XX.css )
 *  - component style ( kmonoselect-XX.XX.XX.css )
 * 
 */

(function ($) {

    $.kMonoSelect = function (root, options) {
        var $kMonoSelect = $(root),

            $fieldButton,
            $placeHolder,

            settings,

            toolbox = {
                $editButton: null,
                $clearButton: null
            },

            ua = navigator.userAgent;

        //////////////////////////////////////////////////////
        //					PRIVATE METHODS					//
        //////////////////////////////////////////////////////

        // Initialize the component
        function _init() {

            // Default settings
            var defaults = {

                // Should the constructor return an instance of the created object
                instance: false,								// Should a instance of the component be returned at creation

                isLabelOnButtonsVisible: false,					// Should the buttons display labels next to the icons
                isClearable: true,								// Should the "Clear" button appear

                disabled: false,								// Component's interactivity state
                value: '',										// Component's value
                title: '',

                editAction: function () {
                },						// Action to be performed when the edit button is clicked

                defaultCulture: 'fr',							// Default culture used as a fallback
                selectedCulture: null,							// Culture to use
                cultures: {										// Default cultures
                    'fr': {
                        'editAction': LOCALE_BO.kselect.mono.select,
                        'clearAction': LOCALE_BO.kselect.mono.clear,
                        'placeholder': ''
                    },
                    'en': {
                        'editAction': 'Select',
                        'clearAction': 'Clear',
                        'placeholder': ''
                    }
                },

                onFieldChanged: function (value) {
                },				// Triggered when the component's value changes
                onFieldCleared: function (oldValue) {
                }			// Triggered when the component's value is cleared
            };

            // Merge defaults and options settings
            settings = $.extend(true, {}, defaults, options);

            // Store a reference to the $kMonoSelect object
            $.data(root, "kMonoSelect", $kMonoSelect);
            $kMonoSelect.addClass('kmonoselect');
        }

        // Creates the component and the toolbox associated
        function _createComponent() {

            if (settings.isClearable) {
                toolbox.$clearButton = $('<button type=\"button\">').addClass('kmonoselect-button kmonoselect-clear-button').prependTo($kMonoSelect).button({
                    text: settings.isLabelOnButtonsVisible,
                    icons: {
                        primary: "ui-icon-closethick"
                    }
                });
            }

            toolbox.$editButton = $('<button type=\"button\">').addClass('kmonoselect-button kmonoselect-edit-button').prependTo($kMonoSelect);
            $fieldButton = $('<div>').addClass('kmonoselect-field').prependTo($kMonoSelect);
            $('<span>').addClass('ui-button-text').appendTo($fieldButton);

            toolbox.$editButton.button({
                text: settings.isLabelOnButtonsVisible,
                icons: {
                    primary: "ui-icon-folder-open"
                }
            });

            $kMonoSelect.buttonset();
            _culture();
            _value(settings.value, settings.title);
            _updateLayout();
        }

        // Get or set component's value
        function _value(value, title) {
            if (value) {
                var tip = title ? title : value;
                $fieldButton.removeClass('placeholder').attr('title', tip).find('span').text(value);
                settings.value = value;
                settings.onFieldChanged(value);
            } else {
                var placeholder = _getCultureKey(settings.selectedCulture, 'placeholder');
                $fieldButton.addClass('placeholder').attr('title', placeholder).find('span').html(placeholder);
            }
            _updateLayout();
        }

        // Clear component's value
        function _clearAction() {
            var currentValue = $fieldButton.attr('title');
            if (currentValue != '') {
                var placeholder = _getCultureKey(settings.selectedCulture, 'placeholder');
                $fieldButton.addClass('placeholder').attr('title', placeholder).find('span').html(placeholder);
                settings.value = '';
                settings.onFieldCleared(currentValue);
            }
            _updateLayout();
        }

        // Apply the specified culture to the component
        function _culture(culture) {
            var currentCulture = culture ? culture : settings.selectedCulture ? settings.selectedCulture : settings.defaultCulture;

            var currentLabel = _getCultureKey(currentCulture, 'editAction');
            toolbox.$editButton.button('option', 'label', settings.isLabelOnButtonsVisible ? currentLabel : '').attr('title', currentLabel);

            if (settings.isClearable) {
                currentLabel = _getCultureKey(currentCulture, 'clearAction');
                toolbox.$clearButton.button('option', 'label', settings.isLabelOnButtonsVisible ? currentLabel : '').attr('title', currentLabel);
            }

            if ($fieldButton.hasClass('placeholder')) {
                var placeholder = _getCultureKey(currentCulture, 'placeholder');
                $fieldButton.addClass('placeholder').attr('title', placeholder).find('span').html(placeholder);
            }

            _updateLayout();
        }

        // Retrieve a string in the specified culture or in the default culture if it doesn't exist
        function _getCultureKey(culture, key) {
            if (settings.cultures[culture] && settings.cultures[culture][key]) {
                return settings.cultures[culture][key];
            } else {
                // Fallback on default culture
                return settings.cultures[settings.defaultCulture][key];
            }
        }

        // Update component's layout according to current settings
        function _updateLayout() {

            if (settings.disabled) {
                $kMonoSelect.disable();
            } else {
                if (settings.isClearable) {
                    // Clear Button
                    if (settings.value && settings.value != '') toolbox.$clearButton.button('option', 'disabled', false);
                    else toolbox.$clearButton.button('option', 'disabled', true);
                }
            }
        }

        //////////////////////////////////////////////////////
        //					EVENTS HANDLING					//
        //////////////////////////////////////////////////////

        // Function used to bind mouse events to the component
        function _handleInteractions() {
            $fieldButton.click(function (e) {
                e.preventDefault();
                settings.editAction();
                return false;
            });
            toolbox.$editButton.click(function (e) {
                e.preventDefault();
                settings.editAction();
                return false;
            });
            if (settings.isClearable) {
                toolbox.$clearButton.click(function (e) {
                    e.preventDefault();
                    _clearAction();
                    return false;
                });
            }
        }

        ////////////////////EVENTS HANDLING///////////////////

        ////////////////////PRIVATE METHODS///////////////////

        //////////////////////////////////////////////////////
        //					PUBLIC METHODS					//
        //////////////////////////////////////////////////////

        // Get or set component value
        $kMonoSelect.value = function (value, title) {
            if (value) {
                if (!settings.disabled) {
                    _value(value, title);
                }
                return $kMonoSelect;
            }
        };

        // Clear the component value
        $kMonoSelect.clear = function () {
            if (settings.isClearable) {
                _clearAction();
            }
            return $kMonoSelect;
        };

        // Get or set the current culture
        $kMonoSelect.culture = function (culture) {
            if (culture) {
                _culture(culture);
                return $kMonoSelect;
            } else {
                return settings.selectedCulture ? settings.selectedCulture : settings.defaultCulture;
            }
        };

        // Disable component
        $kMonoSelect.disable = function () {
            toolbox.$editButton.button('option', 'disabled', true);
            toolbox.$clearButton.button('option', 'disabled', true);
            settings.disabled = true;
        };

        // Enable component
        $kMonoSelect.enable = function () {
            toolbox.$editButton.button('option', 'disabled', false);
            toolbox.$clearButton.button('option', 'disabled', false);
            settings.disabled = false;
        };

        ////////////////////PUBLIC METHODS////////////////////

        //////////////////////////////////////////////////////
        //					INITIALIZATION					//
        //////////////////////////////////////////////////////

        // Initialize the component
        _init();

        // Create the component
        _createComponent();

        // Handles interactions with the component
        _handleInteractions();

        ////////////////////INITIALIZATION////////////////////
    };


    $.fn.kMonoSelect = function (options, params) {
        if (options) {
            options = options || {};

            if (typeof options === "object") {
                this.each(function () {
                    if ($(this).data('kMonoSelect')) {
                        if (options.remove) {
                            $(this).data('kMonoSelect').remove();
                            $(this).removeData('kMonoSelect');
                        }
                    }
                    else if (!options.remove) {
                        if (options.enable === undefined && options.disable === undefined)
                            options.enable = true;

                        new $.kMonoSelect(this, options);
                    }
                });

                if (options.instance)
                    return $(this).data('kMonoSelect');

                return this;
            }
        } else {
            return $(this).data('kMonoSelect');
        }
        ;
    };
})(jQuery);