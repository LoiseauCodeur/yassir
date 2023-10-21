/*
 * Copyright (C) 2015 - 2018 Kosmos contact@kosmos.fr
 *
 * Projet: webapp
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
var field1 = "";
var field2 = "";
var fieldRequete = "";
var texte = "";
var nomApplet = "";
var nomForm = "";
var pageTete = false;
//AM200501 : parcours LMD
var ajoutAuto = "", modifAuto = "";

// JSS 20020612-001 Type d'insertion (liste)
var typeInsertion = "";

/* ouverture d'une fenêtre centrée */
function ouvrirPhoto(urlPhoto, largeur, hauteur) {
    x = (screen.availWidth - largeur) / 2;
    y = (screen.availHeight - 30 - hauteur) / 2;
    attrs = "height=" + hauteur + ", width=" + largeur + ", left=" + x + ", top=" + y;
    if (y < 0) {
        attrs += ",scrollbars=yes"
    }
    fenetre = window.open(urlPhoto, 'photo', attrs);
}

/* Demande d'affichage d'une fenetre au niveau du front office */
function ouvrirFenetrePlan(url, nom) {
    window.open(url, nom, "width=520,height=500,scrollbars=yes, status=yes, resizable=1");
}

/* Affichage de la phototheque */
function showPhototheque(action) {
    window.open('/servlet/com.jsbsoft.jtf.core.SG?PROC=SAISIE_MEDIA&ACTION=' + action, 'photo', 'width=650,height=535,top=20,left=100,scrollbars=yes, status=yes,resizable=yes');
}

function showMessageField(typeAide, f1, f2) {
    showMessageField2(typeAide, f1, f2, '');
}

