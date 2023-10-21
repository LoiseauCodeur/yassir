/*
 * Copyright (C) 2015 - 2018 Kosmos contact@kosmos.fr
 *
 * Projet: panier
 * Version: 1.07.04
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
     * Callback appelée après ajout d'un item dans un panier
     */
    var callbackAjout = function (httpRequest, typePanier, panierWrapper) {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            var response = JSON.parse(httpRequest.responseText);
            if (httpRequest.status === 200) {
                if (response.updateQuantite) {
                    updateQuantite(response.typePanier, response.idPanier, response.quantite, response.nbItem);
                } else {
                    updateAjouter(panierWrapper, response.typePanier, response.idPanier, response.titre, response.urlFiche, response.nbItem, response.quantified);
                }
            } else {
                updateErreur(response.codeRetour, httpRequest.status, response.msgRetour, typePanier);
            }
        }
    };

    /**
     * Callback appelée après suppression d'un item dans un panier
     */
    var callbackSuppression = function (httpRequest, typePanier, panierWrapper) {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            var response = JSON.parse(httpRequest.responseText);
            if (httpRequest.status === 200) {
                if (response.updateQuantite) {
                    updateQuantite(response.typePanier, response.idPanier, response.quantite, response.nbItem);
                } else {
                    updateSupprimer(panierWrapper, response.typePanier, response.idPanier, response.nbItem, response.quantified);
                }
            } else {
                updateErreur(response.codeRetour, httpRequest.status, response.msgRetour, typePanier);
            }
        }
    };

    /**
     * Callback appellée après le renommage d'un item dans un panier
     */
    var callbackRenommage = function (httpRequest, typePanier, panierWrapper) {
        if (httpRequest.readyState === XMLHttpRequest.DONE) {
            var response = JSON.parse(httpRequest.responseText);
            if (httpRequest.status === 200) {
                updateTitreFiche(panierWrapper, response.typePanier, response.idPanier, response.titre);
            } else {
                updateErreur(response.codeRetour, httpRequest.status, response.msgRetour, typePanier);
            }
        }
    };

    function initDragDropOnly(panierWrapper){
        var listeBoutonsSuppprPanier = panierWrapper.querySelectorAll('.js-supprimer_panier');
        if (listeBoutonsSuppprPanier) {
            initDragAndDrop(panierWrapper);
        }
    }

    [].forEach.call(document.querySelectorAll('.js-panier-wrapper'), function (panierWrapper) {
        if (isTagAjout(panierWrapper)) {
            var ajoutPanier = panierWrapper.querySelector('.js-ajout_panier');
            var supprPanierFiche = panierWrapper.querySelector('.js-suppression_panier');
            if (ajoutPanier && supprPanierFiche) {
                initBouton(panierWrapper);
                initModaleTitrePanier(panierWrapper, false);
                initModaleSuppressionFichePanier(panierWrapper);
                // Ajout des listeners sur les boutons d'ajout et de suppression
                ajoutPanier.addEventListener('click', function () {
                    if (isModaleActivee(panierWrapper)) {
                        modalePanierShow(panierWrapper, null, panierWrapper.dataset.titrefiche);
                    } else {
                        initActionAjouter(panierWrapper, panierWrapper.dataset.titrefiche);
                    }
                });
                supprPanierFiche.addEventListener('click', function (event) {
                    if(isModaleActivee(panierWrapper)) {
                        modalePanierSuppressionShow(panierWrapper, event.target.dataset.idfichepanier);
                    } else {
                        initActionSupprimer(panierWrapper, event.target.dataset.idfichepanier);
                    }
                });
            }
        } else if (isTagContenu(panierWrapper)) {
            var renommePanier = panierWrapper.querySelectorAll('.panier__item-renommer');
            var listeBoutonsSuppprPanier = panierWrapper.querySelectorAll('.js-supprimer_panier');
            if (isModaleActivee(panierWrapper)) {
                initModaleTitrePanier(panierWrapper, true);
                [].forEach.call(renommePanier, function (item) {
                    item.addEventListener('click', function (event) {
                        if (isFicheActive(event.target)) {
                            modalePanierShow(panierWrapper, event.target.dataset.idfiche, event.target.dataset.titreitem);
                        }
                    });
                });
            }
            if (listeBoutonsSuppprPanier) {
                initModaleSuppressionFichePanier(panierWrapper);
                [].forEach.call(listeBoutonsSuppprPanier, function (item) {
                    item.addEventListener('click', function (event) {
                        if (isModaleActivee(panierWrapper)) {
                            modalePanierSuppressionShow(panierWrapper, event.target.dataset.idfichepanier);
                        } else {
                            initActionSupprimer(panierWrapper, event.target.dataset.idfichepanier);
                        }
                    });
                });
            }
            if (isDragAndDropActive(panierWrapper) && listeBoutonsSuppprPanier) {
                initDragAndDrop(panierWrapper);
            }
        }
    });

    /**
     * Effectue une action ajax sur un panier
     */
    function ajaxActionPanier(panierWrapper, urlAction, params, callback, typePanier) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', urlAction, true);
        httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        httpRequest.onreadystatechange = function () {
            if (callback) {
                callback(httpRequest, typePanier, panierWrapper);
            }
        };
        httpRequest.send(params);
    }

    /**
     * Initialise le tri des fiches d'un panier par drag and drop et par flèche (monter / descendre)
     */
    function initDragAndDrop(panierWrapper) {
        var itemSelected, itemDragged, itemFocused;
        var panierZone = panierWrapper.querySelector('.panier-vue');
        // Initialise les évènements pour chaque item dans le panier
        [].forEach.call(panierWrapper.querySelectorAll('.recap_panier > .panier_item'), function (item) {
            // Initialise les évènements de drag and drop
            item.addEventListener('dragend', function () {
                swap(itemSelected, itemDragged);
                initActionChangerOrdre(panierWrapper);
            });
            item.addEventListener('dragstart', function () {
                selectItem(item);
                itemSelected = item;
            });
            item.addEventListener('dragover', function () {
                itemDragged = item;
                if (itemDragged.id !== itemSelected.id) {
                    swap(itemSelected, itemDragged);
                }
            });
            // Initialise l'évènement de sélection d'un item
            item.querySelector('.js-panier__item_selectionable').addEventListener('click', function () {
                selectItem(item);
            });
        });
        // Initialise un évènement de clic en dehors du panier pour déselectionner les items sélectionnés.
        document.addEventListener('click', function (event) {
            var targetElement = event.target;
            while (targetElement) {
                if (targetElement === panierZone) {
                    return;
                }
                targetElement = targetElement.parentNode;
            }
            resetFocus(null);
        });


        /**
         * Sélectionne un item
         */
        function selectItem(itemToFocus) {
            resetFocus(itemFocused);
            itemFocused = itemToFocus;
            itemFocused.classList.toggle('panier_item_focused', true);
        }

        /**
         * Échange deux items dans la vue liste panier
         */
        function swap(item1, item2) {
            var parent = item1.parentNode;
            var temp = document.createElement('div');
            parent.insertBefore(temp, item1);
            parent.insertBefore(item1, item2);
            parent.insertBefore(item2, temp);
            parent.removeChild(temp);
        }

        /**
         * Remet à zéro le focus sur un item
         */
        function resetFocus(listItem) {
            if (listItem) {
                // Déselectionne un item particulier
                listItem.classList.toggle('panier_item_focused', false);
            } else {
                // Déselectionne tous les items du panier
                [].forEach.call(panierWrapper.querySelectorAll('.recap_panier > .panier_item'), function (item) {
                    item.classList.toggle('panier_item_focused', false);
                });
            }
            itemSelected = null;
        }
    }

    /**
     * Initialise l'affichage des boutons d'ajout et de suppression d'une modale
     */
    function initBouton(panierWrapper) {
        var isFicheDansPanier = JSON.parse(panierWrapper.getAttribute('data-fiche-panier'));
        var divBoutonAjouter = panierWrapper.querySelector('.js-boutons-panier .js-bouton-ajouter');
        var divBoutonSupprimer = panierWrapper.querySelector('.js-boutons-panier .js-bouton-supprimer');
        divBoutonAjouter.classList.toggle('hide', isFicheDansPanier);
        divBoutonSupprimer.classList.toggle('hide', !isFicheDansPanier);
    }

    /**
     * Initialise une modale pour la modification du titre des fiches de paniers
     */
    function initModaleTitrePanier(panierWrapper, modification) {
        if (isModaleActivee(panierWrapper)) {
            var modale = panierWrapper.querySelector('.panier-modale');
            var modaleClose = modale.querySelector('.panier-modale__header__close');
            var modaleAnnuler = modale.querySelector('.panier-modale__body__action-annuler');
            var modaleAjouter = modale.querySelector('.panier-modale__body__action-ajouter');
            modaleClose.addEventListener('click', function () {
                modalePanierHide(panierWrapper);
            });
            modaleAnnuler.addEventListener('click', function () {
                modalePanierHide(panierWrapper);
            });
            if (modification) {
                modaleAjouter.addEventListener('click', function () {
                    initActionRenommer(panierWrapper, modale.dataset.idfiche, modale.querySelector('.panier-modale__body__input-titre').value);
                    modalePanierHide(panierWrapper);
                });
            } else {
                modaleAjouter.addEventListener('click', function () {
                    initActionAjouter(panierWrapper, modale.querySelector('.panier-modale__body__input-titre').value);
                    modalePanierHide(panierWrapper);
                });
            }
        }
    }

    /**
     * Initialise une modale pour la confirmation de suppression d'une fiche dans un panier
     */
    function initModaleSuppressionFichePanier(panierWrapper) {
        if (isModaleActivee(panierWrapper)) {
            var modale = panierWrapper.querySelector('.panier-modale_suppression');
            var modaleClose = modale.querySelector('.panier-modale__header__close');
            var modaleNon = modale.querySelector('.panier-modale__body__action-non');
            var modaleOui = modale.querySelector('.panier-modale__body__action-oui');
            modaleClose.addEventListener('click', function () {
                modalePanierSuppressionHide(panierWrapper);
            });
            modaleNon.addEventListener('click', function () {
                modalePanierSuppressionHide(panierWrapper);
            });
            modaleOui.addEventListener('click', function () {
                initActionSupprimer(panierWrapper, modale.dataset.idfiche);
                modalePanierSuppressionHide(panierWrapper);
            });
        }
    }

    /**
     * Initialise l'action d'ajout d'une fiche à un panier
     */
    function initActionAjouter(panierWrapper, titreFiche) {
        var typePanier = panierWrapper.dataset.type;
        var idMeta = panierWrapper.dataset.idmeta;
        var urlControlerPanier = panierWrapper.dataset.url;
        var urlControlerPanierAjouter = panierWrapper.dataset.add;
        var params = 'EXT=panier&type=' + typePanier + '&idMeta=' + idMeta + '&titreFiche=' + titreFiche;
        ajaxActionPanier(panierWrapper, urlControlerPanier + urlControlerPanierAjouter, params, callbackAjout, typePanier);
    }

    /**
     * Initialise l'action d'ajout d'une fiche à un panier
     */
    function initActionSupprimer(panierWrapper, idFichePanier) {
        var typePanier = panierWrapper.dataset.type;
        var urlControlerPanier = panierWrapper.dataset.url;
        var urlControlerPanierSupprimer = panierWrapper.dataset.delete;
        var params = 'EXT=panier&type=' + typePanier + '&idFiche=' + idFichePanier;
        ajaxActionPanier(panierWrapper, urlControlerPanier + urlControlerPanierSupprimer, params, callbackSuppression, typePanier);
    }

    /**
     * Initialise l'action de renommage d'une fiche dans un panier
     */
    function initActionRenommer(panierWrapper, idFiche, titreFiche) {
        var typePanier = panierWrapper.dataset.type;
        var urlControlerPanier = panierWrapper.dataset.url;
        var urlControlerPanierRenommer = panierWrapper.dataset.renommer;
        var params = 'EXT=panier&type=' + typePanier + '&idFiche=' + idFiche + '&titreFiche=' + titreFiche;
        ajaxActionPanier(panierWrapper, urlControlerPanier + urlControlerPanierRenommer, params, callbackRenommage, typePanier);
    }

    /**
     * Initialise l'action de changement d'ordre des fiches du panier
     */
    function initActionChangerOrdre(panierWrapper) {
        var typePanier = panierWrapper.dataset.type;
        var urlControlerPanier = panierWrapper.dataset.url;
        var urlControlerPanierChangerOrdre = panierWrapper.dataset.changerordre;
        var paramsOrdre = '';
        var index = 0;
        [].forEach.call(panierWrapper.querySelectorAll('.panier_item'), function(item) {
            paramsOrdre += '&fichesOrdonnees[' + index + ']=' + parseInt(item.id, 10);
            index++;
        });
        var params = 'EXT=panier&type=' + typePanier + paramsOrdre;
        ajaxActionPanier(panierWrapper, urlControlerPanier + urlControlerPanierChangerOrdre, params, null, typePanier);
    }

    /**
     * Affiche ou masque le message "Liste vide"
     */
    function displayMsgListeVide(typePanier, bDisplay) {
        var p = document.getElementById('liste_vide_' + typePanier);
        if (p) {
            p.style.display = (bDisplay ? 'block' : 'none');
        }
    }

    /**
     * Met à jour la taille du panier
     */
    function updateTaillePanier(typePanier, nbItems) {
        var span = document.getElementById('taille_panier_' + typePanier);
        if (span) {
            span.innerHTML = '(' + nbItems + ')';
        }
    }

    /**
     * Ajouter un item à la liste
     */
    function updateAjouter(panierWrapper, typePanier, idFichePanier, titreFichePanier, urlFiche, nbItems, quantified) {
        if (!quantified) {
            var divBoutonAjouter = panierWrapper.querySelector('.js-boutons-panier .js-bouton-ajouter');
            var divBoutonSupprimer = panierWrapper.querySelector('.js-boutons-panier .js-bouton-supprimer');
            divBoutonAjouter.classList.add('hide');
            divBoutonSupprimer.classList.remove('hide');
            divBoutonSupprimer.querySelector('.js-suppression_panier').setAttribute('data-idfichepanier', idFichePanier);
        }
        $( "#liste_fiches_panier_FAVORIS" ).load(window.location.href +" #liste_fiches_panier_FAVORIS", function(e){
            let panierFavoris = document.querySelector(".js-panier-wrapper-vue");
            initDragDropOnly(panierFavoris);
        });
    }

    /**
     * Mettre à jour la quantité pour un item existant (augmenter ou diminuer)
     */
    function updateQuantite(typePanier, idFichePanier, quantite, nbItems) {
        /********* VUE ENCADRE */
        // on met à jour la taille du panier
        updateTaillePanier(typePanier, nbItems);
        // on met a jour la quantité dans l'encadré
        var spanQte = document.getElementById('qte_' + idFichePanier);
        if (spanQte) {
            spanQte.innerHTML = ' (' + quantite + ')';
        }
        /********* VUE DETAIL */
            // on met a jour la quantité dans la vue détaillée
        var spanQteDetail = document.getElementById('qte_detail_' + idFichePanier);
        if (spanQteDetail) {
            spanQteDetail.innerHTML = quantite;
        }
    }

    /**
     * Met à jour le titre d'un item du panier
     */
    function updateTitreFiche(panierWrapper, typePanier, idFichePanier, titre) {
        var itemTitre = panierWrapper.querySelector('.panier_item[id="' + idFichePanier + '"] > .js-panier__item_selectionable a');
        itemTitre.innerText = titre;
    }

    /**
     * Supprimer un item de la liste
     */
    function updateSupprimer(panierWrapper, typePanier, idFichePanier, nbItems, quantified) {
        if (!quantified) {
            var divBoutonAjouter = panierWrapper.querySelector('.js-boutons-panier .js-bouton-ajouter');
            var divBoutonSupprimer = panierWrapper.querySelector('.js-boutons-panier .js-bouton-supprimer');
            if (divBoutonAjouter && divBoutonSupprimer) {
                divBoutonAjouter.classList.remove('hide');
                divBoutonSupprimer.classList.add('hide');
                divBoutonSupprimer.querySelector('.js-suppression_panier').removeAttribute('data-idfichepanier');
            }
        }
        $( "#liste_fiches_panier_FAVORIS" ).load(window.location.href +" #liste_fiches_panier_FAVORIS",() => {
            let panierFavoris = document.querySelector(".js-panier-wrapper-vue");
            initDragDropOnly(panierFavoris);
            /** Dû à l'initialisation automatique (cf FrontLien#initApps), nous devons mettre à jour les boutons "ajouter" ou "supprimer" des applications lorsqu'il y a initialisation automatique. */
            let allItemsPanierUtilisateur = Array.from(panierFavoris.querySelectorAll(".panier_item"));
            let allMetaIdsUtilisateur = [];
            /* Récupération de tous les ids métatags des fiches mis dans le panier */
            allItemsPanierUtilisateur.forEach(element => {
                allMetaIdsUtilisateur.push(element.getAttribute("data-meta-id"));
            });
            /* On boucle sur tous les éléments du panier */
            let allItems = document.querySelectorAll(".js-panier-wrapper");
            allItems.forEach(jsPanierWrapper => {
                let idMetatagItem = jsPanierWrapper.getAttribute("data-idmeta");
                if (idMetatagItem) {
                    let presentDansPanier = allMetaIdsUtilisateur.includes(idMetatagItem);
                    jsPanierWrapper.setAttribute('data-fiche-panier', presentDansPanier.toString());
                    let itemCorrespondant = allItemsPanierUtilisateur.filter(el => el.getAttribute("data-meta-id") === idMetatagItem);
                    if (itemCorrespondant.length > 0) {
                        jsPanierWrapper.querySelector(".js-suppression_panier").setAttribute("data-idfichepanier", itemCorrespondant[0].id);
                    }
                    initBouton(jsPanierWrapper);
                }
            });
        });
    }

    /**
     * Gérer les messages d'erreur
     */
    function updateErreur(codeErreur, statusHttp, msgErreur, typePanier) {
        console.error('[' + typePanier + '] Erreur (' + codeErreur + '/' + statusHttp + ') : ' + msgErreur);
    }

    /**
     * Gère l'ouverture d'une modale d'ajout d'une fiche dans un panier
     */
    function modalePanierShow(panierWrapper, idFiche, titre) {
        if (isModaleActivee(panierWrapper)) {
            // S'assure qu'aucune autre modale de panier n'est affichée
            [].forEach.call(document.querySelectorAll('.panier-modale'), function (modale) {
                modale.classList.toggle('hide', true);
            });
            [].forEach.call(document.querySelectorAll('.panier-modale_suppression'), function (modale) {
                modale.classList.toggle('hide', true);
            });
            // Active la modale
            var modaleCourante = panierWrapper.querySelector('.panier-modale');
            modaleCourante.querySelector('.panier-modale__body__input-titre').value = titre;
            modaleCourante.dataset.idfiche = idFiche;
            modaleCourante.classList.toggle('hide', false);
        }
    }

    /**
     * Gère la fermeture d'une modale d'ajout d'une fiche dans un panier
     */
    function modalePanierHide(panierWrapper) {
        if (isModaleActivee(panierWrapper)) {
            panierWrapper.querySelector('.panier-modale').classList.toggle('hide', true);
        }
    }

    /**
     * Gère l'ouverture d'une modale de confirmation de suppression d'une fiche dans un panier
     */
    function modalePanierSuppressionShow(panierWrapper, idFiche) {
        if (isModaleActivee(panierWrapper)) {
            // S'assure qu'aucune autre modale de panier n'est affichée
            [].forEach.call(document.querySelectorAll('.panier-modale'), function (modale) {
                modale.classList.toggle('hide', true);
            });
            [].forEach.call(document.querySelectorAll('.panier-modale_suppression'), function (modale) {
                modale.classList.toggle('hide', true);
            });
            // Active la modale
            var modaleCourante = panierWrapper.querySelector('.panier-modale_suppression');
            modaleCourante.dataset.idfiche = idFiche;
            modaleCourante.classList.toggle('hide', false);
        }
    }

    /**
     * Gère la fermeture d'une modale de confirmation de suppression
     */
    function modalePanierSuppressionHide(panierWrapper) {
        if (isModaleActivee(panierWrapper)) {
            panierWrapper.querySelector('.panier-modale_suppression').classList.toggle('hide', true);
        }
    }

    /**
     * Détermine si une modale est activée
     */
    function isModaleActivee(panierWrapper) {
        return panierWrapper.dataset.modale.toLocaleLowerCase() === 'true';
    }

    /**
     * Détermine si le drag'n drop est activé
     */
    function isDragAndDropActive(panierWrapper) {
        return true;
    }

    /**
     * Indique si l'écran actuel est issu du tag vue d'affichage du panier
     */
    function isTagContenu(panierWrapper) {
        return panierWrapper.dataset.tagtype.toLocaleLowerCase() === 'contenu';
    }

    /**
     * Indique si l'écran actuel est issu du tag d'ajout d'une fiche dans un panier
     */
    function isTagAjout(panierWrapper) {
        return panierWrapper.dataset.tagtype.toLocaleLowerCase() === 'ajout';
    }

    /**
     * Indique si la fiche passée en paramètre est toujours active
     */
    function isFicheActive(element) {
        return element.parentNode.dataset.active.toLocaleLowerCase() === 'true';
    }
})();

