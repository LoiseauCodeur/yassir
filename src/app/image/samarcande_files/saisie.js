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
(function($) {
    'use strict';

    var agendaDateDebut = $('#AGENDA_DTSTART');
    agendaDateDebut.on('change',function() {
        $('#AGENDA_DATE_COURANTE').val(!agendaDateDebut.val());
    }).triggerHandler('change');

    var heureDebut = $('#AGENDAEVT_HEURE_DEBUT');
    var heureFin = $('#AGENDAEVT_HEURE_FIN');
    heureDebut.on('change', function () {
        if (!heureDebut.val()) {
            heureFin.attr('disabled', 'disabled');
            heureFin.val('');
        } else {
            heureFin.removeAttr('disabled');
        }
    }).triggerHandler('change');

    $('#jour_entier').on('change',function() {
        if ($(this).is(':checked')) {
            heureDebut.attr('disabled','disabled');
            heureDebut.val('');
            heureFin.attr('disabled','disabled');
            heureFin.val('');
        } else {
            heureDebut.removeAttr('disabled');
            heureFin.removeAttr('disabled');
        }
        $('#AGENDAEVT_JOUR_ENTIER').val($(this).is(':checked'));
    }).triggerHandler('change');

    var repeterSemaine = $('#repeter_le');
    var repeterMois = $('#repeter_chaque');
    var repeterToutLes  = $('#AGENDAEVT_REPETER');
    var repeterComplement = $('<span id="complement_repeter"></span>');
    repeterToutLes.parent().append(repeterComplement);
    $('#AGENDAEVT_RECURRENT').on('change',function() {
        var valeur = $(this).val();
        if (valeur === '0000') {
            $('#AGENDAEVT_OCCURRENCE').attr('disabled','disabled');
            $('#AGENDAEVT_RECURRENCE_DATE_FIN').attr('disabled','disabled');
            repeterToutLes.attr('disabled','disabled');
        } else {
            $('#AGENDAEVT_OCCURRENCE').removeAttr('disabled');
            $('#AGENDAEVT_RECURRENCE_DATE_FIN').removeAttr('disabled');
            repeterToutLes.removeAttr('disabled');
        }
        if (valeur === '_2SEMAINE') {
            repeterSemaine.removeClass('masquer');
            repeterMois.addClass('masquer');
            repeterComplement.html('semaine(s)');
        } else if (valeur === '_3MOIS') {
            repeterMois.removeClass('masquer');
            repeterSemaine.addClass('masquer');
            repeterComplement.html('mois');
        } else {
            repeterMois.addClass('masquer');
            repeterSemaine.addClass('masquer');
            repeterComplement.html('jour(s)');
        }
        var libelle = $(this).find(':selected').text();
        var mots = libelle.split(' ');
        if (mots.length > 1) {
            repeterComplement.html(mots[mots.length - 1]);
        } else {
            repeterComplement.html('');
        }
    }).triggerHandler('change');

    $('input[name="AGENDAEVT_RECURRENCE_FIN"]').on('change',function() {
        $('#AGENDAEVT_OCCURRENCE').attr('readOnly',!$('#radio_occurence').is(':checked'));
        $('#AGENDAEVT_RECURRENCE_DATE_FIN').attr('readOnly',$('#radio_occurence').is(':checked'));
    }).triggerHandler('change');
    if (!heureDebut.val()) {
        heureFin.attr('disabled', 'disabled');
    }
})(jQuery);