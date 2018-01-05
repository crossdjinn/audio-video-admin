var angularApp = angular.module('ngApp', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ngMaterial',
    'ngMessages',
    'angularMoment',
    'angular-loading-bar',
    'audioList',
    'audioDetail',
    'audioNew',
    'home'
])
    .factory('Audio', ['$resource',
        function($resource) {
            return $resource('/api/audio/:id', {id: '@_id'}, {
                'query':  {method:'GET', isArray:true},
                'get':    {method:'GET'},
                'update': {method:'PUT'},
                'save':   {method:'POST'},
                'remove': {method:'DELETE'},
                'delete': {method:'DELETE'}
            });
        }
])
    .factory('SoundCloud', ['$resource',
        function($resource) {
            return $resource('/api/soundcloud', {
                'getSoundId':   {method:'POST'}

            });
        }
])
    .controller('AppCtrl', function ($scope, $timeout, $mdSidenav) {
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');


        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.close = function () {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('left').close();
        };
        $scope.href = function (location) {
            if (location === "/") {
                $location.url("/");
            } else {
                $location.url(location);
            }
        };
})
    .controller('MenuCtrl', function($scope, $route) {
        $scope.$route = $route;
})
    .config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        //$mdThemingProvider.theme('docs-dark', 'default').dark();

});
