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
// Group of regex used to determine content type
var patterns = {
    'image': /.((-|\.)jpeg|(-|\.)jpg|(-|\.)gif|(-|\.)png)/,
    'iframe': {
        'youtube': /(youtube|youtu)\.(com|be)\/(watch\?v=(\w+)|(\w+))/,
        'dailymotion': /dailymotion\.com\/(\w+)/,
        'vimeo': /vimeo\.com\/(\w+)/,
        'video': /.((-|\.)mp4|(-|\.)flv|(-|\.)avi|(-|\.)mov)/,
        'audio': /.((-|\.)mp3|(-|\.)ogg)/,
        'doc': /.((-|\.)pdf|(-|\.)doc|(-|\.)docx|(-|\.)xls|(-|\.)xlsx|(-|\.)ppt|(-|\.)pptx)/,
        'flash': /.((-|\.)swf)/
    }
};
var replacePattern = /&(WIDTH|width|HEIGHT|height|MEDIA|media)(=[0-9]+)*/gi;
(function ($) {

    // Function used to determine if 'obj' is actually of type 'type'
    function is(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }

    // Determine wich kind of content 'link' refers to
    function getLinkType(link) {
        var href = $(link).attr('href'),
            type = 'undefined';
        $.each(
            patterns, function (key, value) {
                if (type !== 'undefined') {
                    return false;
                }
                if (is('RegExp', value)) {
                    if (href.match(value)) {
                        type = key;
                        return false;
                    }
                } else if (is('Object', value)) {
                    $.each(
                        value, function (subKey, subValue) {
                            if (href.match(subValue)) {
                                type = key;
                                return false;
                            }
                        });
                }
            });
        return type;
    }

    // Navigation with tab
    $('.galerie_onglet').each(
        function (index) {
            var $gallery = $(this),
                $tabs = $gallery.find('li[class^="galerie_onglet"]');
            $tabs.click(
                function () {
                    var $this = $(this),
                        $div = $('#' + $this.data('tabid'));
                    $('[class^="galerie_onglet_contenu"]', $gallery).removeClass('galerie_onglet_contenu--show');
                    $div.addClass('galerie_onglet_contenu--show');
                });
        });
    $('.pagination_suivant').click(
        function (e) {
            e.preventDefault();
            var $this = $(this),
                $galerie = $this.closest('.galerie_playlist'),
                $page = $this.closest('.visionneuse_pagination');
            $('.visionneuse_pagination', $galerie).removeClass('visionneuse_pagination--show');
            $page.nextAll('.visionneuse_pagination:first').addClass('visionneuse_pagination--show');
        });
    $('.pagination_precedent').click(
        function (e) {
            e.preventDefault();
            var $this = $(this),
                $galerie = $this.closest('.galerie_playlist'),
                $page = $this.closest('.visionneuse_pagination');
            $('.visionneuse_pagination', $galerie).removeClass('visionneuse_pagination--show');
            $page.prevAll('.visionneuse_pagination:first').addClass('visionneuse_pagination--show');
        });
    // Look for content inside the page
    var contents = [];
    $('.pagination_contenu .lanceur_media, .pagination_contenu .lien_externe a').each(
        function (index) {
            var $this = $(this),
                type = getLinkType(this);
            if (type !== 'undefined') {
                contents.push(
                    {
                        src: $this.attr('href'),
                        type: type
                    });
            } else {
                contents.push(
                    {
                        src: '#',
                        type: 'inline'
                    });
            }
            $(this).data('index', index);
            $this.removeAttr('onclick');
        });
    var $triggers = $('.pagination_contenu .lanceur_media, .pagination_contenu .lien_externe');
    // Build galerie
    $triggers.magnificPopup(
        {
            items: contents,
            image: {
                titleSrc: function (item) {
                    var $link = $triggers.eq(item.index),
                        title = $link.closest('div').find('[class*="media_titre"]').html();
                    return title ? title : '';
                },
                tError: LOCALE_FO.galerie.display.errorImage
            },
            inline: {
                tNotFound: LOCALE_FO.galerie.display.errorFormatInconnu,
                src: ''
            },
            iframe: {
                markup: '<div class="mfp-iframe-scaler">' +
                '<div title="%title%" class="mfp-close"></div>' +
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
                '<div class="mfp-bottom-bar">' +
                '<div class="mfp-title"></div>' +
                '<div class="mfp-counter"></div>' +
                '</div>' +
                '</div>', // HTML markup of popup, `mfp-close` will be replaced by the close button
                titleSrc: function (item) {
                    var $link = $('.lanceur_media, .lien_externe').eq(item.index),
                        title = $link.closest('div').find('[class*="media_titre"]').html();
                    return title ? title : '';
                },
                patterns: {
                    youtube: {
                        index: 'youtube.com/',
                        id: function (url) {
                            var m = url.match(/(youtube|youtu)\.(com|be)\/(watch\?v=(\w+)|v\/(\w+)|embed\/(\w+))/);
                            if (m) {
                                if (m[4]) {
                                    return m[4];
                                }
                                if (m[5]) {
                                    return m[5];
                                }
                                if (m[6]) {
                                    return m[6];
                                }
                            }
                            return null;
                        },
                        className: 'video',
                        src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
                    },
                    vimeo: {
                        index: 'vimeo.com/',
                        id: '/',
                        className: 'video',
                        src: '//player.vimeo.com/video/%id%?autoplay=1'
                    },
                    dailymotion: {
                        index: 'dailymotion.com',
                        id: function (url) {
                            var m = url.match(/^.+dailymotion.com\/(video|hub|swf)\/([^_]+)[^#]*(#video=([^_&]+))?/);
                            if (m !== null) {
                                if (m[4] !== undefined) {
                                    return m[4];
                                }
                                return m[2];
                            }
                            return null;
                        },
                        className: 'video',
                        src: 'http://www.dailymotion.com/embed/video/%id%'
                    },
                    doc: {
                        index: function (url) {
                            var m = url.match(patterns['iframe']['doc']);
                            if (m) {
                                return 0;
                            }
                            return -1;
                        },
                        id: function (url) {
                            var m = url.match(/(.+)(\?.+)/);
                            if (m && m[1]) {
                                return m[1];
                            }
                            return url;
                        },
                        className: 'document',
                        src: 'http://docs.google.com/viewer?url=%id%&embedded=true'
                    },
                    audio: {
                        index: function (url) {
                            var m = url.match(patterns['iframe']['audio']);
                            if (m) {
                                return 0;
                            }
                            return -1;
                        },
                        id: function (url) {
                            var m = url.match(/.+\?URL_MEDIA=(.+)/);
                            if (m && m[1]) {
                                return m[1];
                            }
                            return url;
                        },
                        className: 'audio',
                        src: '/adminsite/utils/mediatheque/audio/audio.jsp?URL_MEDIA=%id%'
                    },
                    video: {
                        index: function (url) {
                            var m = url.match(patterns['iframe']['video']);
                            if (m) {
                                return 0;
                            }
                            return -1;
                        },
                        id: function (url) {
                            var m = url.match(/.+\?URL_MEDIA=(.+)/),
                                extension = '&EXTENSION=';
                            if (m && m[1]) {
                                return m[1] + extension;
                            }
                            return url + extension;
                        },
                        className: 'video',
                        src: '/adminsite/utils/mediatheque/video/video.jsp?URL_MEDIA=%id%'
                    }
                },
                srcAction: 'iframe_src', // Templating object key. First part defines CSS selector, second attribute. "iframe_src" means: find "iframe" and set attribute "src".
                tError: LOCALE_FO.galerie.display.errorIFrame
            },
            tClose: LOCALE_FO.galerie.controls.close,
            tLoading: LOCALE_FO.galerie.display.loading,
            tClose: LOCALE_FO.galerie.controls.close,
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                tPrev: LOCALE_FO.galerie.controls.previous,
                tNext: LOCALE_FO.galerie.controls.next,
                tCounter: '<span>%curr% ' + LOCALE_FO.galerie.display.counter + ' %total%</span>'
            }
        });
})(jQuery.noConflict());