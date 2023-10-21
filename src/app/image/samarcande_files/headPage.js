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
/*
 * Specific front-office scripts wich handles "actions" and "haut_pages" behaviours
 */

(function($){
    var isHeadPageVisible = false,                                // Is the header frame visible
        criticalPoint;

    $(window).load(function() {
        var $haut_page = $('#haut_page');

        $(window).scroll(onWindowScroll);

        // Clear content in JS mode
        var $link = $('a', $haut_page).html('').detach();
        $haut_page.children().remove();
        $('<span class="icon icon-arrow-up3">').appendTo($link);    // TODO : autre icone ?
        $link.appendTo($haut_page);

        // Specific values for initialization
        $haut_page.transition({y: "+=100", opacity: "0"}, function(){
            handleButton();
        });
    });

    // Determine if "haut_page" should be visible according to the "window.scrollTop" value
    function handleButton(){
        var $window = $(window),
        $hautPage = $('#haut_page'),
        criticalPoint = $('#page').position().top;

        if($window.scrollTop() > criticalPoint){
            if(!isHeadPageVisible){
                $hautPage.transition({y: "-=100", opacity: "1"});
                isHeadPageVisible = true;
            }
        }

        if($window.scrollTop() > 0 && $window.scrollTop() < criticalPoint){
            if(isHeadPageVisible){
                $hautPage.transition({y: "+=100", opacity: "0"});
                isHeadPageVisible = false;
            }
        }
    }

    // Triggered when the window is scrolled
    function onWindowScroll(){
        handleButton();
    }

    // Triggered when 'haut_page' button is clicked
    $('#haut_page').click(function(){
        $(this).transition({y: "+=100", opacity: "0"});
        isHeadPageVisible = false;
    });

})(jQuery.noConflict());