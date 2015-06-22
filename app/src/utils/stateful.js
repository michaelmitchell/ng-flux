define([
    'immutable',
    'reflux'
], function() {
    "use strict";

    var Immutable = require('immutable');
    var Reflux = require('reflux');

    angular.module('app.utils.stateful', [])
        .factory('app.utils.stateful', stateful);

    /**
     *
     */
    function stateful() {
        var directiveActions = {}; //private

        return {
            setupDirective: setupDirective,
            createDirectiveStore: createDirectiveStore,
            createDirectiveActions: createDirectiveActions,
            getDirectiveActions: getDirectiveActions,
            applyDirectiveState: applyDirectiveState,
            watchDirectiveStore: watchDirectiveStore,
            createStore: createStore,
            createActions: createActions,
            applyState: applyState,
            watchStore: watchStore
        };

        /**
         *
         * @param directive
         * @param element
         * @param attrs
         * @param store
         * @param initialState
         */
        function setupDirective(directive, element, attrs, store, initialState) {
            if (!attrs.id) {
                if (store.idSeed === undefined) {
                    throw "no id seed found, run createDirectiveStore";
                }

                attrs.id = directive.$$originalDirective.name + store.idSeed++;

                element.attr('id', attrs.id);
            }

            store.setState(attrs.id, initialState || {});
        }

        /**
         *
         * @param config
         * @returns {*}
         */
        function createDirectiveStore(config, initialState) {
            var data = Immutable.fromJS(initialState || {});

            var storeConfig = {
                getState: getState,
                setState: setState
            };

            for (var k in config) {
                if (typeof config[k] === 'function') {
                    storeConfig[k] = (function (key, fn) {
                        return function (id) {
                            var args = Array.prototype.slice.call(arguments, 1);

                            args.unshift(data);

                            var currentState = data.get(id);
                            var newState = fn.apply(this, args);

                            if (newState instanceof Immutable.Collection === false) {
                                newState = currentState.mergeDeep(newState);
                            }

                            data = data.set(id, newState);

                            this.trigger(data, key, id, args);
                        }
                    })(k, config[k]);
                }
                else {
                    storeConfig[k] = config[k];
                }
            }

            var store = Reflux.createStore(storeConfig);

            store.idSeed = 0;

            return store;

            function getState(id) {
                return data.get(id);
            }

            function setState(id, props) {
                var newState = {};

                newState[id] = props;

                data = data.mergeDeep(newState);
            }
        }

        /**
         *
         * @param config
         * @returns {*|an}
         */
        function createDirectiveActions(config) {
            var actions = Reflux.createActions(config);

            return actions;
        }

        /**
         *
         * @param target
         * @param actions
         * @returns {*}
         */
        function getDirectiveActions(target, actions) {
            var id = target.id;

            if (!id) {
                throw "Target has no id";
            }

            if (!directiveActions[id]) {
                directiveActions[id] = {};

                for (var k in actions) {
                    if (typeof actions[k] === 'function') {
                        directiveActions[id][k] = function () {
                            var args = Array.prototype.slice.call(arguments);

                            args.unshift(id);

                            return actions[k].apply(this, args);
                        };
                    }
                }
            }

            return directiveActions[id];
        }

        /**
         *
         * @param target
         * @param store
         */
        function applyDirectiveState(target, store) {
            var state = store.getState(target.id);

            // apply initial state from the store
            state.map(function (value, key) {
                target[key] = value;
            });
        }

        /**
         *
         * @param target
         * @param store
         */
        function watchDirectiveStore(target, store) {
            applyDirectiveState(target, store);

            store.listen(function (data, action, id) {
                if (id == target.id) {
                    data.get(id).map(function (value, key) {
                        target[key] = value;
                    });

                    target.$digest();
                }
            });
        }

        /**
         *
         * @param config
         * @param initialState
         * @returns {*}
         */
        function createStore(config, initialState) {
            var data = Immutable.fromJS(initialState || {});

            var storeConfig = {
                getState: getState,
                setState: setState
            };

            for (var k in config) {
                if (typeof config[k] === 'function') {
                    storeConfig[k] = (function (key, fn) {
                        return function () {
                            var args = Array.prototype.slice.call(arguments);

                            args.unshift(data);

                            var newState = fn.apply(this, args);

                            if (newState instanceof Immutable.Collection === false) {
                                newState = data.mergeDeep(newState);
                            }

                            data = newState;

                            this.trigger(data, key, arguments);
                        }
                    })(k, config[k]);
                }
                else {
                    storeConfig[k] = config[k];
                }
            }

            var store = Reflux.createStore(storeConfig);

            return store;

            function getState() {
                return data;
            }

            function setState(props) {
                data = data.mergeDeep(props);
            }
        }

        /**
         *
         * @param config
         * @returns {*|an}
         */
        function createActions(config) {
            var actions = Reflux.createActions(config);

            return actions;
        }

        /**
         *
         * @param target
         * @param store
         */
        function applyState(target, store) {
            if (typeof store.getState === 'function') {
                var state = store.getState();

                // apply initial state from the store
                state.map(function (value, key) {
                    target[key] = value;
                });
            }
        }

        /**
         *
         * @param target
         * @param store
         */
        function watchStore(target, store) {
            applyState(target, store);

            store.listen(function (data) {
                data.map(function (value, key) {
                    target[key] = value;
                });

                target.$digest();
            });
        }
    };

});