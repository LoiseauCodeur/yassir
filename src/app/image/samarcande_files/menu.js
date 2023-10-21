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
    'use strict';

    var $menu = $('#menu'),
        $menuLinks = $('a, button', $menu),
        $menuButton = $('#menu-principal-bouton');

    // Specific cleaning
    $.collapsableCommons.registerCallback(function() {
        $('li', $menu).removeClass('menu_principal--ouvert');
        $('li', $menu).attr('aria-expanded', false);
    });

    // Triggered when a link in the menu is clicked
    $menuLinks.click(function(e) {
        var $this = $(this),
            $parentLi = $this.closest('li'),
            $subMenu = $('.plier-deplier__contenu', $parentLi);
        if ($subMenu.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            $.collapsableCommons.hideAll('.plier-deplier__contenu--relatif');
            $parentLi.addClass('menu_principal--ouvert');
            $parentLi.attr('aria-expanded', true);
            $subMenu.removeClass('plier-deplier__contenu--clos').addClass('plier-deplier__contenu--ouvert');
        }
    });

    $menuButton.click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        if ($menu.is('.plier-deplier__contenu--clos')) {
            $menu.removeClass('plier-deplier__contenu--clos').addClass('plier-deplier__contenu--ouvert');
            $this.attr('aria-expanded', true);
        } else {
            $menu.removeClass('plier-deplier__contenu--ouvert').addClass('plier-deplier__contenu--clos');
            $this.attr('aria-expanded', false);
        }
    });

    // Handle click and focusin events outside menus to close them
    $('html').click(function() {
        if ($menu.is('.plier-deplier__contenu--ouvert')) {
            $menu.removeClass('plier-deplier__contenu--ouvert').addClass('plier-deplier__contenu--clos');
        }
    });

})(jQuery.noConflict());
