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
        'settingList',
        'settingDetail',
        'settingNew',
        'home'
    ])
    .factory('audioPlayer', function() {
        // make t izi look 3x data common...
        var data = {};

        return {
            data: data
        };
    })
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start;
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
    .factory('Setting', ['$resource',
        function($resource) {
            return $resource('/api/setting/:id', {id: '@_id'}, {
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
    .directive('file', function () {
        return {
            scope: {
                file: '='
            },
            link: function (scope, el, attrs) {
                el.bind('change', function (event) {
                    var file = event.target.files[0];
                    scope.file = file ? file : undefined;
                    scope.$apply();
                });
            }
        }
    })
    .controller('AppCtrl', function ($scope, $timeout, $mdSidenav) {
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');


        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }

        $scope.close = function () {
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

        var element = document.getElementById("widgetPlayer");
        var newElement = "";

        $scope.$watch("audioData", function() {
            $scope.audio = $rootScope.audioData || {};
            var audio = document.getElementById('audioPlayer');

            if(audio !== null) {
                audio.pause();
                audio.style.visibility = "hidden";
            }

            element.innerHTML = "";

            if(typeof($rootScope.audioData.type) !=="undefined") {
                if($rootScope.audioData.type[0] === "SoundCloud"){
                    newElement = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?auto_play=true&url=https://api.soundcloud.com/tracks/' + $rootScope.audioData.trackId + '"></iframe>';
                    element.innerHTML = newElement;
                } else if($rootScope.audioData.type[0] === "MixCloud"){
                    newElement = '<iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=' + $rootScope.audioData.trackId + '" frameborder="0"></iframe>';
                    element.innerHTML = newElement;
                } else if($rootScope.audioData.type[0] === "remote"){
                    audio = document.getElementById('audioPlayer');

                    if(audio !== null) {
                        var source = document.getElementById('audioPlayerSource');

                        source.src = $rootScope.audioData.trackUrl;

                        //dark side
                        var vol = 0;
                        var interval = 1333;

                        audio.volume = vol;

                        audio.load();
                        audio.play();
                        audio.style.visibility = "visible";

                        var fadeIn = setInterval(
                            function() {
                                if (vol < 0.9) {
                                    audio.volume = (vol += 0.05);
                                }
                                else {
                                    clearInterval(fadeIn);
                                }
                            },
                        interval);
                    }
                } else if($rootScope.audioData.type[0] === "local") {
                    audio = document.getElementById('audioPlayer');
                    if(audio !== null) {
                        var source = document.getElementById('audioPlayerSource');
                        source.src = "http://" + window.location.host + $rootScope.audioData.trackUrl;

                        var vol = 0;
                        var interval = 1000;

                        audio.volume = vol;

                        audio.load();
                        audio.play();
                        audio.style.visibility = "visible";

                        //dark side
                        var fadeIn = setInterval(
                            function() {
                                if (vol < 1) {
                                    audio.volume = (vol += 0.05);
                                }
                                else {
                                    clearInterval(fadeIn);
                                }
                            },
                        interval);
                    }
                }
            }
        });
})
    .config(function($mdThemingProvider) {

        // Configure a dark theme with primary foreground yellow
        //$mdThemingProvider.theme('docs-dark', 'default').dark();

});
