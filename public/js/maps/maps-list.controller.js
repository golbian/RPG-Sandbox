(function () {
    'use strict';

    angular.module('app.maps').controller('MapsListController', MapsListController);

    MapsListController.$inject = ['$location', '$timeout', 'api', 'gettextCatalog', 'userService'];

    function MapsListController ($location, $timeout, api, gettextCatalog, userService) {
        const vm = this;

        vm.maps = [];
        vm.introOptions = {};
        vm.columns = [];
        vm.creationAuthorised = false;
        vm.refresh = refresh;

        activate();

        function activate () {
            vm.columns = getColumns();
            vm.introOptions = getIntroOptions();

            userService.getCurrentUser().then(user => {
                vm.creationAuthorised = user.mapsCreate;
            });

            if ($location.hash() === 'intro') {
                $timeout(function () { vm.showIntro(); }, 1000);
            }
        }

        function refresh (params) {
            params = params || vm.lastRefreshParams;
            vm.lastRefreshParams = params;

            params.populate = 'layer';
            params.fields = ['mapName', 'isPublic', 'isShared', 'layerName', 'parentFolder', 'owner', 'author', 'createdOn'];

            return api.mapsFindAll(params).then(result => {
                vm.maps = result.items;

                return { page: result.page, pages: result.pages };
            });
        }

        function getColumns () {
            return [
                {
                    name: 'mapName',
                    label: 'Name',
                    width: 3,
                    filter: true,
                },
                {
                    name: 'layerName',
                    label: 'Layer',
                    width: 3,
                    filter: true,
                    filterField: 'layer.name',
                },
                {
                    name: 'author',
                    label: 'Author',
                    width: 2,
                    filter: true,
                },
                {
                    name: 'createdOn',
                    label: 'Date of creation',
                    width: 2,
                },
            ];
        }

        function getIntroOptions () {
            const introOptions = {
                nextLabel: gettextCatalog.getString('Next'),
                prevLabel: gettextCatalog.getString('Back'),
                skipLabel: gettextCatalog.getString('Skip'),
                doneLabel: gettextCatalog.getString('Done'),
                tooltipPosition: 'auto',
                showStepNumbers: false,
                steps: [
                    {
                        intro: '<h4>' +
                            gettextCatalog.getString('Maps') +
                            '</h4><p><strong>' +
                            gettextCatalog.getString('Here you can create and execute maps.') +
                            '</strong></p>',
                    },
                    {
                        intro: '<h4>' +
                            gettextCatalog.getString('Maps') +
                            '</h4><p>' +
                            gettextCatalog.getString('Choose a map type and drag and drop elements from the selected layer to compose your map.') +
                            '</p><p>' +
                            gettextCatalog.getString('You can also add runtime filters to split your data in real time.') +
                            '</p>',
                    },
                    {
                        element: '#newMapButton',
                        intro: '<h4>' +
                            gettextCatalog.getString('New Map') +
                            '</h4><p>' +
                            gettextCatalog.getString('Click here to create a new map.') +
                            '</p>',
                    },
                    {
                        element: '#mapList',
                        intro: '<h4>' +
                            gettextCatalog.getString('Maps list') +
                            '</h4><p><strong>' +
                            gettextCatalog.getString('Here all your maps are listed.') +
                            '</strong></p><p>' +
                            gettextCatalog.getString('Click over a map\'s name to execute it.') +
                            '</p><p>' +
                            gettextCatalog.getString('You can also modify or drop the map, clicking into the modify or delete buttons.') +
                            '</p>',
                    },
                    {
                        element: '.btn-edit',
                        intro: '<h4>' +
                            gettextCatalog.getString('Edit map') +
                            '</h4><p>' +
                            gettextCatalog.getString('Click here to modify the map.') +
                            '</p>',
                    },
                    {
                        element: '.btn-delete',
                        intro: '<h4>' +
                            gettextCatalog.getString('Delete map') +
                            '</h4><p><strong>' +
                            gettextCatalog.getString('Click here to delete the map.') +
                            '</strong></p><p>' +
                            gettextCatalog.getString('Once deleted the map will not be recoverable again.') +
                            '</p><p>' +
                            gettextCatalog.getString('Requires 2 step confirmation.') +
                            '</p>',
                    },
                    {
                        element: '.btn-duplicate',
                        intro: '<h4>' +
                            gettextCatalog.getString('Duplicate map') +
                            '</h4><p>' +
                            gettextCatalog.getString('Click here to duplicate the map.') +
                            '</p>',
                    },
                    {
                        element: '.published-tag',
                        intro: '<h4>' +
                            gettextCatalog.getString('Map published') +
                            '</h4><p><strong>' +
                            gettextCatalog.getString('This label indicates that this map is public.') +
                            '</strong></p><p>' +
                            gettextCatalog.getString('If you drop or modify a published map, it will have and impact on other users, think about it before making any updates on the map.') +
                            '</p>',
                    }
                ]
            };

            return introOptions;
        }
    }
})();
