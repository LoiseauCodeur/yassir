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
/* iFrameHelper v0.0.1
 * 
 * Provides an entity to register and manage context inside an iframe to handle
 * communication between the caller and the frame.
 * 
 * This helper ensure this communication by providing a generated UID shared by 
 * the caller and the iframe.
 * 
 * In extreme cases, it is also possible to provide a callback inside the iframe 
 * to ensure execution of a particular method. This is, however, strongly not recommended.
 * 
 */
(function (window, doc, $) {
    iFrameHelper = function () {
        this.registerediFrames = [];                    // Registered iframes references
        this.usedGuid = [];                                // Mostly used to ensure GUID unicity
    };
    iFrameHelper.prototype = {
        // Register and iframe by passing an object to describe the caller/iframe relationship
        registeriFrame: function (object) {
            var that = this,
                defaultObject = {
                    onSendValues: function () {
                    },            // Callback used inside the iframe to send values to its caller
                    onAbort: function () {
                    },                // Callback used when the operation running in the iframe was aborted
                    iFrame: null,                        // The iframe
                    caller: null                        // The caller to report to
                },
                registerObject = $.extend(defaultObject, object || {});
            registerObject.id = $.generateGuid();
            if (registerObject.iFrame && registerObject.caller) {
                registerObject.iFrame.load(
                    function () {
                        this.contentWindow.iFrameHelper = that;
                        this.contentWindow.iFrameRegistration = registerObject.id;
                        // This method will eventually be removed !!!
                        if (this.contentWindow.iFrameHelperCallback) {
                            this.contentWindow.iFrameHelperCallback();
                        }
                    });
            }
            this.registerediFrames.push(registerObject);
            return registerObject.id;
        },
        // Unregister the iframe identified by 'id' and clean everything used by it
        unregisteriFrame: function (id) {
            var that = this,
                unregistered = false;
            $.each(
                this.registerediFrames, function (index, value) {
                    if (value.id === id) {
                        var guidIndex = $.inArray(value.id, that.usedGuid);
                        if (guidIndex > -1) {
                            that.usedGuid.splice(guidIndex, 1);
                        }
                        value.iFrame.unbind();
                        that.registerediFrames.splice(index, 1);
                        unregistered = true;
                        return false;
                    }
                });
            return unregistered;
        },
        // Check if an iframe is registered
        isRegisterediFrame: function (id) {
            var found = false;
            $.each(
                this.registerediFrames, function (index, value) {
                    if (value.id === id) {
                        found = true;
                        return false;
                    }
                });
            return found;
        },
        // Triggers "onAbort()" callback for the registered id
        abort: function (id) {
            $.each(
                this.registerediFrames, function (index, value) {
                    if (value.id === id) {
                        value.onAbort();
                        return false;
                    }
                });
            return false;
        },
        // Triggers "onSendValues" callback for the registered id
        sendValues: function (id, object) {
            $.each(
                this.registerediFrames, function (index, value) {
                    if (value.id === id) {
                        value.onSendValues(object);
                        return false;
                    }
                });
            return false;
        }
    };
    if (typeof exports !== 'undefined') {
        exports.iFrameHelper = new iFrameHelper;
    } else {
        window.iFrameHelper = new iFrameHelper;
    }
})(window, document, jQuery.noConflict());

