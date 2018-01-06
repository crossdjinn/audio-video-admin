var angularApp = angular.module('ngApp', [
    'ngRoute',
    'ngResource',
    'ngCookies',
    'ngMaterial',
    'ngMessages',
    'ng-pagination',
    'angularMoment',
    'angular-loading-bar',
    'audioList',
    'audioDetail',
    'audioNew',
    'home'
])
    .factory('audioPlayer', function() {

        // private variable
        var _dataObj = {};

        // public API
        return {
            data: _dataObj
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    })
    .filter('orderObjectBy', function() {
        return function (items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse) filtered.reverse();
            return filtered;
        }
    })
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
    .controller('MenuCtrl', function($scope, $route, $rootScope) {
        $scope.$route = $route;
        $rootScope.audioData = {};

        var element = document.getElementById("widget");

        var newElement = "";


        $scope.$watch("audioData", function() {
            $scope.audio = $rootScope.audioData || {};
            var audio = document.getElementById('audioPlayer');
            var source = document.getElementById('audioPlayerSource');

            audio.pause();
            audio.style.visibility = "hidden";
            element.innerHTML = "";

            if($rootScope.audioData.type[0] === "SoundCloud"){
                newElement = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?auto_play=true&url=https://api.soundcloud.com/tracks/' + $rootScope.audioData.trackId + '"></iframe>';
                element.innerHTML = newElement;
            } else if($rootScope.audioData.type[0] === "MixCloud"){
                newElement = '<iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=' + $rootScope.audioData.trackId + '" frameborder="0"></iframe>';
                element.innerHTML = newElement;
            } else if($rootScope.audioData.type[0] === "remote"){

                source.src = $rootScope.audioData.trackUrl;

                audio.volume=0.5;
                audio.load(); //call this to just preload the audio without playing
                audio.play(); //call this to play the song right away
                audio.style.visibility = "visible";

            } else if($rootScope.audioData.type[0] === "local") {
                var audio = document.getElementById('audioPlayer');

                var source = document.getElementById('audioPlayerSource');
                source.src = "http://" + window.location.host + $rootScope.audioData.trackUrl;

                audio.volume = 0.8;
                audio.load(); //call this to just preload the audio without playing
                audio.play(); //call this to play the song right away
                audio.style.visibility = "visible";
            }
        });

})
    .config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow

        //$mdThemingProvider.theme('docs-dark', 'default').dark();

});
