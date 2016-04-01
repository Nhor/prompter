var SlideManager = (function () {
    'use strict';

    /**
     * Create a SlideManager instance.
     */
    var SlideManager = function () {
    };

    /**
     * Get current viewing mode.
     * @return {string} 'read' or 'edit' according to the current viewing mode.
     */
    SlideManager.prototype.getMode = function () {
        return when.promise(function (resolve, reject) {
            Office.context.document.getActiveViewAsync(function (res) {
                if (res.status === 'failed') {
                    return reject(new Error(res.error.message));
                }
                return resolve(res.value);
            });
        });
    };

    /**
     * Get current slide.
     * @return {object} Current slide object containing:
     *                  ``id`` - slide ID (unique number),
     *                  ``title`` - slide title (based on the content),
     *                  ``index`` - slide index (position in the slideshow).
     */
    SlideManager.prototype.getCurrent = function () {
        return when.promise(function (resolve, reject) {
            Office.context.document.getSelectedDataAsync(Office.CoercionType.SlideRange, function (res) {
                if (res.status === 'failed') {
                    return reject(new Error(res.error.message));
                }
                return resolve(_.first(res.value.slides));
            });
        });
    };

    /**
     * Go to specified slide.
     * @param {number|string} index - Index of the slide.
     *                                Can be a ``number`` or ``Office.Index``.
     */
    SlideManager.prototype.goTo = function (index) {
        var goToType;

        return when.promise(function (resolve, reject) {
            if (typeof index === 'number') {
                goToType = Office.GoToType.Index;
            } else {
                goToType = Office.GoToType.Slide;
            }

            Office.context.document.goToByIdAsync(index, goToType, function (res) {
                if (res.status === 'failed') {
                    return reject(new Error(res.error.message));
                }
                return resolve();
            });
        });
    };

    /**
     * Get index of the last slide in presentation.
     * @return {number} Index of the last slide in presentation.
     */
    SlideManager.prototype.getLastIndex = function () {
        var that = this;
        var currentSlideIndex;
        var lastSlideIndex;

        return this.getCurrent().then(function (slide) {
            currentSlideIndex = slide.index;
            return that.goTo(Office.Index.Last);
        }).then(function () {
            return that.getCurrent();
        }).then(function (slide) {
            lastSlideIndex = slide.index;
            return that.goTo(currentSlideIndex);
        }).then(function () {
            return lastSlideIndex;
        });
    };

    /**
     * Watch for the slide change.
     * This method will call ``onChange`` when the current slide changes.
     */
    SlideManager.prototype.watch = function () {
        var that = this;
        var lastRegisteredSlide = {};
        var oldSlide;   // one-step-behind clone of ``lastRegisteredSlide``
                        // to be passed to the ``onChange`` method

        this.watchFunc = setInterval(function () {
            return that.getCurrent().then(function (slide) {
                if (slide.id !== lastRegisteredSlide.id) {
                    oldSlide = _.clone(lastRegisteredSlide);
                    lastRegisteredSlide = slide;
                    return that.onChange(oldSlide, slide);
                }
                return when.resolve();
            });
        }, 500);
    };

    /**
     * Stop the ``watch`` method.
     */
    SlideManager.prototype.stopWatching = function () {
        return clearInterval(this.watchFunc);
    };

    /**
     * Called once the ``watch`` method is running and the slide has changed.
     * Should be overwritten in order to perform an action on the slide change.
     * @param {object} oldSlide - Old (previous) slide object containing its
     *                            ``id``, ``title`` and ``index``.
     * @param {object} newSlide - New (next) slide object containing its
     *                            ``id``, ``title`` and ``index``.
     */
    SlideManager.prototype.onChange = function (oldSlide, newSlide) {
    };

    return SlideManager;
})();
