require.config({
    urlArgs: "b=" + new Date().getTime(), //cache buster
    paths: {
        // main app
        'app': 'src',

        // vendor deps
        'angular': 'bower_components/angular/angular',
        'angular-animate': 'bower_components/angular-animate/angular-animate',
        'angular-aria': 'bower_components/angular-aria/angular-aria',
        'angular-immutable': 'bower_components/angular-immutable/dist/immutable',
        'angular-material': 'bower_components/angular-material/angular-material',
        'immutable': 'bower_components/immutable/dist/immutable',
        'reflux': 'bower_components/reflux/dist/reflux',

        // requirejs plugins
        'font': 'bower_components/requirejs-plugins/src/font',
        'image': 'bower_components/requirejs-plugins/src/font',
        'propertyParser' : 'bower_components/requirejs-plugins/src/propertyParser'
    },
    map: {
        '*': {
            'css': 'bower_components/require-css/css'
        }
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-animate': ['angular'],
        'angular-aria': ['angular'],
        'angular-material': [
            'font!google,families:[Roboto:400,500,700,400italic]',
            'css!bower_components/angular-material/angular-material.css',
            'angular',
            'angular-animate',
            'angular-aria'
        ],
        'angular-immutable': ['immutable'],
        'immutable': {
            exports: 'Immutable'
        },
        'reflux': {
            exports: 'Reflux'
        }
    },
    packages: [
        'app/components/example'
    ]
});

require([
    'angular',
    'angular-material',
    'app/components/example',
    'angular-immutable'
], function () {
    var angular = require('angular');

    angular
        .module('app', ['ngMaterial', 'immutable', 'app.components.example'])
        .config(function ($mdThemingProvider, $mdIconProvider) {
            $mdIconProvider
                .defaultIconSet("./assets/svg/avatars.svg", 128)
                .icon("menu", "./assets/svg/menu.svg", 24)
                .icon("share", "./assets/svg/share.svg", 24)
                .icon("google_plus", "./assets/svg/google_plus.svg", 512)
                .icon("hangouts", "./assets/svg/hangouts.svg", 512)
                .icon("twitter", "./assets/svg/twitter.svg", 512)
                .icon("phone", "./assets/svg/phone.svg", 512);

            $mdThemingProvider.theme('default')
                .primaryPalette('brown')
                .accentPalette('red');

            var Immutable = require('immutable');

            Immutable.Iterable.noLengthWarning = true;
        });

    angular.bootstrap(document, ['app']);
});