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
LOCALE_BO = {
    supprimer : "${BO_SUPPRIMER}",
    ajouter: "${BO_AJOUTER}",
    valider: "${BO_VALIDER}",
    archiver : "${BO_FICHE_ARCHIVER}",
    consulter : "${BO_CONSULTER}",
    modifier : "${BO_MODIFIER}",
    nouvelleFenetre : "${BO_NOUVELLE_FENETRE}",
    selectionner : "${BO_SELECTIONNER}",
    confirmer : "${JTF_BOUTON_CONFIRMER}",
    fermer : "${JTF_NON}",
    erreur : "${ST_ERREUR}",
    ok : "${JTF_OUI}",
    confirmQuitterPage : "${BO_CONFIRM_QUITTER_PAGE}",
    confirmSupprFiche : "${BO_CONFIRM_SUPPR_FICHE}",
    selectionnerUnELement : "${BO_SELECTIONNER_ELEMENT}",
    confirmSupprFiches : "${BO_CONFIRM_SUPPR_FICHES}",
    confirmSupprUtilisateur : "${BO_CONFIRM_SUPPR_UTILISATEUR}",
    confirmSupprUtilisateurs : "${BO_CONFIRM_SUPPR_UTILISATEURS}",
    confirmSupprRubrique : "${BO_CONFIRM_SUPPR_RUBRIQUE}",
    confirmArchFiches : "${BO_CONFIRM_ARCH_FICHES}",
    lExtension : "${BO_L_EXTENSION}",
    leModule : "${BO_LE_MODULE}",
    patienter : "${BO_PATIENTER}",
    voirEnLigne : "${BO_VOIR_EN_LIGNE}",
    actions : "${BO_ACTIONS}",
    erreurRecherche : "${ERREUR_DATAGRID}",
    erreurActionMasse : "${ERREUR_ACTION_MASSE}",
    confirmationActionMasseSuppr : "${CONFIRMATION_ACTION_MASSE_SUPPRESSION}",
    confirmationActionMasseArchi : "${CONFIRMATION_ACTION_MASSE_ARCHIVAGE}",
    confirmationActionMasseUtilisateur : "${CONFIRMATION_ACTION_MASSE_UTILISATEUR}",
    activer : "${BO_ACTIVER}",
    desactiver : "${BO_DESACTIVER}",
    captchaError : "${ST_CAPTCHA_ERROR}",

    // Etats
    enCoursSuppression : "${BO_EN_COURS_SUPPRESSION}",
    enCoursRechargement : "${BO_EN_COURS_RECHARGEMENT}",
    enSuccesSuppression : "${BO_EN_SUCCES_SUPPRESSION}",
    enErreurSuppression : "${BO_EN_ERREUR_SUPPRESSION}",
    enCoursdActivation : "${BO_EN_COURS_ACTIVATION}",
    enSuccesActivation : "${BO_EN_SUCCES_ACTIVATION}",
    enErreurActivation : "${BO_EN_ERREUR_ACTIVATION}",
    enCoursdeDesactivation : "${BO_EN_COURS_DESACTIVATION}",
    enSuccesDesactivation : "${BO_EN_SUCCES_DESACTIVATION}",
    enErreurDesactivation : "${BO_EN_ERREUR_DESACTIVATION}",
    enSuccesRechargement: "${BO_EN_SUCCES_RECHARGEMENT}",
    enErreurRechargement: "${BO_EN_ERREUR_RECHARGEMENT}",
    enSucces: "${BO_SUCCES}",
    enErreur: "${BO_ERREUR}",

    // Validations
    validationMessages : {
        ksupDate : "${BO_VALIDATION_KSUP_DATE}",
        ksupPhone : "${BO_VALIDATION_KSUP_PHONE}",
        pwdVerdicts: ["${BO_VALIDATION_PWD_WEAK}","${BO_VALIDATION_PWD_NORMAL}","${BO_VALIDATION_PWD_MEDIUM}","${BO_VALIDATION_PWD_STRONG}","${BO_VALIDATION_PWD_VERYSTRONG}"],
        pwdErrorMessages: {
            password_too_short: "${BO_VALIDATION_PWD_TOOSHORT}",
            email_as_password: "${BO_VALIDATION_PWD_EMAIL}",
            same_as_username: "${BO_VALIDATION_PWD_USERNAME}",
            two_character_classes: "${BO_VALIDATION_PWD_CHARACTER_CLASSES}",
            repeated_character: "${BO_VALIDATION_PWD_REPEATED_CHARACTER}",
            sequence_found: "${BO_VALIDATION_PWD_SEQUENCE}"
        }
    },

    // Services
    services : {
        arbre: {
            indisponible : "${BO_SERVICES_ARBRE_INDISPONIBLE}",
            confirmerSuppression : "${BO_SERVICES_ARBRE_CONFIRMERSUPPRESSION}"
        },
        auto_complete: {
            search : "${BO_SERVICES_AUTO_COMPLETE_SEARCH}",
            noresult: "${BO_SERVICES_AUTO_COMPLETE_NORESULT}"
        }
    },

    // Popins
    popin: {
        title:{
            generique: "${BO_POPIN_TITLE_GENERIQUE}",
            structure: {
                mono: "${BO_POPIN_TITLE_STRUCTURE_MONO}",
                multi: "${BO_POPIN_TITLE_STRUCTURE_MULTI}"
            },
            rubrique: {
                mono: "${BO_POPIN_TITLE_RUBRIQUE_MONO}",
                multi: "${BO_POPIN_TITLE_RUBRIQUE_MULTI}"
            },
            groupe: {
                mono: "${BO_POPIN_TITLE_GROUPE_MONO}",
                multi: "${BO_POPIN_TITLE_GROUPE_MULTI}"
            },
            utilisateur: "${BO_POPIN_TITLE_UTILISATEUR}",
            objet : "${BO_POPIN_TITLE_OBJET}",
            pagelibre: "${BO_POPIN_TITLE_PAGELIBRE}",
            photo : "${BO_POPIN_TITLE_PHOTO}",
            fichier : "${BO_POPIN_TITLE_FICHIER}"
        }
    },

    //Médias
    media : {
        player:{
            mute : "${BO_MEDIA_PLAYER_MUTE}",
            playPause : "${BO_MEDIA_PLAYER_PLAYPAUSE}",
            fullscreen: "${BO_MEDIA_PLAYER_FULLSCREEN}",
            tracks: "${BO_MEDIA_PLAYER_TRACKS}",
            postRoll: "${BO_MEDIA_PLAYER_POSTROLL}"
        }
    },

    // saisie front
    kselect: {
        mono: {
            select: "${KSELECT.MONO.SELECT}",
            clear: "${KSELECT.MONO.CLEAR}"
        },
        multi: {
            parentLabel: "${KSELECT.MULTI.PARENT_LABEL}",
            compositionLabel: "${KSELECT.MULTI.COMPOSITION_LABEL}"
        }
    },

    libelle: {
        inconnu: "${LIBELLE.INCONNU}"
    },

    // CKEditor
    ckeditor: {
        anchor: {
            alert: "${CKEDITOR.ANCHOR.ALERT}"
        },
        notifications: {
            spellcheker: "${CKEDITOR.NOTIFICATIONS.SPELLCHECKER_MESSAGE}"
        },
        plugins: {
            listeFiche: {
                title: "${CKEDITOR.PLUGINS.LISTEFICHE.TITLE}",
                insert: "${CKEDITOR.PLUGINS.LISTEFICHE.INSERT}"
            },
            link: {
                title: "${CKEDITOR.PLUGINS.KLINK.TITLE}",
                anchor: {
                    tip: {
                        alert: "${LINK_TYPE.ANCHOR.TIP_ALERT}"
                    }
                }
            },
            kflipbook: {
                title: "${CKEDITOR.PLUGINS.KFLIPBOOK.TITLE}",
                menu: "${CKEDITOR.PLUGINS.KFLIPBOOK.MENU}"
            },
            kimage: {
                title: "${CKEDITOR.PLUGINS.KIMAGE.TITLE}",
                menu: "${CKEDITOR.PLUGINS.KIMAGE.MENU}"
            },
            kvideo: {
                title: "${CKEDITOR.PLUGINS.KVIDEO.TITLE}",
                menu: "${CKEDITOR.PLUGINS.KVIDEO.MENU}"
            },
            kaudio: {
                title: "${CKEDITOR.PLUGINS.KAUDIO.TITLE}",
                menu: "${CKEDITOR.PLUGINS.KAUDIO.MENU}"
            },
            kflash: {
                title: "${CKEDITOR.PLUGINS.KFLASH.TITLE}",
                menu: "${CKEDITOR.PLUGINS.KFLASH.MENU}"
            },
            kpdfviewer: {
                title: "${CKEDITOR.PLUGINS.KPDFVIEWER.TITLE}",
                menu: "${CKEDITOR.PLUGINS.KPDFVIEWER.MENU}"
            },
            ktag: {
                title: "${CKEDITOR.PLUGINS.KTAG.TITLE}",
                menu: "${CKEDITOR.PLUGINS.KTAG.MENU}"
            }
        }
    }
};

