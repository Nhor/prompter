var SlideManager = (function () {
    'use strict';

    var SlideManager = function () {
    };

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

    return SlideManager;
})();
