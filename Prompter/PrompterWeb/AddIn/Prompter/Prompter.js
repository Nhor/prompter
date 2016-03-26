(function () {
    'use strict';

    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            var textToSpeech = new TextToSpeech();
            _.forEach(textToSpeech.languages, function (language, index) {
                $('.language-selection').append(
                    '<option value="' + index + '">' + language + '</option>'
                );
            });
            $('.language-selection').change(function () {
                textToSpeech.setLanguage($('.language-selection option:selected').text());
            });
            $('.language-selection').val(
                _.findIndex(textToSpeech.languages, function (language) {
                    return language === textToSpeech.languageFallback;
                })
            );

            var slideManager = new SlideManager();
            $('#on-off-switch:checkbox').change(function () {
                if (!this.checked) {
                    return slideManager.stopWatching();
                }
                return slideManager.watch();
            });
        });
    };
})();
