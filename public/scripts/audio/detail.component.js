angularApp.controller('audioDetailController',
    function audioDetailController($scope, $routeParams, $mdToast, $mdDialog, $http, Audio) {
        $scope.entry = Audio.get({id: $routeParams.id}, function(data) {
            $scope.audio = data;

            var element = document.getElementById("widget");

            if($scope.audio.type[0] === "SoundCloud"){
                var newElement = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + $scope.audio.trackId + '"></iframe>';

                element.insertAdjacentHTML('afterend', newElement);
            } else if($scope.audio.type[0] === "MixCloud"){
                var newElement = '<iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=' + $scope.audio.trackId + '" frameborder="0"></iframe>';

                element.insertAdjacentHTML('afterend', newElement);
            } else if($scope.audio.type[0] === "remote"){
                var audio = document.getElementById('audio');

                var source = document.getElementById('audioSource');
                source.src = $scope.audio.trackUrl;

                audio.volume=0.5;
                audio.load(); //call this to just preload the audio without playing
                audio.play(); //call this to play the song right away
                audio.style.visibility = "visible";

            } else if($scope.entry.type[0] === "local"){
                var audio = document.getElementById('audio');

                var source = document.getElementById('audioSource');
                source.src = "http://" + window.location.host + $scope.audio.trackUrl;

                audio.volume=0.5;
                audio.load(); //call this to just preload the audio without playing
                audio.play(); //call this to play the song right away

                audio.style.visibility = "visible";
            }

        });

        $scope.getId = function() {
            $http.post("/api/soundcloud/", {'soundcloudURL': $scope.entry.trackUrl}).then(function (data, status, headers, config) {
                $scope.entry.trackId = data.data.trackID;

                var element = document.getElementById("soundcloud");
                var newElement = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + $scope.entry.trackId + '"></iframe>';

                element.insertAdjacentHTML('afterend', newElement);
            },function (data, status, headers, config) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Error: " + data)
                        .position("bottom right")
                        .hideDelay(3000)
                );
            });
        };

        $scope.delete = function(ev) {
            var confirm = $mdDialog.confirm()
                .title("Really delete audio?")
                .textContent($scope.audio.name)
                .targetEvent(ev)
                .ok('OK')
                .cancel('Cancel');

            $mdDialog.show(confirm).then(function() {
                $scope.entry.$delete(function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Audio deleted")
                            .position("bottom right")
                            .hideDelay(3000)
                    );
                    window.history.back();
                });
            }, function() {

            });
        };

        $scope.save = function() {
            $scope.entry.$update(function() {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Audio saved")
                        .position("bottom right")
                        .hideDelay(3000)
                );
                window.history.back();
            });
        };
}).
component('audioDetail', {
    templateUrl: '/templates/audio/detail.template.html'
});