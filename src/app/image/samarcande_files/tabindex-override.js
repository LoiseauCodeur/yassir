/**
 * + tabindexes = array of selectors for wich we need to compute a new tabindex
 *     - This property can be customized by adding an array with the name 'customIndexes' at a global level
 * + focusable = array of selectors contained in 'tabindexes' elements for wich we need to compute a new tabindex
 *   - This property can be customized by adding an array with the name 'customFocusable' at a global level
 */
var tabindexes, focusable;
// Triggered on page load
(function ($) {
    'use strict';
    tabindexes = $.merge(
        [
            '#versions .plier-deplier__bouton',
            '#recherche-simple .plier-deplier__bouton',
            '#recherche-simple input[name="QUERY"]',
            '#recherche-simple input[type="submit"]',
            '#menu_principal li a, #menu_principal li button',
            '#connexion .plier-deplier__bouton',
            'header .banniere__logo',
            '#acces-directs .plier-deplier__bouton'
        ], window.customIndexes || []);
    focusable = $.merge(['input:not([type="hidden"])', 'a', 'button'], window.customFocusable || []);

    // Tabindexes override according to CSS stream modifications
    function overrideTabIndex() {
        'use strict';
        var $ = jQuery,
            currentIndex = 1;
        $.each(
            tabindexes, function (index, selector) {
                var $parent = $(selector).closest('.plier-deplier');
                $(selector).each(
                    function () {
                        var $this = $(this);
                        if ($this.length > 0 && !$this.attr('tabindex')) {
                            $this.attr('tabindex', currentIndex++);
                        }
                    });
                $.each(
                    focusable, function (indexFocus, value) {
                        $('.plier-deplier__contenu ' + value, $parent).each(
                            function () {
                                var $this = $(this);
                                if ($this.length > 0 && !$this.attr('tabindex')) {
                                    $this.attr('tabindex', currentIndex++);
                                }
                            });
                    });
            });
    }
    overrideTabIndex();
})(jQuery.noConflict());

