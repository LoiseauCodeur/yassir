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
    /**
     * Handles default menu behaviors.
     */

    // Handle click and focusin events outside menus to close them
    $('html').click(function() {
        $.collapsableCommons.hideAll('.plier-deplier__contenu--relatif');
    });

    // Handle click and focusin events so it doesn't bubble to the html element
    $('.plier-deplier__contenu').click(function(e) {
        e.stopPropagation();
    });
    $('.plier-deplier').focusin(function(e) {
        e.stopPropagation();
    });

    // Triggers the opening of submenu
    $('.plier-deplier:not(.plier-deplier__contenu--relatif) .plier-deplier__bouton:not(#menu-principal-bouton)').click(function(e) {
        e.preventDefault();
        e.stopPropagation();

        var $this = $(this),
            $content = $this.closest('.plier-deplier').find('.plier-deplier__contenu');
        let foldUnfoldGroup = this.dataset['plierdeplierGroup'];

        if (foldUnfoldGroup) {
            $content = Array.prototype.filter.call($content, function(selectedElement) {
                return filterByElementGroupData(selectedElement, foldUnfoldGroup);
            });
        }
        let haveToClose = true;
        for (let i = 0; i < $content.length; i++) {
            haveToClose &= $content[i].classList.contains('plier-deplier__contenu--ouvert');
            $content[i].classList.toggle('plier-deplier__contenu--clos');
            $content[i].classList.toggle('plier-deplier__contenu--ouvert');
        }
        if (haveToClose) {
            $this.attr('aria-expanded', false);
            if (foldUnfoldGroup) {
                if ($content.find('input').length > 0) {
                    $('input', $content).filter(':visible:first').focus();
                }
                $.collapsableCommons.hideAll(function(selectedElement) {
                    return filterByElementGroupData(selectedElement, foldUnfoldGroup);
                });
            } else {
                $.collapsableCommons.hideAll();
            }
        } else {
            $this.attr('aria-expanded', true);
        }
    });

    /**
    * Permet de filtrer sur les éléments sélectionné.
    * Le filtre s'applique sur les éléments possédant le même data-attribute "plierdeplier-group".
    * @param selectedElement l'élément sélectionné
    * @param group le groupe d'application
    * @return {boolean} true si l'élément est accepté
    */
    function filterByElementGroupData(selectedElement, group) {
        return selectedElement.dataset['plierdeplierGroup'] === group;
    }

})(jQuery.noConflict());
