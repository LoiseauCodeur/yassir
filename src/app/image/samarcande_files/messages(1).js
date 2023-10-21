(function (factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery", "../jquery.validate-1.13.1"], factory);
    } else {
        factory(jQuery);
    }
}(function ($) {

    /*
     * Translated default messages for the jQuery validation plugin.
     * Locale: FR (French; français)
     */
    $.extend($.validator.messages, {
        required: "${VALIDATE.REQUIRED}",
        remote: "${VALIDATE.REMOTE}",
        email: "${VALIDATE.EMAIL}",
        url: "${VALIDATE.URL}",
        date: "${VALIDATE.DATE}",
        dateISO: "${VALIDATE.DATEISO}",
        number: "${VALIDATE.NUMBER}",
        digits: "${VALIDATE.DIGITS}",
        creditcard: "${VALIDATE.CREDITCARD}",
        equalTo: "${VALIDATE.EQUALTO}",
        extension: "${VALIDATE.EXTENSION}",
        maxlength: $.validator.format("${VALIDATE.MAXLENGTH}"),
        minlength: $.validator.format("${VALIDATE.MINLENGTH}"),
        rangelength: $.validator.format("${VALIDATE.RANGELENGTH}"),
        range: $.validator.format("${VALIDATE.RANGE}"),
        max: $.validator.format("${VALIDATE.MAX}"),
        min: $.validator.format("${VALIDATE.MIN}"),
        maxWords: $.validator.format("${VALIDATE.MAXWORDS}"),
        minWords: $.validator.format("${VALIDATE.MINWORDS}"),
        rangeWords: $.validator.format("${VALIDATE.RANGEWORDS}"),
        letterswithbasicpunc: "${VALIDATE.LETTERSWITHBASICPUNC}",
        alphanumeric: "${VALIDATE.ALPHANUMERIC}",
        lettersonly: "${VALIDATE.LETTERSONLY}",
        nowhitespace: "${VALIDATE.NOWHITESPACE}",
        ziprange: "${VALIDATE.ZIPRANGE}",
        integer: "${VALIDATE.INTEGER}",
        vinUS: "${VALIDATE.VINUS}",
        dateITA: "${VALIDATE.DATEITA}",
        time: "${VALIDATE.TIME}",
        phoneUS: "${VALIDATE.PHONEUS}",
        phoneUK: "${VALIDATE.PHONEUK}",
        mobileUK: "${VALIDATE.MOBILEUK}",
        strippedminlength: $.validator.format("${VALIDATE.STRIPPEDMINLENGTH}"),
        email2: "${VALIDATE.EMAIL2}",
        url2: "${VALIDATE.URL2}",
        creditcardtypes: "${VALIDATE.CREDITCARDTYPES}",
        ipv4: "${VALIDATE.IPV4}",
        ipv6: "${VALIDATE.IPV6}",
        require_from_group: $.validator.format("${VALIDATE.REQUIRE_FROM_GROUP}"),
        nifES: "${VALIDATE.NIFES}",
        nieES: "${VALIDATE.NIEES}",
        cifES: "${VALIDATE.CIFES}",
        postalCodeCA: "${VALIDATE.POSTALCODECA}"
    });

}));