/* Demande d'affichage d'une fenetre par un champ */
function showMessageField2(typeAide, f1, f2, form) {
    nomForm = form;
    field1 = f1;
    field2 = f2;
    fieldRequete = '';
    texte = '';
    nomApplet = '';
    // Type d'insertion (liste)
    typeInsertion = '';

    var oForm;
    if (inBackOffice()) {
        oForm = document.forms[0];
    }
    else {
        if (form.length > 0)
            oForm = document.forms[form];
        if (!oForm) {
            oForm = (document.forms['form_saisie_front']) ? document.forms['form_saisie_front'] : document.forms['recherche_avancee'];
            nomForm = oForm.id;
        }
    }
    var value = oForm.elements[f1].value;
    if (!value)
        value = "";

    //AM 200309 : L'arbre des structures doit prendre en compte la langue courante dans le front office
    if (typeAide.indexOf('structure') != -1) {

        var indexSlash1 = typeAide.indexOf('/');
        var lg = '';
        var filtre = '';
        if (indexSlash1 != -1) {
            var indexSlash2 = typeAide.indexOf('/', indexSlash1 + 1);
            if (indexSlash2 != -1) {
                lg = typeAide.substring(indexSlash1 + 1, indexSlash2);
                filtre = typeAide.substring(indexSlash2 + 1);
            }
            else {
                lg = typeAide.substring(indexSlash1 + 1);
            }
        }
        sList = window.open('/adminsite/menu/menu.jsp?MODE=STRUCTURE&CODE=' + value + '&LANGUE=' + lg + '&FILTRE=' + filtre, 'menu2', 'scrollbars=yes, resizable=yes, status=yes, width=600, height=400, top=320, left=320');
    }

    //JSS 20040419 : affichage arbre structure en fonction du perimetre (back-office)
    else if (typeAide.indexOf('strbo/') != -1) {

        // formatte comme suit strbo/type/objet/action/langue
        var indexSlash1 = typeAide.indexOf('/');
        var indexSlash2 = typeAide.indexOf('/', indexSlash1 + 1);
        var indexSlash3 = typeAide.indexOf('/', indexSlash2 + 1);
        var indexSlash4 = typeAide.indexOf('/', indexSlash3 + 1);
        var indexSlash5 = typeAide.indexOf('/', indexSlash4 + 1);

        var permission = typeAide.substring(indexSlash1 + 1, indexSlash4);
        var lg = typeAide.substring(indexSlash4 + 1, indexSlash5);
        var filtre = typeAide.substring(indexSlash5 + 1, typeAide.length);

        sList = window.open('/adminsite/menu/menu.jsp?MODE=STRUCTURE&CODE=' + value + '&PERMISSION=' + permission + '&LANGUE=' + lg + '&FILTRE=' + filtre, 'menu2', 'scrollbars=yes, resizable=yes, status=yes, width=600, height=400, top=320, left=320');
    }

    //FBI 20051110 : affichage arbre structure en front (filtre sur les structures non visibles)
    else if (typeAide.indexOf('strfo') != -1) {

        //typeAide du type strfo/lg ou strfo/lg/filtre ou strfo/lg/filtre/racine
        var elem = typeAide.split('/');
        lg = '';
        filtre = '';
        racine = '';
        if (elem[1])
            lg = elem[1];
        if (elem[2])
            filtre = elem[2];
        if (elem[3])
            racine = elem[3];

        sList = window.open('/adminsite/menu/menu.jsp?MODE=STRUCTURE&CODE=' + value + '&LANGUE=' + lg + '&FILTRE=' + filtre + '&FRONT=true&RACINE=' + racine, 'menu2', 'scrollbars=yes, resizable=yes, status=yes, width=600, height=400, top=320, left=320');
    }

    else if (typeAide == 'rubrique' || typeAide.indexOf('rubrique') != -1) {
        var lg = '';
        var racine = '';
        if (typeAide != 'rubrique') {
            var indexSlash = typeAide.indexOf('/');
            if (indexSlash != -1) { //typeAide du type rubrique/racine ou rubriquelangue/racine
                racine = typeAide.substring(indexSlash + 1, typeAide.length);
                lg = typeAide.substring(typeAide.indexOf('rubrique') + 8, indexSlash);
            }
            else { //typeAide du type rubriquelangue
                lg = typeAide.substring(typeAide.indexOf('rubrique') + 8, typeAide.length);
            }
        }
        sList = window.open('/adminsite/menu/menu.jsp?MODE=RUBRIQUE&CODE=' + value + '&LANGUE=' + lg + '&RACINE=' + racine, 'menu2', 'scrollbars=yes, resizable=yes, status=yes, width=600, height=400, top=320, left=320');
    }

    //JSS 20040419 : affichage arbre rubrique en fonction du perimetre (back-office)
    else if (typeAide.indexOf('rubbo/') != -1) {
        // formatte comme suit rubbo/type/objet/action

        var indexSlash1 = typeAide.indexOf('/');
        var indexSlash2 = typeAide.indexOf('/', indexSlash1 + 1);
        var indexSlash3 = typeAide.indexOf('/', indexSlash2 + 1);
        var indexSlash4 = typeAide.indexOf('/', indexSlash3 + 1);

        var permission = '';
        var racine = '';
        if (indexSlash3 != -1) { //typeAide du type rubbo/FICHE/OO15/C/racine
            permission = typeAide.substring(indexSlash1 + 1, indexSlash4);
            racine = typeAide.substring(indexSlash4 + 1, typeAide.length);
        }
        else if (indexSlash2 != -1) { //typeAide du type rubbo//racine
            permission = typeAide.substring(indexSlash1 + 1, indexSlash2);
            racine = typeAide.substring(indexSlash2 + 1, typeAide.length);
        }
        else {
            permission = typeAide.substring(indexSlash1 + 1, typeAide.length);
        }

        sList = window.open('/adminsite/menu/menu.jsp?MODE=RUBRIQUE&CODE=' + value + '&PERMISSION=' + permission + '&RACINE=' + racine, 'menu2', 'scrollbars=yes, resizable=yes, status=yes, width=600, height=400, top=320, left=320');
    }

    // JSS 20040419 : arbre des groupes
    else if (typeAide == 'groupe_dsi') {
        sList = window.open('/adminsite/menu/menu.jsp?MODE=GROUPE&CODE=' + value, 'menu2', 'scrollbars=yes, resizable=yes, status=yes, width=600, height=400, top=320, left=320');
    }

    //JSS 20040419 : affichage arbre groupe en fonction du perimetre (back-office)
    else if (typeAide.indexOf('groupebo/') != -1) {
        // formatte comme suit groupebo/type/objet/action

        var indexSlash1 = typeAide.indexOf('/');
        var indexSlash2 = typeAide.indexOf('/', indexSlash1 + 1);
        var indexSlash3 = typeAide.indexOf('/', indexSlash2 + 1);

        var permission = typeAide.substring(indexSlash1 + 1, typeAide.length);
        sList = window.open('/adminsite/menu/menu.jsp?MODE=GROUPE&CODE=' + value + '&PERMISSION=' + permission, 'menu2', 'scrollbars=yes, resizable=yes, status=yes, width=600, height=400, top=320, left=320');
    }

    else if (typeAide == 'public_vise_dsi') {
        sList = window.open('/adminsite/menu/menu.jsp?MODE=GROUPE&CODE=' + value + '&PUBLIC_VISE=1', 'menu2', 'scrollbars=yes, resizable=yes, status=yes, width=600, height=400, top=320, left=320');
    }

    // JSS 20040419 : arbre des groupes
    else if (typeAide.indexOf('publicbo/') != -1) {
        // formatte comme suit publicbo/type/objet/action

        var indexSlash1 = typeAide.indexOf('/');
        var indexSlash2 = typeAide.indexOf('/', indexSlash1 + 1);
        var indexSlash3 = typeAide.indexOf('/', indexSlash2 + 1);

        var permission = typeAide.substring(indexSlash1 + 1, typeAide.length);
        sList = window.open('/adminsite/menu/menu.jsp?MODE=GROUPE&CODE=' + value + '&PUBLIC_VISE=1&PERMISSION=' + permission, 'menu2', 'scrollbars=yes, resizable=yes, status=yes, width=600, height=400, top=320, left=320');
    }

    else if (typeAide.indexOf('fichefil') != -1) {
        var proc = typeAide.substring(typeAide.indexOf('fichefil') + 8, typeAide.length);
        sList = window.open("/servlet/com.jsbsoft.jtf.core.SG?PROC=" + proc + "&ACTION=RECHERCHER&TOOLBOX=LIEN_INTERNE_JOINTURE", "fichefil", "width=500,height=500,top=210,left=310,scrollbars=yes, resizable=yes, status=yes");
    }

    else if (typeAide == 'pagelibre') {
        sList = window.open("/servlet/com.jsbsoft.jtf.core.SG?PROC=SAISIE_PAGELIBRE&ACTION=RECHERCHER&TOOLBOX=LIEN_INTERNE_JOINTURE&LANGUE_FICHE=0", "pagelibre", "width=500,height=330,top=210,left=310, scrollbars=yes, resizable=yes, status=yes");
    }

    /* AM 200309 creation de page libre */
    else if (typeAide == ('pagelibre_creation')) {
        field2 = "LIBELLE_CODE_PAGE_TETE";
        sList = window.open("/servlet/com.jsbsoft.jtf.core.SG?PROC=TRAITEMENT_PAGELIBRE&ACTION=AJOUTER&LANGUE=0&CODE_RUBRIQUE=" + f2, "pagelibre_creation&TOOLBOX=TRUE", "width=500,height=330,top=210,left=310, scrollbars=yes, resizable=yes, status=yes");
    }

    else if (typeAide == 'utilisateur') {
        sList = window.open("/servlet/com.jsbsoft.jtf.core.SG?PROC=SAISIE_UTILISATEUR&ACTION=RECHERCHER&MODE=RECHERCHE&TOOLBOX=TRUE", "utilisateur", "width=550, height=500, top=210, left=290, scrollbars=yes, resizable=yes, status=yes");
    }

    else if (typeAide == 'pagetete') {
        sList = window.open("/adminsite/toolbox/choix_objet.jsp?TOOLBOX=PAGE_TETE", "list", "width=520,height=440,top=10,left=100, scrollbars=yes, resizable=yes, status=yes");
        pageTete = true;
    }

    else if (typeAide == 'commentaire') {
        sList = window.open("/adminsite/toolbox/choix_objet.jsp?TOOLBOX=COMMENTAIRE", "list", "width=500,height=330,top=100,left=100, scrollbars=yes, resizable=yes, status=yes");
        pageTete = true;
    }

    else if (typeAide == 'requete') {
        field1 = "";
        field2 = f2;
        nomForm = "";
        fieldRequete = f1;

        if (field2 == 'STATS') {
            field2 = "";
            sList = window.open("/adminsite/toolbox/choix_objet.jsp?TOOLBOX=LIEN_REQUETE&RESTRICTION=STATS", "list", "width=500,height=330,top=100,left=100,scrollbars=yes,status=yes");
        }
        else {
            field2 = "";
            sList = window.open("/adminsite/toolbox/choix_objet.jsp?TOOLBOX=LIEN_REQUETE&RESTRICTION=XML", "list", "width=500,height=330,top=100,left=100,scrollbars=yes,status=yes");
        }
    }
}

/* Demande d'affichage d'une fenetre par un champ en front */

function showMessageChamp(typeAide, f1, f2, nomFormulaire) {
    if (typeAide.indexOf('structure') != -1) {
        typeAide = 'strfo' + typeAide.substring(typeAide.indexOf('structure') + 9, typeAide.length);
    }
    showMessageField2(typeAide, f1, f2, nomFormulaire);
}


/* Ouvre la popup de recherche d'un objet */
function ouvrirFenetreRechercheParProcessus(extension, processus, f1, f2) {
    field1 = f1;
    field2 = f2;
    nomForm = "";
    fieldRequete = "";
    texte = "";
    nomApplet = "";
    typeInsertion = "";
    nomFenetre = "";
    if (processus.indexOf('&') != -1) {
        nomFenetre = processus.substring(0, processus.indexOf('&'));
    }
    sList = window.open("/servlet/com.jsbsoft.jtf.core.SG?EXT=" + extension + "&PROC=" + processus + "&ACTION=RECHERCHER&TOOLBOX=LIEN_INTERNE_JOINTURE&LANGUE_FICHE=-1", "RECHERCHE_" + nomFenetre, "width=500, height=500, top=150, left=150, scrollbars=yes, resizable=yes, status=yes");
}


