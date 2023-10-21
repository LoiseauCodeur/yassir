/*
 * Copyright (C) 2015 - 2018 Kosmos contact@kosmos.fr
 *
 * Projet: agenda
 * Version: 2.07.16
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
(function() {
    'use strict';

    /**
     * Gestion des boutons de la saisie agenda en front.
     */
    var buttons = document.querySelectorAll("#js-saisie_agenda_front input[type='button']");
    var form = document.querySelector("#form_saisie_front");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            var action = this.dataset.action;
            if (this.dataset.iddate) {
                action += "#" + this.dataset.iddate;
            }
            form.ACTION.value = action;
            form.submit();
        });
    }
})();