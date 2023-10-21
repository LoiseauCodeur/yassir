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
(function ($) {
    'use strict';
    // Default configuration : edition is disabled to prevent hazardous behaviours
    var defaultConfiguration;

    function customizeConf(configuration) {
        if (configuration.disableNativeSpellChecker === false) {
            configuration.globalNotifications = {
                globalMessages: [
                    {
                        'uuid': '6c0df62e-3c07-425e-9f96-a2e2bbcad016',
                        'message': LOCALE_BO.ckeditor.notifications.spellcheker,
                        'level': 'info'
                    }
                ]
            };
        }
        var htmlElement = document.getElementsByTagName('html')[0];
        configuration.allowedContent = true;
        configuration.language = htmlElement.lang;
    }

    function loadExternalPlugins(conf) {
        if (conf.externalPaths) {
            for (var property in conf.externalPaths) {
                if (conf.externalPaths.hasOwnProperty(property) && !CKEDITOR.plugins.externals.hasOwnProperty(property)) {
                    CKEDITOR.plugins.addExternal(property, conf.externalPaths[property]);
                }
            }
        }
    }

    // Retrieves editors configurations and load them
    function loadCkeditors(editors, confKeys) {
        $.ajax(
            {
                'url': '/servlet/ckeditor/configuration',
                'data': {'conf_keys[]': confKeys},
                'dataType': 'json',
                'success': function (configs) {
                    editors.each(
                        function () {
                            var $this = $(this),
                                currentConfKey = $this.attr('data-conf'),
                                currentConf = configs[currentConfKey];
                            // Only for editors exposing a configuration key
                            if (currentConfKey) {
                                customizeConf(currentConf);
                                if (currentConf) {
                                    var maxLength = $this.attr('maxLength');
                                    if(maxLength && currentConf.hasOwnProperty('wordcount'))
                                    {
                                        currentConf.wordcount.maxCharCount = maxLength;
                                    }
                                    var currentEditor = CKEDITOR.replace($this.attr('id'), currentConf);
                                    currentEditor.on(
                                        'configLoaded', function (event) {
                                            loadExternalPlugins(event.listenerData.conf);
                                        }, null, {
                                            'conf': currentConf
                                        });
                                    // Empêche l'apparition des poignées de rendimensionnement sur les objets
                                    currentEditor.on( 'instanceReady', function() {
                                        this.document.$.execCommand('enableObjectResizing', false, false);
                                    });
                                    var page = document.querySelector('#page');
                                    currentEditor.on('maximize', function (e) {
                                        if(page){
                                            if (CKEDITOR.TRISTATE_ON === e.data) {
                                                page.classList.add('page_maximized_cke');
                                            } else {
                                                page.classList.remove('page_maximized_cke');
                                            }
                                        }
                                    });
                                } else {
                                    CKEDITOR.replace($this.attr('id'), defaultConfiguration);
                                }
                            }
                        });
                },
                'error': function () {
                    // Fallback : if something goes wrong, we load default configuration to prevent broken editors
                    editors.each(
                        function () {
                            var $this = $(this);
                            if ($this.attr('data-conf')) {
                                CKEDITOR.replace($this.attr('id'), defaultConfiguration);
                            }
                        });
                }
            });
    }

    // Retrieve the default configuration
    function loadDefaultConfiguration() {
        $.ajax(
            {
                url: '/adminsite/ckeditor/configurations/defaultConfig.json',
                async: false,
                dataType: 'json',
                success: function (response) {
                    defaultConfiguration = response;
                },
                error: function () {
                    defaultConfiguration = {};
                }
            });
    }

    // Retrieves all editor components and their conf key
    function init() {
        var editors = $('.js-ckeditor'),
            confKeys = [];
        loadDefaultConfiguration();
        if (editors.length > 0) {
            CKEDITOR.timestamp = +new Date();
            editors.each(
                function configureSpecificToolbox() {
                    var $this = $(this),
                        currentConfKey = $this.attr('data-conf');
                    // If the editor exposes a confkey, we try to retrieve it.
                    // Otherwise, the default configuration is loaded
                    if (currentConfKey) {
                        confKeys.push(currentConfKey);
                    } else {
                        CKEDITOR.replace($this.attr('id'), defaultConfiguration);
                    }
                });
            if (confKeys.length > 0) {
                loadCkeditors(editors, confKeys);
            }
        }
    }

    $(function onDomReadyToolbox() {
        init();
    });
})(jQuery.noConflict());