/* Demande d'affichage d'une fenetre par un textarea */
function showMessageTextArea(typeAide, langue, toolboxName) {

    nomApplet = "";
    // JSS 20020612-001 Type d'insertion (liste)
    typeInsertion = "";
    texte = toolboxName;
    field1 = "";
    field2 = "";
    nomForm = "";
    fieldRequete = "";

    // JSS 20020612-001 Type d'insertion (liste)
    if (typeAide == 'liste') {
        sList = window.open("/adminsite/toolbox/choix_objet.jsp?TOOLBOX=LIEN_REQUETE&LISTE_INCLUSE=1", "list", "width=500,height=330,top=100,left=100,scrollbars=yes,status=yes");
        typeInsertion = "liste";
    }
    if (typeAide == 'lien')
        sList = window.open("/adminsite/toolbox/choix_lien.jsp?LANGUE_FICHE=" + langue, "list", "width=500,height=330,top=100,left=100,scrollbars=yes,status=yes");
    if (typeAide == 'mailto')
        sList = window.open("/adminsite/toolbox/mailto.jsp?LANGUE_FICHE=" + langue, "list", "width=500,height=330,top=100,left=100,scrollbars=yes,status=yes");
    if (typeAide == 'image')
        sList = window.open("/servlet/com.jsbsoft.jtf.core.SG?PROC=SAISIE_MEDIA&ACTION=INSERER&TYPE_RESSOURCE=PHOTO", "photo", "width=650,height=535,top=20,left=100,scrollbars=yes");
}


function inBackOffice() {
    for (i = 0; i < window.document.forms.length; i++) {
        if ((window.document.forms[i].id != '') && (window.document.forms[i].id == 'form_saisie_front' || window.document.forms[i].id == 'recherche_avancee' || window.document.forms[i].id == nomForm))
            return false;
    }
    return true;
}

/* Effacement du libelle d'un champ de recherche */
function effacerTextField(zoneSaisie, zoneLibelle, value, libelle) {

    if (inBackOffice()) {
        /* Cas de l'administration */
        eval("window.document.forms[0]." + zoneSaisie + ".value = value;");
        eval("window.document.forms[0]." + zoneLibelle + ".value = libelle;");
        eval("window.document.forms[0]." + zoneLibelle + ".title = '';");
    }
    else {
        oForm = window.document.forms[nomForm];
        if (!oForm)
            nomForm = ( window.document.forms['form_saisie_front']) ? 'form_saisie_front' : 'recherche_avancee';

        eval("window.document.forms['" + nomForm + "']." + zoneSaisie + ".value = value;");
        eval("window.document.forms['" + nomForm + "']." + zoneLibelle + ".value = libelle;");
        eval("window.document.forms['" + nomForm + "']." + zoneLibelle + ".title = '';");
    }
}

/* Effacement du libelle d'un champ de recherche */
function effacerTextChamp(zoneSaisie, zoneLibelle, value, libelle, nomForm) {
    eval("window.document.forms['" + nomForm + "']." + zoneSaisie + ".value = value;");
    eval("window.document.forms['" + nomForm + "']." + zoneLibelle + ".value = libelle;");
}


/* Renvoyer des valeurs a la fenetre fille */
function renvoyerValeurs(objet, code, libelle, sInfobulle) {
    if (window.opener && !window.opener.closed) {
        // cas d'une modification de lien
        if (window.opener.liendanskt) {
            window.opener.modifieLien(objet, code, libelle);
        }
        // cas d'un rattachement rubrique par exemple
        else if (window.opener.field1 != "" || window.opener.field2 != "" || window.opener.fieldRequete != "") {
            window.opener.saveField(objet, code, libelle, sInfobulle);
        }
        // cas d'un lien dans la toolbox
        else {
            window.opener.save(objet, code, libelle); // tag kportal dans la toolbox
        }
    } else {//lien de requete ou liste d'objets

        //CFL 20080618 : avant on appelait la methode save() dans toolbox_new.js
        //maintenant, on appelle la methode insertKListe(); du plugin k_liste de fckeditor
        //voir plus tard si on peut carrément éviter de passer par renvoyervaleurs. On garde pour le moment
        //par soucis de compatibilité avec les objets spécifiques
        //save(objet, code, libelle);
        if (typeof insertKListe_lienRequete == 'function') {//liste objets
            insertKListe_lienRequete(objet, code, libelle);
        } else {// lien de requete
            if (window.parent.insertKListe_lienRequete) {
                window.parent.insertKListe_lienRequete(objet, code, libelle);
            } else {
                window.iFrameHelperCallback = function () {
                    if (window.iFrameRegistration) {
                        iFrameHelper.sendValues(window.iFrameRegistration, {sCode: code, libelle: libelle, destroy: true});
                    }
                };
            }
        }
    }
    window.close();
}

/* Traitement des donnees resultats renvoyees par la fenetre mere */
function saveField(objet, code, libelle, sInfobulle) {

    /* Cas de l'administration */
    if (inBackOffice()) {
        if (!pageTete) {
            /* Cas de l'administration */
            if (field1 != "") {
                eval("window.document.forms[0]." + field1 + ".value = code;");

                // TODO 5.2 : virer ce truc pourri -> utile pour le moment pour ne pas casser la logique de l'ancienne version
                var $kMonoSelect = jQuery('#kMonoSelect' + field1);
                if ($kMonoSelect.length > 0) {
                    $kMonoSelect.data('code', code);
                } else {
                    eval("jQuery(window.document.forms[0]." + field1 + ")").data('libelle', libelle).change();
                }
            }
            if (field2 != "") {
                var oLabelField = window.document.forms[0].elements[field2];
                if (oLabelField) {
                    oLabelField.value = libelle;
                    oLabelField.title = (sInfobulle ? sInfobulle : libelle);
                } else {
                    var $kMonoSelect = jQuery('#kMonoSelect' + field1).kMonoSelect();
                    if ($kMonoSelect) $kMonoSelect.value(libelle, (sInfobulle ? sInfobulle : libelle));
                }
            }

            /*AM 200501: parcours LMD
             if (ajoutAuto != "") {
             eval("ajouter"+ajoutAuto+"();");
             ajoutAuto = "";
             }
             //AM 200501: parcours LMD
             if (modifAuto != "") {
             eval("validmodif"+modifAuto+"();");
             modifAuto = "";
             }*/
        }
        else {
            /* Cas d'une page de tete : on ajoute le type d'objet au code */
            if (field1 != "")
                eval("window.document.forms[0]." + field1 + ".value = code+',TYPE='+objet;");
            if (field2 != "")
                eval("window.document.forms[0]." + field2 + ".value = objet + ' : ' +libelle;");
        }
    }
    else {
        /* Cas particulier du front office */
        oForm = window.document.forms[nomForm];
        if (!oForm)
            nomForm = ( window.document.forms['form_saisie_front']) ? 'form_saisie_front' : 'recherche_avancee';

        if (field1 != "")
            eval("window.document.forms['" + nomForm + "']." + field1 + ".value = code;");
        if (field2 != "") {
            var oLabelField = window.document.forms[nomForm].elements[field2];
            oLabelField.value = libelle;
            /*if (sFilAriane)
             {
             oLabelField.title = sFilAriane;
             }*/
            oLabelField.title = (sInfobulle ? sInfobulle : libelle);
        }
    }

    if (fieldRequete != "") {
        chaine = "\"OBJET=" + objet;
        if (code.length > 0) {
            chaine = chaine + "&" + code;
        }
        chaine = chaine + "\"";

        eval("window.document.forms[0]." + fieldRequete + ".value = " + chaine);
    }

    field1 = "";
    field2 = "";

    nomForm = "";

    fieldRequete = "";

    texte = "";

    nomApplet = "";

    // JSS 20020612-001 Type d'insertion (liste)
    typeInsertion = "";
}

