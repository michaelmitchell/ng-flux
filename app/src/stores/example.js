define([
    'immutable',
    'reflux'
], function () {
    "use strict";

    angular.module('app.stores.example', [])
        .factory('app.stores.example.Actions', Actions)
        .factory('app.stores.example.Store', Store);


    // example global store and actions... wouldn't usually be in the same file as the component
    function Actions(stateful) {
        var actions = stateful.createActions({
            add: {children: ['success', 'fail']}
        });

        // async functionality, calling add triggers an async call which will subsequently call the correct actions
        actions.add.listen(add);

        return actions;

        /**
         *
         */
        function add(item) {
            setTimeout(function () {
                if (Math.random() * 10 > 5) {
                    actions.add.success(item);
                }
                else {
                    actions.add.fail(item);
                }
            }, 1000)
        }
    }

    Actions.$inject = ['app.utils.stateful'];

    // provides example of an external data store providing information to a component, this could be passed as an attribute
    // or used directly via DI
    function Store(actions, stateful) {
        var store = stateful.createStore({
            listenables: [actions],
            onAdd: onAdd,
            onAddSuccess: onAddSuccess,
            onAddFail: onAddFail
        }, {
            items: [] //initial state
        });

        return store;

        /**
         *
         */
        function onAdd(data, item) {
            return {
                adding: true
            };
        }

        /**
         *
         */
        function onAddSuccess(data, item) {
            var items = data.get('items');

            items = items.push(item);

            return data.set('items', items);
        }

        /**
         *
         */
        function onAddFail(data, item) {
            return {
                adding: false
            };
        }
    }

    Store.$inject = ['app.stores.example.Actions', 'app.utils.stateful'];
});