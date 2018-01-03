angularApp.controller('audioListController',
    function audioListController($scope, Audio, $cookies) {
        $scope.audios = Audio.query();

        $scope.cookie = $cookies.getAll();
        console.log($scope.cookie);

        $scope.new = function() {
            window.location.href = ' #/audio/new';
        };
}).
component('audioList', {
    templateUrl: '/templates/audio/list.template.html'
});