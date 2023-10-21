/*
 * Copyright (C) 2015 - 2018 Kosmos contact@kosmos.fr
 *
 * Projet: search
 * Version: 6.07.65
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
/**
 * Script lié à la recherche elastic en FO
 */
(function () {
    const forms = document.querySelectorAll('.js-search_query_input');
    const searchBreakPoint = getComputedStyle(document.documentElement).getPropertyValue('--responsive-point-search');

    /**
     * Fonction permettant de rendre responsive la partie liée aux critères de recherche
     */
    const responsiveSearchCriteria = function (form) {
        const legends = form.querySelectorAll('.js-topic__title');
        const topicLists = form.querySelectorAll('.js-topic__list');
        const allTopics = form.querySelector('#js-all-topics');
        const toggleTopics = form.querySelector('#js-toggle-topics');
        if (legends && toggleTopics && allTopics && topicLists) {
            if (window.matchMedia('(max-width:'+ searchBreakPoint +')').matches) {
                toggleTopics.classList.remove('hide');
                allTopics.classList.add('hide');
                [].forEach.call(legends, (function (legend) {
                    legend.classList.add('topic__title--collapsed');
                }));
                [].forEach.call(topicLists, (function (topicList) {
                    topicList.classList.add('topic__list--collapsed');
                }));
            } else {
                toggleTopics.classList.add('hide');
                allTopics.classList.remove('hide');
                [].forEach.call(legends, (function (legend) {
                    legend.classList.remove('topic__title--collapsed');
                }));
                [].forEach.call(topicLists, (function (topicList) {
                    topicList.classList.remove('topic__list--collapsed');
                }));
            }
        }
    };

    /**
     * Fonction vérifiant la taille de la fenêtre de navigation pour appeler la fonction responsiveSearchCriteria
     */
    const watchViewportSize = function (form) {
        window.addEventListener('resize', function () {
            window.requestAnimationFrame(function () {
                responsiveSearchCriteria(form);
            });
        }, true);
    };

    /**
     * Fonction permettant de cacher le bouton filtre (en mode responsive) lors d'un click et de gerer l'attribut aria-expanded
     */
    const createToggleTopics = function (form) {
        const toggleTopics = form.querySelector('#js-toggle-topics');
        const allTopics = form.querySelector('#js-all-topics');
        if (allTopics && toggleTopics) {
            toggleTopics.addEventListener('click', function () {
                allTopics.classList.toggle('hide');
                toggleTopics.setAttribute('aria-expanded', !allTopics.classList.contains('hide'));
            });
        }
    };

    /**
     * Fonction prenant en compte l'affichage des médias dans les résultats
     */
    const attachEvent = function (form) {
        const allTopics = form.querySelector('#js-all-topics');
        if (allTopics) {
            allTopics.addEventListener('click', function (e) {
                if (e.target && e.target.matches('.js-topic__title') && window.matchMedia('(max-width: '+ searchBreakPoint +')').matches) {
                    e.target.nextElementSibling.classList.toggle('topic__list--collapsed');
                    e.target.classList.toggle('topic__title--opened');
                }
            });
        }
    };

    /**
     * Fonction prenant en compte le fait de cacher ou d'afficher le bouton plus ou moins sur des filtres
     * @param e l'evenement
     */
    const topicMoreOrLess = function (e) {
        e.target.parentElement.getElementsByClassName('topic__list-input')[0].focus();
        const topicButton = e.target.parentElement.querySelector('.topic__see-more');
        topicButton.classList.toggle('topic__see-more-open');
        topicButton.setAttribute('aria-expanded', topicButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        const topicListCollapsed = e.target.getAttribute('aria-controls');
        document.getElementById(topicListCollapsed).classList.toggle('hide');
    };

    /**
     * Fonction appliquant à toutes les listes de filtre la fonction topicMoreOrLess
     */
    const aggregationUpdate = function (form) {
        const dataTopicDsiclosure = form.querySelectorAll('[data-topic-disclosure]');
        dataTopicDsiclosure.forEach(function(e) {
            e.addEventListener('click', topicMoreOrLess);
        });
    };

    /**
     * Fonction permettant de lancer une recherche lors du click d'un des choix proposés par l'autocomplétion
     * Elle est basée sur le principe de la délégation d'événement car les choix proposés sont créé dynamiquement
     */
    const launchFormSearchAfterItemSelected = function (form) {
        form.addEventListener('click', function (e) {
            if (e.target.classList.contains('search__option')) {
                form.submit();
            }
        });
    };

    /**
     * Fonction permettant d'introduire une notion de delay
     * @param callback la fonction ayant besoin du délai
     * @param time le temps souhaité (ms)
     */
    const delay = function (callback, time) {
        let timer = null;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            timer = null;
            callback();
        }, time);
    };

    /**
     * Fonction permettant d'effectuer des modifications sur les filtres lorsqu'on interagis sur les checkbox lié
     * - Effet visuel lorsqu'on décoche une checkbox (filtre supprimé au dessus de la barre de recherche)
     * - Lorsqu'un filtre à des sous filtres, les sous filtres sont décochés aussi si le filtre parent est décoché
     */
    const onTopicListsItemChange = function (form) {
        const topicListItem = form.querySelectorAll('.js-topic__list-item');
        if (topicListItem) {
            [].forEach.call(topicListItem, (function (value) {
                value.addEventListener('change', function (e) {
                    const eTarget = e.target;
                    if (eTarget.classList.contains('js-topic__list-nested-parent') && !eTarget.checked) {
                        const cbs = eTarget.parentNode.querySelectorAll('input[type="checkbox"]');
                        [].forEach.call(cbs, function (cb) {
                            cb.checked = false;
                        });
                    }
                    if (eTarget.checked === false) {
                        const eTargetParentFor = eTarget.nextElementSibling.getAttribute('for');
                        const eTargetAggName = eTargetParentFor.substring(0, eTargetParentFor.indexOf('-'));
                        const eTargetValue = eTargetParentFor.substring(eTargetParentFor.indexOf('-') + 1);
                        //visuel
                        form.querySelector('a[data-filter-name="' + eTargetAggName + '"][data-filter-value="' + eTargetValue + '"]').parentNode.remove();
                    }
                    form.submit();
                });
            }));
        }
    };

    /**
     * Fonction d'initalisation des différentes fonction et du composant d'autocomplétion lié à search
     */
    const initFunction = function (form) {
        var statusMessage = '';
        /**
         * Déclaration du composant d'autocomplétion
         */
        const elemSearchAutocompletion = form.querySelector('.js-search__autocomplete-wrapper');
        if (elemSearchAutocompletion) {
            accessibleAutocomplete({
                element: elemSearchAutocompletion,
                id: 'js-search-autocomplete-label',
                cssNamespace: 'search',
                defaultValue: (elemSearchAutocompletion !== null) ? elemSearchAutocompletion.getAttribute('data-query') : "",
                source: function (query, populateResults) {
                    const data_autocompleteurl = elemSearchAutocompletion.getAttribute('data-autocompleteurl');
                    const data_bean = elemSearchAutocompletion.getAttribute('data-bean');
                    const data_beankey = elemSearchAutocompletion.parentElement.querySelector('input[name="beanKey"]').value;
                    const langue = elemSearchAutocompletion.parentElement.querySelector('input[name="l"]').value;
                    let additionnalFilters = '';
                    // On ajoute dans la requête, les filtres sélectionnés dans les facettes
                    const sectionTopic = form.querySelector('#js-all-topics');
                    if (sectionTopic) {
                        const checkboxesTopic = sectionTopic.querySelectorAll('input[type=checkbox]:checked');
                        if (checkboxesTopic) {
                            [].forEach.call(checkboxesTopic, (function (topic) {
                                additionnalFilters += '&' + topic.name + '=' + topic.value;
                            }));
                        }
                    }
                    statusMessage = LOCALE_FO.search.wait_result;
                    delay(function () {
                        fetch(data_autocompleteurl + '?BEAN_AUTO_COMPLETION=' + data_bean + '&BEANKEY_AUTO_COMPLETION=' + data_beankey + '&query=' + query + '&l=' + langue + additionnalFilters)
                            .then(function (response) {
                                response.json().then(function (data) {
                                    const arraySuggestion = [];
                                    [].forEach.call(data.suggestions, (function (suggestion) {
                                        arraySuggestion.push(suggestion.value);
                                    }));
                                    populateResults(arraySuggestion);
                                    statusMessage = LOCALE_FO.search.no_result;
                                });
                            });
                    }, 400);
                },
                name: 'q',
                placeholder: LOCALE_FO.search.search_by_keyword,
                displayMenu: 'overlay',
                minLength: 3,
                tStatusNoResults: function () {
                    return LOCALE_FO.search.no_result;
                },
                tNoResults: function () {
                    return LOCALE_FO.search.no_result;
                },
                tStatusQueryTooShort: function () {
                    return LOCALE_FO.search.query_too_short;
                },
                tStatusSelectedOption: function () {
                    return LOCALE_FO.search.selected_option;
                },
                tAssistiveHint: function () {
                    return LOCALE_FO.search.assistive_hint;
                }
            });
        }
        responsiveSearchCriteria(form);
        onTopicListsItemChange(form);
        launchFormSearchAfterItemSelected(form);
        aggregationUpdate(form);
        attachEvent(form);
        createToggleTopics(form);
        watchViewportSize(form);
    };
    if (forms) {
        [].forEach.call(forms, function (form) {
            initFunction(form);
        });
    }
})();