LOCALE_FO = {
    // Popins
    popin:{
        title:{
            dossier:{
                mono:"${FO_POPIN_TITLE_DOSSIER_MONO}"
            }
        }
    },
    // Galerie
    galerie:{
        controls: {
            next : "${FO_GALERIE_CONTROL_NEXT}",
            previous : "${FO_GALERIE_CONTROL_PREVIOUS}",
            close : "${FO_GALERIE_CONTROL_CLOSE}"
        },
        display: {
            counter : "${FO_GALERIE_DISPLAY_COUNTER}",
            loading: "${FO_GALERIE_DISPLAY_LOADING}",
            errorIFrame : "${FO_GALERIE_DISPLAY_ERROR_IFRAME}",
            errorImage : "${FO_GALERIE_DISPLAY_ERROR_IMAGE}",
            errorFormatInconnu : "${FO_GALERIE_DISPLAY_ERROR_FORMAT}"
        }
    },
    // Menu
    menu:{
        retour : "${FO_MENU_RETOUR}"
    },
    search:{
        search_by_keyword: "${SEARCH_PAR_MOTS_CLES_JS}",
        no_result: "${SEARCH_AUCUN_RESULTAT_JS}",
        wait_result: "${SEARCH_WAIT_RESULT}",
        query_too_short: "${SEARCH_QUERY_TOO_SHORT}",
        selected_option: "${SEARCH_SELECTED_OPTION}",
        assistive_hint: "${SEARCH_ASSISTIVE_HINT}"
    },
    tooltip:{
        char_remaining: "${TOOLTIP.CARACTERE_RESTANT}"
    }
};