/* Renvoyer des valeurs a la fenetre fille */
function renvoyerImage(id, height, width, alt, border, hspace, vspace, align) {
    if (window.opener && !window.opener.closed) {
        renvoyerImagePopup(id, height, width, alt, border, hspace, vspace, align)
    }
    window.close();
}

function renvoyerFormulaire(code, style, element) {
    if (window.opener && !window.opener.closed && window.opener.nomApplet != "") {
        window.opener.saveFormulaire(code, style, element);
    } else {
        window.parent.saveFormulaire(code, style, element);
    }
    window.close();
}


function renvoyerPageLibre(code, titre, langue) {
    if (window.opener && !window.opener.closed)
        window.opener.savePageLibre(code, titre, langue);
    window.close();
}

function renvoyerDocument(id, titre, NOM_FICHIER_JOINT, POIDS_FICHIER_JOINT, FORMAT_FICHIER_JOINT, PATH_FICHIER_JOINT, NOMFORM) {
    if (window.opener && !window.opener.closed) {
        if (window.opener.liendanskt)
            window.opener.modifieLien("", id, "");
        else if (window.opener.nomApplet != "")
            window.opener.saveDocument(id, titre, NOM_FICHIER_JOINT, POIDS_FICHIER_JOINT, FORMAT_FICHIER_JOINT, PATH_FICHIER_JOINT, NOMFORM);
        else
            window.opener.saveFormDocument(id, titre, NOM_FICHIER_JOINT, POIDS_FICHIER_JOINT, FORMAT_FICHIER_JOINT, PATH_FICHIER_JOINT, NOMFORM);
    }
    window.close();
}

function saveFormDocument(id, titre, NOM_FICHIER_JOINT, POIDS_FICHIER_JOINT, FORMAT_FICHIER_JOINT, PATH_FICHIER_JOINT, NOMFORM) {
    var nomForm = '0';
    if (NOMFORM)
        nomForm = NOMFORM;

    if (field1 != "") {
        eval("window.document.forms['" + nomForm + "']." + field1 + ".value = id;");
        eval("window.document.forms['" + nomForm + "']." + field2 + ".value = titre;");
        eval("window.document.forms['" + nomForm + "'].NOM_" + field1 + ".value = NOM_FICHIER_JOINT;");
        eval("window.document.forms['" + nomForm + "'].POIDS_" + field1 + ".value = POIDS_FICHIER_JOINT;");
        eval("window.document.forms['" + nomForm + "'].FORMAT_" + field1 + ".value = FORMAT_FICHIER_JOINT;");
        eval("window.document.forms['" + nomForm + "'].PATH_" + field1 + ".value = PATH_FICHIER_JOINT;");
    }

    if (texte != "") {
        var codeHtml = '<a';

        codeHtml += " href=\"[id-document];" + id + "[/id-document]\" >";
        codeHtml += titre + "</a>";

        insererTexte(texte, codeHtml);
    }

    field1 = "";
    field2 = "";
    nomForm = "";
    fieldRequete = "";
    texte = "";
    nomApplet = "";
}


/* Ouverture d'une nouvelle fenetre fille */
function ouvrir_fen(url) {

    Xmas95 = new Date();
    secs = Xmas95.getSeconds();
    var name = "win" + secs;
    //EL 20051221 rajout resizable=yes pour IE :
    window.open(url, name, 'status=yes,toolbar=no,scrollbars=yes,width=600,height=550,resizable=yes');
}

function ouvrir_fen_web(url) {

    Xmas95 = new Date();
    secs = Xmas95.getSeconds();
    var name = "win" + secs;

    window.open(url, name, 'status=yes,menubar=yes, toolbar=yes, resizable=yes, scrollbars=yes, width=600, height=400');
}

function ouvrir_fen_x_y(url, x, y) {

    Xmas95 = new Date();
    secs = Xmas95.getSeconds();
    var name = "win" + secs;

    window.open(url, name, 'resizable=yes,status=yes,toolbar=no,scrollbars=yes,width=' + x + ',height=' + y);
}

function ouvrir_fen_w_h_name(url, width, height, name) {
    window.open(url, name, 'status=yes,toolbar=no,scrollbars=yes,width=' + width + ',height=' + height);
}


/* Nettoyage du code HTML avant de l'envoyer dans l'url */
function nettoyerCodeHTML(s) {

    /* Suppression des caracteres dont code > 255 : fait planter url
     (peuvent etre inseres par coller)
     */
    s2 = s;
    for (i = 0; i < s2.length; i++) {
        var charCode = s2.charCodeAt(i);
        if (charCode > 255) {

            // Traitement special pour caractere 8217
            if (charCode == 8217)
                s2 = s2.substring(0, i) + "'" + s2.substring(i + 1, s2.length);
            else if (charCode == 8364)
                s2 = s2.substring(0, i) + "&euro;" + s2.substring(i + 1, s2.length);
            else if (charCode == 8211)
                s2 = s2.substring(0, i) + "-" + s2.substring(i + 1, s2.length);
            else if (charCode == 8230)
                s2 = s2.substring(0, i) + "..." + s2.substring(i + 1, s2.length);
            else if (charCode == 339)
                s2 = s2.substring(0, i) + "&oelig;" + s2.substring(i + 1, s2.length);
            else
                s2 = s2.substring(0, i) + s2.substring(i + 1, s2.length);

            //JSS 20020923-001
            i = i - 1;
        }
    }
    if (s2 == '<p>&nbsp;</p>' || s2 == '<br />') {
        s2 = '';
    }
    return s2;
}

/* Gestion des fichiers joints */
var draggingRow;
var tbody;
var arrayFichierMulti = new Array();
var libelleFichierMulti = "";
var arrayFichierUnique = new Array();
var libelleFichierUnique = "";
var espace = "";
var indiceForm = "";
var maxFileSize = "";
var noMulti = "";

// constructeur de la classe
function Fichier(p1, p2, p3, p4, p5) {
    this.id = p1;
    this.nom = p2;
    this.format = p3;
    this.version = p4;
    this.date = p5;
}

