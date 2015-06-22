define([
    'css!src/components/example/style',
    'app/stores/example',
    'app/utils/stateful'
], function () {
    "use strict";

    angular.module('app.components.example', ['app.stores.example', 'app.utils.stateful'])
        .directive('appExampleComponent', Directive)
        .factory('app.components.example.Actions', Actions)
        .factory('app.components.example.Store', Store)
        .controller('app.components.example.Controller', Controller);

    /**
     *
     * @param store
     * @param stateful
     * @returns {{scope: {id: string}, restrict: string, templateUrl: string, controller: string, compile: compile}}
     * @constructor
     */
    function Directive(store, stateful) {
        return {
            scope: {
                id: '@'
            },
            restrict: 'E',
            templateUrl: 'src/components/example/template.html',
            controller: 'app.components.example.Controller',
            compile: compile
        };

        function compile(element, attrs) {
            // initial setup required for other helper functions
            stateful.setupDirective(this, element, attrs, store, {
                message: 'Example Component' // initial state
            });

            return function (scope, element, attrs) {};
        }
    }

    Directive.$inject = ['app.components.example.Store', 'app.utils.stateful'];

    /**
     *
     * @param stateful
     * @returns {*}
     */
    function Actions(stateful) {
        var actions = stateful.createDirectiveActions(
            ['updateMessage']
        );

        return actions;
    }

    Actions.$inject = ['app.utils.stateful'];

    /**
     *
     * @param actions
     * @param stateful
     * @returns {*}
     * @constructor
     */
    function Store(actions, stateful) {
        var store = stateful.createDirectiveStore({
            listenables: [actions],
            onUpdateMessage: onUpdateMessage
        });

        return store;

        function onUpdateMessage(data, message) {
            data = data.set('message', message);

            return data;
        }
    }

    Store.$inject = ['app.components.example.Actions', 'app.utils.stateful'];

    /**
     *
     * @param scope
     * @param store
     * @param actions
     * @param exampleStore
     * @param exampleActions
     * @param stateful
     * @constructor
     */
    function Controller($scope, store, actions, exampleStore, exampleActions, stateful) {
        // watches a store for changes and applies them directly to the $scope using the directive id
        stateful.watchDirectiveStore($scope, store);

        // same as above minus the use of directive id
        stateful.watchStore($scope, exampleStore);

        // creates proxy actions that basically add the directive id to the start
        var actions = stateful.getDirectiveActions($scope, actions);

        // example listening and reacting to a stores events
        exampleStore.listen(function (store, action) {
            switch (action) {
                case 'onAdd':
                    actions.updateMessage('Loading...');
                    break;
                case 'onAddSuccess':
                    actions.updateMessage('Complete!');
                    break;
                case 'onAddFail':
                    actions.updateMessage('Failed!');
                    break;
            }
        });

        //expose a public facing function
        $scope.doStuff = function (message) {
            exampleActions.add(message + Math.random());
        };
    }

    Controller.$inject = [
        '$scope',
        'app.components.example.Store',
        'app.components.example.Actions',
        'app.stores.example.Store',
        'app.stores.example.Actions',
        'app.utils.stateful'
    ];
});