/*
 * Copyright (C) 2015 - 2018 Kosmos contact@kosmos.fr
 *
 * Projet: formulaire
 * Version: 1.07.17
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
(function () {
    'use strict';

    /**
     * Fonction permettant de valider les champs obligatoire sur les checkboxs
     */
    function initValidationCheckbox() {
        var forms = document.querySelectorAll('.js-form-redacteur');
        if (forms) {
            [].forEach.call(forms, function (form) {
                form.addEventListener('submit', function (evt) {
                    controlCheckbox(evt, form);
                });
            });
        }
    }

    function controlCheckbox(event, form) {
        var groupsCheckbox = form.querySelectorAll('.js-checkbox-mandatory');
        if (groupsCheckbox) {
            [].forEach.call(groupsCheckbox, function (group) {
                if (group.querySelectorAll('input[type="checkbox"]:checked').length < 1) {
                    // On stop l'envoi du formulaire
                    event.preventDefault();
                    createMessageError(group, form);
                }
            });
        }
    }

    function createMessageError(group, form) {
        var allErrorForm = document.querySelectorAll('.js-erreur-form');
        [].forEach.call(allErrorForm, function (elem) {
            if (elem.parentNode) {
                elem.parentNode.removeChild(elem);
            }
        });
        if (form) {
            var elementError = document.createElement('p');
            elementError.className = 'erreur js-erreur-form';
            var libelle = group.dataset.libelle;
            elementError.appendChild(document.createTextNode(LOCALE_BO.formulaire.erreurZone + ' ' + libelle + ' ' + LOCALE_BO.formulaire.erreurZoneObligatoire));
            form.parentNode.insertBefore(elementError, form);
        }
    }

    initValidationCheckbox();
})();
