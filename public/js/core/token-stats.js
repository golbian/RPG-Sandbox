(function () {
    'use strict';

    angular.module('app.core').factory('tokenStats', tokenStats);

    tokenStats.$inject = ['api'];

    function tokenService (api) {
        let getTokenDataPromise;

        const service = {
            getCurrentStats: getCurrentStats,
        };

        return service;

        function getCurrentStats () {
            if (!getTokenDataPromise) {
                getTokenDataPromise = api.getTokenData().then(data => {
                    const token = data.items.token;
                    token.health = data.items.health;
                    token.mana = data.items.mana;
                    token.stamina = data.items.stamina;
                    token.attributes = data.items.attributes;

                    return token;
                });
            }

            return getTokenDataPromise;
        }
    }
})();
