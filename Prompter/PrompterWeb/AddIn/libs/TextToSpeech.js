var TextToSpeech = (function () {
    'use strict';

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

    TextToSpeech.prototype.setLanguage = function (language) {
        if (_.includes(this.languages, language)) {
            return responsiveVoice.setDefaultVoice(language);
        }
        return responsiveVoice.setDefaultVoice(this.fallback);
    };

    TextToSpeech.prototype.speak = function (text) {
        this.stop();
        return responsiveVoice.speak(text);
    };

    TextToSpeech.prototype.stop = function () {
        return responsiveVoice.cancel();
    };

    return TextToSpeech;
})();
