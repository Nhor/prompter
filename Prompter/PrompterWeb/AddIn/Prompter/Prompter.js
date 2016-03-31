﻿(function () {
    'use strict';

    var textToSpeech = new TextToSpeech();
    var slideManager = new SlideManager();

    /**
     * Turn the Prompter on by setting global variable ``on`` to ``true`` and
     * calling the ``SlideManager.watch`` function.
     */
    app.globals.turnOn = function () {
        app.globals.on = true;
        return slideManager.getMode().then(function (mode) {
            if (mode === 'edit' && !app.globals.enabledInEditMode) {
                return slideManager.stopWatching();
            }
            return slideManager.watch();
        });
    };

    /**
     * Turn the Prompter off by setting global variable ``on`` to ``false`` and
     * calling the ``SlideManager.stopWatching`` function.
     */
    app.globals.turnOff = function () {
        app.globals.on = false;
        return slideManager.stopWatching();
    };

    /**
     * Restart the Prompter by calling global funcs ``turnOff`` and ``turnOn``.
     */
    app.globals.restart = function () {
        app.globals.turnOff();
        return app.globals.turnOn();
    };

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
            app.globals.restart();
        });
    };

    /**
     * Initialize the tagging-style <input> items to choose the way the speech
     * syntheizer will tag the slides.
     */
    var initializeTaggingStyleChoice = function () {
        app.globals.taggingStyle = 'title';
        $('input[name="tagging-style"]').change(function () {
            app.globals.taggingStyle = $('input[name="tagging-style"]:checked').val();
        });
    };

    /**
     * Initialize the #on-off-switch <input> item to watch or stop watching the
     * slideshow according to the checkbox state.
     */
    var initializeOnOffSwitch = function () {
        $('#on-off-switch:checkbox').change(function () {
            if (!this.checked) {
                return app.globals.turnOff();
            }
            return app.globals.turnOn();
        });
    };

    Office.initialize = function (reason) {

        Office.context.document.addHandlerAsync(Office.EventType.ActiveViewChanged, function (res) {
            if (!app.globals.on) {
                return;
            }
            return app.globals.restart();
        });

        slideManager.onChange = function (oldSlide, newSlide) {
            var text;

            if (app.globals.taggingStyle === 'title') {
                text = newSlide.title;
            } else if (app.globals.taggingStyle === 'number') {
                text = newSlide.index;
            } else {
                text = 'coming soon';
            }

            textToSpeech.speak(text);
        };

        $(document).ready(function () {
            app.initialize();
            initializeLanguageSelection();
            initializeModePickSwitch();
            initializeTaggingStyleChoice();
            initializeOnOffSwitch();
        });
    };
})();
