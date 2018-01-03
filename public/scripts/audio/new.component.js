angularApp.controller('audioNewController',
    function audioNewController($scope, $routeParams, $mdToast, $http, Audio) {
        $scope.entry = new Audio();

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