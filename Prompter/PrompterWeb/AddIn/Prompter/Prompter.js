(function () {
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
        textToSpeech.stop();
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
            if (app.globals.taggingStyle === 'custom') {
                initializeCustomTags();
            } else {
                terminateCustomTags();
            }
        });
    };

    /**
     * Initialize .custom-tags <div> element to show the custom tags and allow
     * the user to decide what the specific slides tags will be.
     */
    var initializeCustomTags = function () {
        app.globals.slidesCount = app.globals.slidesCount || 0;
        app.globals.customTags = app.globals.customTags || {};

        slideManager.getLastIndex().then(function (index) {
            if (index !== app.globals.slidesCount) {
                app.globals.slidesCount = index;
            }

            var elements = _
                .chain(_.range(app.globals.slidesCount))
                .map(function (index) {
                    return index + 1;
                })
                .map(function (index) {
                    return (
                        '<tr>' +
                        '<td>' +
                        '<label for="custom-tag-' + index + '">' + index + '</label>' +
                        '</td>' +
                        '<td>' +
                        '<input type="text" id="custom-tag-' + index + '" value="' + (app.globals.customTags[index] || '') + '" name="custom-tags"></input>' +
                        '</td>' +
                        '</tr>'
                    );
                });

            terminateCustomTags();

            $('#content-main').append(
                '<div class="padding custom-tags">' +
                '<table>' +
                '<thead>' +
                '</thead>' +
                '<tbody>' +
                '<tr>' +
                '<td>' +
                '</td>' +
                '<td>' +
                '<input type="button" id="refresh-slides-count" value="Refresh slides count"></input>' +
                '</td>' +
                '</tr>' +
                elements.join('\n') +
                '</tbody>' +
                '</table>' +
                '</div>'
            );

            $('#refresh-slides-count').click(function () {
                terminateCustomTags();
                initializeCustomTags();
            });

            $('input[name="custom-tags"]').change(function () {
                var index = _.last(_.split($(this).attr('id'), '-'));
                app.globals.customTags[index] = $(this).val();
            });
        });
    };

    /**
     * Delete the .custom-tags <div> element to hide the custom tags.
     */
    var terminateCustomTags = function () {
        $('.custom-tags').remove();
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
                text = app.globals.customTags[newSlide.index];
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
