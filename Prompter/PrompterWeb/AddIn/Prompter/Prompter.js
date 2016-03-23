(function () {
    'use strict';

    var responsiveVoiceLanguages = _
        .chain(responsiveVoice.getVoices())
        .map(function (obj) {
            return obj.name;
        })
        .filter(function (language) {
            return !_.startsWith(language, 'Fallback');
        })
        .sortBy()
        .value();

    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            _.forEach(responsiveVoiceLanguages, function (language) {
                $('.language-selection').append('<option>' + language + '</option>');
            });
        });
    };
})();
