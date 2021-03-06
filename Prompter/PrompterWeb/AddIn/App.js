﻿var app = (function () {
    'use strict';

    var app = {};

    app.globals = {};

    var resizeFooter = function () {
        $('#content-footer').css(
            'top',
            $('#content-header').height() + $('#content-main').height()
        );
    };

    app.initialize = function () {
        $('body').append(
            '<div id="notification-message">' +
                '<div class="padding">' +
                    '<div id="notification-message-close"></div>' +
                    '<div id="notification-message-header"></div>' +
                    '<div id="notification-message-body"></div>' +
                '</div>' +
            '</div>');

        $('#notification-message-close').click(function () {
            $('#notification-message').hide();
        });

        resizeFooter();
        $(window).resize(function () {
            resizeFooter();
        });

        app.showNotification = function (header, text) {
            $('#notification-message-header').text(header);
            $('#notification-message-body').text(text);
            $('#notification-message').slideDown('fast');
        };
    };

    return app;
})();