// ajout d'un fichier
// appel du processus SAISIE_MEDIA
function ajouterFichier(no, mode, saisieFront, nomDonneeFichier, nomFormFichier) {
    var $ = jQuery,
        $this = $(this),
        rf = $('input[name="GRS_SAUVEGARDE_CODE_RUBRIQUE"]').val() || '';

    sTypeRessource = "";
    sModeParameter = "";
    if (saisieFront == null)
        saisieFront = '';

    if (mode == 'multi') {
        indice = $('input[name="NB_' + libelleFichierMulti + '_' + no + '"]').val();
        $('input[name="NO_' + libelleFichierMulti + '_' + no + '"]').val(indice);
        sTypeRessource = $('input[name="MODE_' + libelleFichierMulti + '_' + no + '"]').val();
        sModeParameter = "&MODE_FICHIER=MULTIPLE";
        noMulti = no;
    } else {
        sTypeRessource = $('input[name="MODE_' + libelleFichierUnique + '_' + no + '"]').val();
        sModeParameter = "&MODE_FICHIER=UNIQUE";
        indice = no;
    }
    if (maxFileSize != '')
        sModeParameter += "&MAX_FILE_SIZE=" + maxFileSize;

    var popin = $.iframePopin({
        title: LOCALE_BO.popin.title.fichier,
        url: "/servlet/com.jsbsoft.jtf.core.SG?PROC=SAISIE_MEDIA&FCK_PLUGIN=TRUE&TYPE_RESSOURCE=" + sTypeRessource + "&ACTION=SELECTIONNER" + saisieFront + sModeParameter + "&NO_FICHIER=" + indice + "&ESPACE=" + espace + "&RF=" + rf,
        autoOpen: true,
        resizable: false,
        width: 800,
        onClose: function ($iframe) {
            this.destroy();
        },
        buttons: {},
        onClose: function () {
            this.destroy();
        }
    });

    var registeredId = iFrameHelper.registeriFrame({
        onSendValues: function (file) {
            saveFormFichier(file.id, file.titre, file.format, file.legende, file.date_creation, file.num_fichier, file.mode_fichier, nomDonneeFichier, nomFormFichier);
            popin.destroy();
            iFrameHelper.unregisteriFrame(registeredId);
        },
        onAbort: function () {
            popin.destroy();
            iFrameHelper.unregisteriFrame(registeredId);
        },
        iFrame: popin.iFrame,
        caller: $this
    });
}

// suppression d'un fichier uniquement javascript
// traitement physique a la validation
function supprimerFichier(no, indice) {
    reponse = confirm("Supprimer définitivement le fichier?");
    if (reponse) {
        arrayFichierMulti[no][indice] = null;
        preparerFichier(no);
    }
}

// renvoi du fichier a la fin du processus TRAITEMENT_FICHIERGW_FRONT
function renvoyerFichier(ID_FICHIER_JOINT, NOM_FICHIER_JOINT, FORMAT_FICHIER_JOINT, VERSION_FICHIER_JOINT, DATE_FICHIER_JOINT, NO_FICHIER_JOINT, MODE, nomDonneeFichier, nomFormFichier) {
    window.opener.saveFormFichier(ID_FICHIER_JOINT, NOM_FICHIER_JOINT, FORMAT_FICHIER_JOINT, VERSION_FICHIER_JOINT, DATE_FICHIER_JOINT, NO_FICHIER_JOINT, MODE, nomDonneeFichier, nomFormFichier);
    window.close();
}

function saveFormFichier(ID_FICHIER_JOINT, NOM_FICHIER_JOINT, FORMAT_FICHIER_JOINT, VERSION_FICHIER_JOINT, DATE_FICHIER_JOINT, NO_FICHIER_JOINT, MODE, nomDonneeFichier, nomFormFichier) {
    var $ = jQuery,
        fic = new Fichier(ID_FICHIER_JOINT, NOM_FICHIER_JOINT, FORMAT_FICHIER_JOINT, VERSION_FICHIER_JOINT, DATE_FICHIER_JOINT);
    if (MODE.indexOf('UNIQUE') != -1) {
        arrayFichierUnique[NO_FICHIER_JOINT] = fic;
        preparerFichierUnique(NO_FICHIER_JOINT, nomDonneeFichier, nomFormFichier);
    } else {
        var $multi = $('input[name="NB_' + libelleFichierMulti + '_' + noMulti + '"]');
        if ($multi.length > 0) {
            $multi.val($.parseInteger($multi.val()) + 1);
        }
        arrayFichierMulti[noMulti][NO_FICHIER_JOINT] = fic;
        preparerFichier(noMulti);
    }
}

// preparation pre-validation
// concatenation du tableau de fichiers pour sauvegarde
function preparerFichier(no) {
    var $ = jQuery,
        temp = '',
        newtab = [];
    for (i = 0; i < arrayFichierMulti[no].length; i++) {
        if (arrayFichierMulti[no][i]) {
            newtab.push(arrayFichierMulti[no][i]);
            if (temp.length > 0) {
                temp += "|";
            }
            temp += arrayFichierMulti[no][i].id + ";" + arrayFichierMulti[no][i].nom + ";" + arrayFichierMulti[no][i].format + ";" + arrayFichierMulti[no][i].version + ";" + arrayFichierMulti[no][i].date;
        }
    }
    arrayFichierMulti[no] = newtab;
    $('input[name="TOTAL_' + libelleFichierMulti + '_' + no + '"]').val(temp);
    affichageFichier(no);
}

/**
 * Sélection de la ligne qui est déplacée.
 * @param target Elément sélectionné pour le déplacement
 * @returns L'élément tr
 */
function getTargetRow(target) {
    let elemName = target.tagName.toLowerCase();

    if(elemName === 'tr') {
        return target;
    } else {
        return target.closest('tr');
    }
}

/**
 * Identifie la ligne de tableau déplacée ainsi que le tableau.
 */
function setDraggingRow(){
    draggingRow = getTargetRow(event.currentTarget);
    tbody = draggingRow.parentNode;
}

/**
 * Déplacement d'une ligne dans le tableau.
 */
function dragOver(){
    const e = event;
    e.preventDefault();
    let row = getTargetRow(e.currentTarget);
    let rows = draggingRow.parentNode.querySelectorAll('tr');

    const children= Array.from(rows);
    swapRow(row, children.indexOf(row));
}

/**
 * Inverse la postition dans le tableau de la ligne déplacée avec la ligne précédente/suivante.
 * @param row Ligne déplacée
 * @param index Position de la ligne dans le tableau
 */
function swapRow(row, index) {
    let currIndex = Array.from(draggingRow.parentNode.children).indexOf(draggingRow),
        row1 = currIndex > index ? draggingRow : row,
        row2 = currIndex > index ? row : draggingRow;
    tbody.insertBefore(row1, row2);
}

/**
 * Déplace la ligne du tableau sélectionnée vers le haut.
 * @param no Indice du tableau
 */
function moveRowUp(no) {
    setDraggingRow();
    const rows = draggingRow.parentNode.querySelectorAll('tr');
    const rowIndex = Array.from(rows).indexOf(draggingRow);
    tbody.insertBefore(draggingRow, rows[rowIndex-1]);
    updateFilesOrder(no);
}

