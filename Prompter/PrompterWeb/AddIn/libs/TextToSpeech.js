﻿var TextToSpeech = (function () {
    'use strict';

    /**
     * Create TextToSpeech instance.
     */
    var TextToSpeech = function () {
        this.languages = _
            .chain(responsiveVoice.getVoices())
            .map(function (obj) {
                return obj.name;
            })
            .sortBy()
            .value();

        this.languageFallback = 'US English Male';

        this.setLanguage(this.languageFallback);
    };

    /**
     * Set the speech syntheizer speaking language.
     * @param {string} language - See ``languages`` for available optons.
     */
    TextToSpeech.prototype.setLanguage = function (language) {
        if (_.includes(this.languages, language)) {
            return responsiveVoice.setDefaultVoice(language);
        }
        return responsiveVoice.setDefaultVoice(this.fallback);
    };

    /**
     * Speak specified text.
     * @param {object} text - Text to be spoken. Preferably a string.
     */
    TextToSpeech.prototype.speak = function (text) {
        this.stop();
        return responsiveVoice.speak(text.toString());
    };

    /**
     * Stop speaking.
     */
    TextToSpeech.prototype.stop = function () {
        return responsiveVoice.cancel();
    };

    return TextToSpeech;
})();
