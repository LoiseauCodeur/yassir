/* French initialisation for the jQuery UI date picker plugin. */
/* Written by Keith Wood (kbwood{at}iinet.com.au),
 Stéphane Nahmani (sholby@sholby.net),
 Stéphane Raimbault <stephane.raimbault@gmail.com> */
(function ($) {
    $.datepicker.regional['${DATEPICKER.REGIONAL}'] = {
        closeText: '${DATEPICKER.CLOSETEXT}',
        prevText: '${DATEPICKER.PREVTEXT}',
        nextText: '${DATEPICKER.NEXTTEXT}',
        currentText: '${DATEPICKER.CURRENTTEXT}',
        monthNames: ['${DATEPICKER.MONTHNAMES.JANVIER}',
            '${DATEPICKER.MONTHNAMES.FEVRIER}',
            '${DATEPICKER.MONTHNAMES.MARS}',
            '${DATEPICKER.MONTHNAMES.AVRIL}',
            '${DATEPICKER.MONTHNAMES.MAI}',
            '${DATEPICKER.MONTHNAMES.JUIN}',
            '${DATEPICKER.MONTHNAMES.JUILLET}',
            '${DATEPICKER.MONTHNAMES.AOUT}',
            '${DATEPICKER.MONTHNAMES.SEPTEMBRE}',
            '${DATEPICKER.MONTHNAMES.OCTOBRE}',
            '${DATEPICKER.MONTHNAMES.NOVEMBRE}',
            '${DATEPICKER.MONTHNAMES.DECEMBRE}'],
        monthNamesShort: ['${DATEPICKER.MONTHNAMESSHORT.JANV}',
            '${DATEPICKER.MONTHNAMESSHORT.FEVR}',
            '${DATEPICKER.MONTHNAMESSHORT.MARS}',
            '${DATEPICKER.MONTHNAMESSHORT.AVRIL}',
            '${DATEPICKER.MONTHNAMESSHORT.MAI}',
            '${DATEPICKER.MONTHNAMESSHORT.JUIN}',
            '${DATEPICKER.MONTHNAMESSHORT.JUIL}',
            '${DATEPICKER.MONTHNAMESSHORT.AOUT}',
            '${DATEPICKER.MONTHNAMESSHORT.SEPT}',
            '${DATEPICKER.MONTHNAMESSHORT.OCT}',
            '${DATEPICKER.MONTHNAMESSHORT.NOV}',
            '${DATEPICKER.MONTHNAMESSHORT.DEC}'],
        dayNames: ['${DATEPICKER.DAYNAMES.DIMANCHE}',
            '${DATEPICKER.DAYNAMES.LUNDI}',
            '${DATEPICKER.DAYNAMES.MARDI}',
            '${DATEPICKER.DAYNAMES.MERCREDI}',
            '${DATEPICKER.DAYNAMES.JEUDI}',
            '${DATEPICKER.DAYNAMES.VENDREDI}',
            '${DATEPICKER.DAYNAMES.SAMEDI}'],
        dayNamesShort: ['${DATEPICKER.DAYNAMESSHORT.DIM}',
            '${DATEPICKER.DAYNAMESSHORT.LUN}',
            '${DATEPICKER.DAYNAMESSHORT.MAR}',
            '${DATEPICKER.DAYNAMESSHORT.MER}',
            '${DATEPICKER.DAYNAMESSHORT.JEU}',
            '${DATEPICKER.DAYNAMESSHORT.VEN}',
            '${DATEPICKER.DAYNAMESSHORT.SAM}'],
        dayNamesMin: ['${DATEPICKER.DAYNAMESMIN.D}',
            '${DATEPICKER.DAYNAMESMIN.L}',
            '${DATEPICKER.DAYNAMESMIN.MA}',
            '${DATEPICKER.DAYNAMESMIN.ME}',
            '${DATEPICKER.DAYNAMESMIN.J}',
            '${DATEPICKER.DAYNAMESMIN.V}',
            '${DATEPICKER.DAYNAMESMIN.S}'],
        weekHeader: '${DATEPICKER.WEEKHEADER}',
        dateFormat: '${DATEPICKER.DATEFORMAT}',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    $.datepicker.setDefaults($.datepicker.regional['${DATEPICKER.REGIONAL}']);
}(jQuery));
