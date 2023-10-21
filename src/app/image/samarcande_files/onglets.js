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
(function($) {
    var $items_tab = $('.onglets .onglets__item'),
        $buttons = $('.onglets-section .onglets-section__bouton'),
        $contentPanels = $('.onglets-section');
    $items_tab.click(function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        clearActives();
        setActives($(this));
    });
    $buttons.click(function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        var $ongletCourant = $('#' + $(this).parents('.onglets-section').attr('id'));
        var $contenuCourant = $ongletCourant.find(".onglets-section__contenu");
        $contenuCourant.slideToggle("slow", function() {
            $ongletCourant.toggleClass('onglets-section--actif', $contenuCourant.is(':visible'));
            $('[data-tab=' + $ongletCourant.attr('id') + ']').toggleClass('onglets__item--actif', $contenuCourant.is(':visible'));
            $('html, body').animate({
                scrollTop: $ongletCourant[0].offsetTop
            }, 0);
        });
    });
    function clearActives() {
        $items_tab.removeClass('onglets__item--actif');
        $buttons.removeClass('onglets-section__bouton--actif');
        $contentPanels.removeClass('onglets-section--actif');
    }
    function setActives($element) {
        var $contentPanel, $item;
        if ($element.attr('data-tab')) { // Tab case
            $contentPanel = $('#' + $element.attr('data-tab'));
            $item = $('.onglets__item', $contentPanel);
            $contentPanel.addClass('onglets-section--actif');
            $element.addClass('onglets__item--actif');
            $item.addClass('onglets-section__bouton--actif');
        } else { // Button case
            $contentPanel = $element.closest('.onglets-section');
            $item = $('.onglets .onglets__item[data-tab="' + $contentPanel.attr('id') + '"]');
            $contentPanel.addClass('onglets-section--actif');
            $element.addClass('onglets-section__bouton--actif');
            $item.addClass('onglets__item--actif');
        }
    }
})(jQuery.noConflict());
