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
(function($){
    // Delegate .transition() calls to .animate()
    // if the browser can't do CSS transitions.
    if (!$.support.transition) $.fn.transition = $.fn.animate;

    /**
     * Locale de la page courante
     */
    var locale = $('html').attr('lang');

    /**
     * Initialisation des champs de type date
     */
    $('.type_date').datepicker($.datepicker.regional[locale]);
 
    /**
     * Les rubriques externes doivent s'ouvrir dans des nouvelles
     */
    $('.type_rubrique_0004').click(function() {
        window.open(this.href);
        return false;
    });

    $('.js-force-reload').click(function() {
        window.location.reload(true);
    });

    // Fonctionnalité de visualisation d'une image
    $('a[data-imgmagnifier]').magnificPopup({
        type: 'image'
    });
})(jQuery.noConflict());