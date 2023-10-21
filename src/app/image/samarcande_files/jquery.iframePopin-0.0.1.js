/**
 * // Utilisation de iframePopin
 *
 * var maDialog = $.iframePopin({
 * 	title: "Titre de la fenêtre modale",
 *  url: "/url/de/l-iframe/a/afficher,
 *  buttons: {
 *   unBouton: {
 *    title: "Titre du premier bouton",
 *    callback: function(iframe) {
 *     // ...
 *     // iframe correspond au contenu DOM/jQuery de l'iframe
 *     // this.close() : ferme la popup
 *    }
 *   },
 *   unAutreBouton: {
 *    title: "Titre de l'autre bouton",
 *    callback: function(iframe) {
 *     // ...
 *    }
 *   },
 *   // ...
 *  },
 *  onClose: function(iframe) {
 *   // action effectuée après la fermeture de la popin avec la croix.
 *   // l'appel de this.close() n'est pas nécessaire
 *  }
 * });
 *
 * // Pour ouvrir la popup créée, utiliser maDialog.open();
 * // Autres paramètres utilisables à la création de la popup :
 * // - autoOpen: ouvre la popup automatiquement si true (l'appel de maDialog.open() n'est pas nécessaire) [false par défaut]
 * // - modal: rend la popin modale [true par défaut]
 * // - width, height: dimensions d'origine de la boîte de dialogue
 */

function eventPush(obj, event, handler) {
    if (obj.addEventListener) {
        obj.addEventListener(event, handler, false);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + event, handler);
    } else {
        obj.onload = handler;
    }
}
function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    var trident = ua.indexOf('Trident/');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    if (trident > 0) {
        // IE 11 (or newer) => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    // other browser
    return false;
}
(function ($) {

    // Browser variables
    var msie = detectIE();
    $.iframePopin = function (params) {
        this.defaultParams = {
            autoOpen: false,
            modal: true,
            resizable: true,
            width: 520,
            height: 250
        };
        this.container = $("<div>").attr("id", "iframePopin").css({'overflow': 'hidden'});
        this.iFrame = $('<iframe>').appendTo(this.container);
        $("<div>").addClass("actions").appendTo(this.container);
        this.action = $("<input>").attr("type", "button");
        var wrapper = this,
            $backButton = null,
            iFrameHistory = [];
        var instance = {
            options: $.extend(wrapper.defaultParams, params || {}),
            dialog: null,
            iFrame: null,
            open: function () {
                this.dialog.dialog('open');
                return this;
            },
            close: function () {
                //				this.dialog.dialog("close");
                //				return this;
                // L'implémentation actuelle ne permet pas d'avoir des popins multiples dans une page
                // Il est important de détruire la popin au risque de "polluer" la page de popins orphelines
                this.dialog.dialog("destroy");
            },
            destroy: function () {
                this.dialog.dialog("destroy");
            },
            init: function () {
                var actionButton = wrapper.action.clone(),
                    containerTemplate = wrapper.container.clone(),
                    $actions = containerTemplate.find(".actions"),
                    self = this;
                containerTemplate.attr("title", this.options.title);
                containerTemplate.find("iframe").attr("src", this.options.url).css(
                    {
                        width: '100%',
                        height: 150,
                        'overflow-x': 'hidden'
                    });
                $actions.html("");
                var iframe = containerTemplate.find("iframe")[0];
                if (iframe) {
                    if (iframe.onreadystatechange) {
                        iframe.onreadystatechange = function () {
                            stateChanged(iFrame);
                        };
                    } else {
                        eventPush(iframe, 'load', _iFrameLoaded);
                    }
                }
                if (!$.isEmptyObject(this.options.buttons)) {
                    $.each(
                        this.options.buttons, function (k, v) {
                            var button = actionButton.clone();
                            button
                                .attr("name", k)
                                .attr("value", v.title)
                                .click(
                                function (e) {
                                    v.callback.call(self, containerTemplate.find("iframe").contents(), e, containerTemplate.find("iframe"));
                                });
                            $actions.append(button);
                            $('<span>').html('&nbsp;').appendTo($actions); // Permet d'espacer les boutons de la popin
                        });
                } else {
                    $actions.remove();
                }
                this.iFrame = containerTemplate.find('iframe');
                this.dialog = containerTemplate.dialog(
                    {
                        autoOpen: this.options.autoOpen,
                        modal: this.options.modal,
                        resizable: this.options.resizable,
                        minWidth: this.options.width,
                        minHeight: this.options.height,
                        width: this.options.width,
                        height: this.options.height,
                        closeOnEscape: false
                    });
                this.dialog.closest('div.ui-dialog').find(".ui-dialog-titlebar-close").click(
                    function (event, ui) {
                        if (!!self.options.onClose) {
                            self.options.onClose.call(self, containerTemplate.find("iframe").contents(), event, ui);
                        }
                    });
            }
        };

        function stateChanged(iFrame) {
            if (((msie) && (iFrame.readyState == "complete")) || (!msie)) {
                _iFrameLoaded();
            }
        }

        function _iFrameLoaded() {
            var $this = $(this);
            if ($this.contents().find('body').is('.login')) {
                window.location = window.location.origin + "/adminsite";
            } else {
                $this.contents().find('body').css({'background': '#fff'});
                setTimeout(
                    function () {
                        _optimizeSize();
                    }, 100);
            }
        }

        function _optimizeSize() {
            var $popin = $('#iframePopin'),
                $iFrame = $popin.find("iframe"),
                $dialog = $popin.closest('.ui-dialog'),
                titleBarHeight = $popin.closest('.ui-dialog').find('.ui-dialog-titlebar').outerHeight(true),
                actionBarHeight = $popin.find('.actions').outerHeight(true),
                popinPaddingHeight = $.parseInteger($popin.css('padding-top')) + $.parseInteger($popin.css('padding-bottom')),
                dialogPaddingHeight = $.parseInteger($dialog.css('padding-top')) + $.parseInteger($dialog.css('padding-bottom')),
                clientHeight = $(window).height() - 50,
                maxiFrameHeight = clientHeight - (titleBarHeight + actionBarHeight),
                contentHeight = $iFrame.contents().find('html').outerHeight(true);
            // Ie specific calcul
            if (msie) {
                contentHeight += $iFrame.contents().find('body').outerHeight(true);
            }
            contentHeight = contentHeight < maxiFrameHeight ? contentHeight : maxiFrameHeight;
            var dialogFinalHeight = contentHeight + popinPaddingHeight + titleBarHeight + dialogPaddingHeight;
            dialogFinalHeight = dialogFinalHeight > maxiFrameHeight ? maxiFrameHeight : dialogFinalHeight;
            var optimizeTop = ((clientHeight / 2) - (dialogFinalHeight / 2)) + $(window).scrollTop();
            $dialog.transition({top: optimizeTop});
            $popin.transition({height: contentHeight + actionBarHeight + popinPaddingHeight});
            $iFrame.transition({height: contentHeight});
        }

        instance.init();
        return instance;
    };
})(jQuery);