/**
 * Déplace la ligne du tableau sélectionnée vers le bas.
 * @param no Indice du tableau
 */
function moveRowDown(no) {
    setDraggingRow();
    const rows = draggingRow.parentNode.querySelectorAll('tr');
    const rowIndex = Array.from(rows).indexOf(draggingRow);
    tbody.insertBefore(rows[rowIndex+1], draggingRow);
    updateFilesOrder(no);
}

/**
 * Met à jour le tableau de fichiers en reprenant l'ordre d'affichage visuel.
 * @param no Indice du tableau
 */
function updateFilesOrder(no) {
    var div = document.getElementById('inner-fichier-' + no);
    var newOrder = new Array();
    var rows = div.getElementsByTagName('tr');
    for (var i = 0; i < rows.length;i++) {
        newOrder.push(arrayFichierMulti[no][rows[i].dataset.indice]);
    }
    arrayFichierMulti[no] = newOrder;
    preparerFichier(no);
}

/**
 * Affiche la liste des fichiers pour un champ d'upload.
 * @param no Numéro du champs d'upload
 */
function affichageFichier(no) {

    var temp = '';
    var tableau = document.getElementById('inner-fichier-' + no);

    for (let i = 0; i < arrayFichierMulti[no].length; i++) {
        if (arrayFichierMulti[no][i]) {
            temp += "<tr data-indice=\"" + i + "\" draggable='true'>";
            temp += "<td style=\"width:20px;\">";
            if (i > 0) {
                temp += "<img class=\"moveRowUp\" src=\"/adminsite/images/fhaut.gif\" border=\"0\" style=\"cursor:pointer;\"/>";
            }
            temp += "</td>";
            temp += "<td style=\"width:20px;\">";
            if (i < arrayFichierMulti[no].length - 1) {
                temp += "<img class=\"moveRowDown\" src=\"/adminsite/images/fbas.gif\" border=\"0\" style=\"cursor:pointer;\" />";
            }
            temp += "</td>";
            temp += "<td><input type=\"text\" class=\"libelle-fichier\" readonly=\"readonly\" name=\"LIBELLE_FICHIER_JOINT_" + i + "\" size=\"30\" value=\"" + arrayFichierMulti[no][i].nom + "\" />";
            temp += " <input type=\"text\" class=\"format-fichier\" readonly=\"readonly\" name=\"FORMAT_FICHIER_JOINT_" + i + "\" size=\"10\" value=\"" + arrayFichierMulti[no][i].format + "\" />";
            temp += " <input type=\"text\" class=\"date-fichier\" readonly=\"readonly\" name=\"DATE_FICHIER_JOINT_" + i + "\" size=\"6\" value=\"" + arrayFichierMulti[no][i].date + "\" />";
            temp += " <input type=\"button\" class=\"reset\" value=\"Supprimer\" onclick=\"supprimerFichier('" + no + "','" + i + "');\" /></td>";
            if (arrayFichierMulti[no].length > 1) {
                temp += "<td><span class=\"js-icon-drag-drop drag-handle\">☰</span></td>";
            }
            temp += "</tr>";
        }
    }
    tableau.innerHTML = temp.toString();
    noMulti = "";
    tableau.querySelectorAll('tr').forEach(function(t){
        t.addEventListener('dragstart', setDraggingRow);
        t.addEventListener('dragover', dragOver);
        t.addEventListener('dragend',() => {updateFilesOrder(no);});
    });
    tableau.querySelectorAll('.moveRowUp').forEach(e =>  e.addEventListener('click', () => {moveRowUp(no)}));
    tableau.querySelectorAll('.moveRowDown').forEach(e => e.addEventListener('click', () => {moveRowDown(no)}));
}

// preparation pre-validation
// concatenation du fichier joint
function preparerFichierUnique(indice, nomDonneeFichier, nomFormFichier) {
    if (arrayFichierUnique[indice]) {
        fic = arrayFichierUnique[indice];
        temp = fic.id + ";" + fic.nom + ";" + fic.format + ";" + fic.version + ";" + fic.date;
        zoneFichier = (nomDonneeFichier ? nomDonneeFichier : libelleFichierUnique) + '_' + indice;
        zoneLibelle = 'LIBELLE_' + (nomDonneeFichier ? nomDonneeFichier : libelleFichierUnique) + '_' + indice;
        temp = temp.replace(/&apos;/g, "'");
        temp = temp.replace(/&quot;/g, "\\\"");
        nom = fic.nom.replace(/&apos;/g, "'");
        nom = nom.replace(/&quot;/g, "\\\"");
        eval("window.document.forms[(nomFormFichier ? nomFormFichier : indiceForm)]." + zoneFichier + ".value = \"" + temp + "\";");
        eval("window.document.forms[(nomFormFichier ? nomFormFichier : indiceForm)]." + zoneLibelle + ".value = \"" + nom + "\";");
    }

}

// specifique fichier unique ex:logo espace collaboratif
// attention l'index du formulaire est variable selon les page
function effacerFichier(indice) {

    if (arrayFichierUnique[indice]) {
        arrayFichierUnique[indice] = null;
        zoneFichier = libelleFichierUnique + '_' + indice;
        zoneLibelle = 'LIBELLE_' + libelleFichierUnique + '_' + indice;
        eval("window.document.forms[indiceForm]." + zoneFichier + ".value = '';");
        eval("window.document.forms[indiceForm]." + zoneLibelle + ".value = 'Cliquer sur parcourir';");
    }
}

/* Gestion de la palette des couleurs */

function popup_color_picker(nom1, nom2) {
    titreCouleur = nom1;
    titreExemple = nom2;
    var width = 400;
    var height = 260;
    window.open('/adminsite/utils/colpick/color_picker.jsp?COULEUR=' + titreCouleur + '&EXEMPLE=' + titreExemple + '&FORM=' + indiceForm + '', 'cp', 'resizable=no, location=no, width=' + width + ', height=' + height + ', menubar=no, status=yes, scrollbars=no, menubar=no');
}

function effacerCouleur(nom1, nom2) {
    window.document.forms[indiceForm].elements[nom2].style.borderColor = '';
    window.document.forms[indiceForm].elements[nom2].style.backgroundColor = '';
    window.document.forms[indiceForm].elements[nom1].value = '';
}

function replaceAll(str, search, repl) {
    while (str.indexOf(search) != -1)
        str = str.replace(search, repl);
    return str;
}


/* =============================================== */
/*   METHODES DE GESTION DES LISTES MULTIVALUEES   */
/* =============================================== */

var INPUT_FIELD = 0;
var COMBO_BOX = 1;
var ZONE_FIELD = 2;

function MultivalueFieldItem(sCode, sLabel, sTitle) {
    this.sCode = sCode;
    if (sLabel == '') {
        this.sLabel = sCode;
    }
    else {
        this.sLabel = sLabel;
    }
    this.sTitle = sTitle;
    this.toString = function () {
        var s = 'sCode = ' + this.sCode;
        s += ', sLabel = ' + this.sLabel;
        if (this.sTitle) {
            s += ', sTitle = ' + this.sTitle;
        }
        return s;
    }
}

