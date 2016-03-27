(function () {
    'use strict';

    var textToSpeech = new TextToSpeech();
    var slideManager = new SlideManager();

    /**
     * Initialize the .language-selection <select> items to display available
     * languages and change the TTS language each time the <option> changes.
     */
    var initializeLanguageSelection = function () {
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
    };

    /**
     * Initialize the #mode-pick-switch <input> item to toggle
     * ``app.globals.enabledInEditMode`` on checkbox state change.
     */
    var initializeModePickSwitch = function () {
        app.globals.enabledInEditMode = true;
        $('#mode-pick-switch:checkbox').change(function () {
            app.globals.enabledInEditMode = this.checked;
        });
    };

    /**
     * Initialize the #tagging-style <input> items to choose the way the
     * speech syntheizer will tag the slides.
     */
    var initializeTaggingStyleChoice = function () {
        app.globals.taggingStyle = 'number';
        $('input[name="tagging-style"]').change(function () {
            app.globals.taggingStyle = $('input[name="tagging-style"]:checked').val();
        });
    };

    /**
     * Initialize the #on-off-switch <input> item to ``SlideManager.watch`` or
     * ``SlideManager.stopWatching`` the slideshow according to the checkbox state.
     */
    var initializeOnOffSwitch = function () {
        $('#on-off-switch:checkbox').change(function () {
            if (!this.checked) {
                return slideManager.stopWatching();
            }
            return slideManager.watch();
        });
    };

    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();
            initializeLanguageSelection();
            initializeModePickSwitch();
            initializeTaggingStyleChoice();
            initializeOnOffSwitch();
        });
    };
})();
