angularApp.controller('audioNewController',
    function audioNewController($scope, $routeParams, $mdToast, $http, $routeParams, Audio) {
        $scope.entry = new Audio();

        $scope.entry.trackUrl = $routeParams.url;

        $scope.getWidget = function() {

            if($scope.entry.type[0] === "SoundCloud"){
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
            } else if($scope.entry.type === "MixCloud"){


                var str = $scope.entry.trackUrl;
                $scope.entry.trackId = str.split("https://www.mixcloud.com").pop();


                var element = document.getElementById("mixcloud");
                var newElement = '<iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=' + $scope.entry.trackId + '" frameborder="0"></iframe>';

                element.insertAdjacentHTML('afterend', newElement);
            } else if($scope.entry.type === "remote"){
                var audio = document.getElementById('audio');

                var source = document.getElementById('audioSource');
                source.src = $scope.entry.trackUrl;

                audio.volume=0.5;
                audio.load(); //call this to just preload the audio without playing
                audio.play(); //call this to play the song right away
                audio.style.visibility = "visible";

            } else if($scope.entry.type === "local"){
                var audio = document.getElementById('audio');

                var source = document.getElementById('audioSource');
                source.src = "http://" + window.location.host + $scope.entry.trackUrl;

                audio.volume=0.5;
                audio.load(); //call this to just preload the audio without playing
                audio.play(); //call this to play the song right away

                audio.style.visibility = "visible";
            }


        };

        $scope.add = function() {
            $scope.entry.$save(function() {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Audio added")
                        .position("bottom right")
                        .hideDelay(3000)
                );
                window.history.back();
            });
        };
}).
component('audioNew', {
    templateUrl: '/templates/audio/new.template.html'
});