function MultivalueField(oForm, sName, iTypeField) {
    //this.oForm = oForm;
    // verrue kdecole pour liste en front
    this.oForm = window.document.forms['form_saisie_front'] ? window.document.forms['form_saisie_front'] : oForm;
    this.sName = sName;
    this.iTypeField = iTypeField;
    this.aItemList = new Array();
    this.iSelectedItem = -1;

    // Initialise le champ de saisie multiple
    this.Init = function () {
        this.oCodesHiddenField = this.oForm.elements[sName];                 // champ caché contenant la liste des codes
        this.oLabelsHiddenField = this.oForm.elements['LIBELLE_' + sName];   // champ caché contenant la liste des libellés
        this.oTitlesHiddenField = this.oForm.elements['INFOBULLE_' + sName]; // champ caché contenant la liste des infobulles
        this.oField = this.oForm.elements['TMP_' + sName];                   // champ de saisie (input, combo, ou zone)
        if (this.iTypeField == ZONE_FIELD) {
            this.oLabelField = this.oForm.elements['LIBELLE_TMP_' + sName];  // champ contenant le libellé pour un champ zone
        }
        this.oSelect = this.oForm.elements['SELECT_' + sName];               // champ select multiple contenant les différentes valeurs
        this.LoadData(); // charge le contenu de la liste multivaluée
        if (this.aItemList.length > 0) {
            this.iSelectedItem = 0;
        }
        this.UpdateDisplay();
    }

    // Teste si l'élément est présent dans la liste
    this.ContainsItem = function (oItem) {
        // parcourt la liste
        var inList = false;
        for (var i = 0; i < this.aItemList.length; i++) {
            if (oItem.sCode == this.aItemList[i].sCode) {
                inList = true;
            }
        }
        return inList;
    }

    // Ajoute éventuellement un nouvel élément à la liste
    this.Add = function () {
        // lit la saisie ou l'élément sélectionné (suivant le type de champ)
        var sCode = ''; // TODO
        var sLabel = '';
        var sTitle;
        if (this.iTypeField == INPUT_FIELD) // champ de saisie
        {
            sCode = this.oField.value;
        }
        else if (this.iTypeField == COMBO_BOX) // combo box
        {
            if (this.oField.selectedIndex > 0) // on n'est pas sur le premier élément (code != '0000')
            {
                sCode = this.oField.value;
                sLabel = this.oField.options[this.oField.selectedIndex].text;
                if (sLabel.charAt(0) == '-') {
                    sCode = '';
                }
                sTitle = sLabel;
            }
        }
        else if (this.iTypeField == ZONE_FIELD) // zone de saisie
        {
            sCode = this.oField.value;
            sLabel = this.oLabelField.value;
            sTitle = this.oLabelField.title;
        }
        if (sCode != '') // si il y a qqch à ajouter
        {
            var oItem = new MultivalueFieldItem(sCode, sLabel, sTitle);
            //alert(oItem);
            if (!this.ContainsItem(oItem)) // si l'élément n'est pas dans la liste
            {
                // ajoute l'élément à la fin de la liste
                this.aItemList[this.aItemList.length] = oItem;
                // sélectionne l'élément ajouté
                this.iSelectedItem = this.aItemList.length - 1;
                // met à jour l'affichage
                this.UpdateDisplay();
                // met à jour le champ caché
                this.SaveData();
                // réinitialise le champ de saisie
                if (this.iTypeField == INPUT_FIELD) // champ de saisie
                {
                    this.oField.value = '';
                }
                else if (this.iTypeField == COMBO_BOX) // combo box
                {
                    this.oField.selectedIndex = 0;
                }
                /*else if (this.iTypeField == ZONE_FIELD) // zone de saisie
                 {
                 effacerTextField('TMP_' + this.sName, 'LIBELLE_TMP_' + this.sName, '', 'Cliquer sur parcourir');
                 }*/
            }
            else {
                alert('Cette valeur a déjà été insérée.');
            }
        }
    }

    // Supprime l'élément sélectionné
    this.Remove = function () {
        if (this.aItemList.length > 0) // la liste n'est pas vide
        {
            if (this.iSelectedItem != -1) // un élément est sélectionné
            {
                // décale les éléments suivants
                for (var i = this.iSelectedItem; i < this.aItemList.length - 1; i++) {
                    this.aItemList[i] = this.aItemList[i + 1];
                }
                // supprime le dernier élément en double
                //this.aItemList[this.aItemList.length-1] = null;
                this.aItemList.length--;
                // met à jour la sélection
                if (this.iSelectedItem == this.aItemList.length) {
                    this.iSelectedItem--;
                }
                // met à jour l'affichage
                this.UpdateDisplay();
                // met à jour le champ caché
                this.SaveData();
            }
            else {
                alert('Sélectionnez la valeur à supprimer.');
            }
        }
    }

    // Modifie l'élément sélectionné ( !!!! spécifique pour chaque type d'élément)
    this.Modify = function () {
        if (this.aItemList.length > 0) // la liste n'est pas vide
        {
            if (this.iSelectedItem != -1) // un élément est sélectionné
            {
                specificModifyItem(this);
            }
            else {
                alert('Sélectionnez la valeur à modifier.');
            }
        }
    }

    // Met à jour l'élément sélectionné ( !!!! spécifique pour chaque type d'élément)
    this.UpdateItem = function (item) {
        if (this.aItemList.length > 0) // la liste n'est pas vide
        {
            if (this.iSelectedItem != -1) // un élément est sélectionné
            {
                // met à jour l'élément selectionné
                this.aItemList[this.iSelectedItem] = item;
                // met à jour l'affichage
                this.UpdateDisplay();
                // met à jour le champ caché
                this.SaveData();
            }
            else {
                alert('Sélectionnez la valeur à modifier.');
            }
        }
    }

    // Remonte l'élément sélectionné
    this.MoveUp = function () {
        if (this.aItemList.length > 1 && // la liste contient plusieurs éléments,
            this.iSelectedItem != -1 &&  // un des éléments est sélectionné,
            this.iSelectedItem > 0)      // ce n'est pas le premier élément de la liste
        {
            // intervertit l'élément avec son précédent
            var oItemTmp = this.aItemList[this.iSelectedItem];
            this.aItemList[this.iSelectedItem] = this.aItemList[this.iSelectedItem - 1];
            this.aItemList[this.iSelectedItem - 1] = oItemTmp;
            // met à jour la sélection
            this.iSelectedItem--;
            // met à jour l'affichage
            this.UpdateDisplay();
            // met à jour le champ caché
            this.SaveData();
        }
    }

    // Descend l'élément sélectionné
    this.MoveDown = function () {
        if (this.aItemList.length > 1 &&                    // la liste contient plusieurs éléments,
            this.iSelectedItem != -1 &&                     // un des éléments est sélectionné,
            this.iSelectedItem < this.aItemList.length - 1) // ce n'est pas le dernier élément de la liste
        {
            // intervertit l'élément avec son suivant
            var oItemTmp = this.aItemList[this.iSelectedItem];
            this.aItemList[this.iSelectedItem] = this.aItemList[this.iSelectedItem + 1];
            this.aItemList[this.iSelectedItem + 1] = oItemTmp;
            // met à jour la sélection
            this.iSelectedItem++;
            // met à jour l'affichage
            this.UpdateDisplay();
            // met à jour le champ caché
            this.SaveData();
        }
    }

    // Sélectionne un élément (à associer au onclick sur un élément)
    this.SelectItem = function () {
        if (this.aItemList.length == 0) {
            this.iSelectedItem = -1;
        }
        else {
            this.iSelectedItem = this.oSelect.selectedIndex;
        }
    }

    // Met à jour l'affichage HTML
    this.UpdateDisplay = function () {
        this.oSelect.options.length = 0;
        if (this.aItemList.length == 0) {
            this.oSelect.options[0] = new Option('--', -1);
            this.oSelect.selectedIndex = 0;
        }
        else {
            var oItem;
            for (var i = 0; i < this.aItemList.length; i++) {
                oItem = this.aItemList[i];
                this.oSelect.options[i] = new Option(oItem.sLabel);
                if (oItem.sTitle) {
                    this.oSelect.options[i].title = oItem.sTitle;
                }
            }
            this.oSelect.selectedIndex = this.iSelectedItem;
        }
    }

    // Charge le contenu existant du champ
    this.LoadData = function () {
        if (this.oCodesHiddenField && this.oLabelsHiddenField) {
            var aCodes = this.oCodesHiddenField.value.split(';');
            var aLabels = this.oLabelsHiddenField.value.split(';');
            var aTitles;
            if (this.oTitlesHiddenField) {
                aTitles = this.oTitlesHiddenField.value.split(';');
            }
            for (var i = 0; i < aCodes.length; i++) {
                if (aCodes[i] != '' && aCodes[i] != '0000') {
                    if (aTitles) {
                        oItem = new MultivalueFieldItem(aCodes[i], aLabels[i], aTitles[i]);
                    }
                    else {
                        oItem = new MultivalueFieldItem(aCodes[i], aLabels[i]);
                    }
                    //alert(oItem);
                    if (!this.ContainsItem(oItem)) // si l'élément n'est pas dans la liste
                    {
                        // ajoute l'élément à la fin de la liste
                        this.aItemList[this.aItemList.length] = oItem;
                    }
                }
            }
        }
    }

    // Sauve le contenu existant du champ
    this.SaveData = function () {
        this.oCodesHiddenField.value = '';
        this.oLabelsHiddenField.value = '';
        if (this.oTitlesHiddenField) {
            this.oTitlesHiddenField.value = '';
        }
        var oItem;
        for (var i = 0; i < this.aItemList.length; i++) {
            oItem = this.aItemList[i];
            if (i > 0) {
                this.oCodesHiddenField.value += ';';
                this.oLabelsHiddenField.value += ';';
                if (this.oTitlesHiddenField) {
                    this.oTitlesHiddenField.value += ';';
                }
            }
            this.oCodesHiddenField.value += oItem.sCode;
            this.oLabelsHiddenField.value += oItem.sLabel;
            if (this.oTitlesHiddenField) {
                this.oTitlesHiddenField.value += oItem.sTitle;
            }
        }
    }

}

