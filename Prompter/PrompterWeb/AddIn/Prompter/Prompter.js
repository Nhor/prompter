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

    var setLanguage = function (language) {
        responsiveVoice.setDefaultVoice(language);
    };

    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            _.forEach(responsiveVoiceLanguages, function (language, index) {
                $('.language-selection').append(
                    '<option value="' + index + '">' + language + '</option>'
                );
            });

            $('.language-selection').change(function () {
                setLanguage($('.language-selection option:selected').text());
            });

            $('.language-selection').val(
                _.findIndex(responsiveVoiceLanguages, function (language) {
                    return language === 'US English Female';
                })
            );
        });
    };
})();