/* ============================================= */
/*   METHODES DE GESTION DES OBJETS TECHNIQUES   */
/* ============================================= */

function soumettreAjoutSousObjet(nomObjet) {
    nettoyerDonnees();
    window.document.forms[0].ACTION.value = 'NOCTRL_AJOUTER_' + nomObjet;
    window.document.forms[0].submit();
}
function soumettreModificationSousObjet(nomObjet, indice) {
    nettoyerDonnees();
    window.document.forms[0].ACTION.value = 'NOCTRL_MODIFIER_' + nomObjet + '#' + indice;
    window.document.forms[0].submit();
}
function soumettreSuppressionSousObjet(nomObjet, indice) {
    nettoyerDonnees();
    window.document.forms[0].ACTION.value = 'NOCTRL_SUPPRIMER_' + nomObjet + '#' + indice;
    window.document.forms[0].submit();
}
function soumettreValidationSousObjet(nomObjet) {
    nettoyerDonnees();
    window.document.forms[0].ACTION.value = 'VALIDER_' + nomObjet;
    window.document.forms[0].submit();
}
function soumettreAnnulationSousObjet(nomObjet) {
    nettoyerDonnees();
    window.document.forms[0].ACTION.value = 'NOCTRL_ANNULER_' + nomObjet;
    window.document.forms[0].submit();
}

function loadFckEditor() {
    /* CFL 20080616 : HYPER IMPORTANT POUR CHARGEMENT MULTIPLES FCKEDITOR SUR UNE MEME PAGE
     *          RESOUD LE PROBLEME DE CHARGEMENT INFINI (bug fck avec firefox...)
     if (document.getElementsByName('FCK_EDITORS_NAMES')[0]) {
     var editorsNames = document.getElementsByName('FCK_EDITORS_NAMES')[0].value.split(";");
     for (i=0;i<editorsNames.length;i++) {
     if (editorsNames[i].length>0) {
     try{
     var editorName = editorsNames[i].substring(0,editorsNames[i].indexOf("_FCK"));
     eval("oFCKeditor"+editorName+".Create();");
     }catch(err){}
     }
     }
     }*/
}

/* fonction fade loading sur submit
 nécessite prototype et scriptcaculous */
function loading(input, idbody, idloader, submit) {
    //    new Effect.Opacity(idbody, { from: 1, to: 0.7 });
    input.style.display = 'none';
    window.document.getElementById(idloader).style.display = 'inline';
    if (submit)
        window.document.forms[0].submit();
    return true;
}

var formFileExtensions = {};

function checkFileExt(ctrl) {
    //retrieve our control
    var file = eval("window.document.forms[0]." + ctrl + "_FILE.value;");
    var extensions = eval("formFileExtensions['" + ctrl + "']");
    var allowSubmit = false;

    if (!extensions || file == "") {
        return true;
    }
    else if (file != "") {
        //get the file type
        type = file.slice(file.indexOf("\\") + 1);
        var ext = file.slice(file.lastIndexOf(".")).toLowerCase();
        //loop through our array of extensions
        for (var i = 0; i < extensions.length; i++) {
            //check to see if it's the proper extension
            if (extensions[i] == ext) {
                //it's the proper extension
                allowSubmit = true;
            }
        }
    }
    //now check the final bool value
    if (allowSubmit == false) {
        // let the user know they selected a wrong file extension
        alert("L'extension du fichier " + ctrl.toLowerCase() + " est non valide (" + (extensions.join(", ")) + ")");
        return false;
    }
    else {
        return true
    }
    return allowSubmit;
}

function melA(mail, subject, body, domaine) {
    url = "mailto:" + mail + "@" + domaine;
    if (subject != '') {
        url += "?subject=" + subject;
    }
    if (body != '') {
        if (subject != '') {
            url += "&";
        }
        else {
            url += "?";
        }
        url += "body=" + body;
    }
    window.location.href = url;
}
