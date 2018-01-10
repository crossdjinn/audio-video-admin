angularApp.controller('settingDetailController',
    function settingDetailController($scope, $routeParams, $mdToast, $mdDialog, $http, Setting) {
        $scope.types = [
            "ui",
            "ux",
            "player",
            "midi"
        ];

        $scope.entry = Setting.get({id: $routeParams.id}, function(data) {
            $scope.setting = data;
        });


        $scope.delete = function(ev) {
            var confirm = $mdDialog.confirm()
                .title("Really delete setting?")
                .textContent($scope.setting.name)
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
                        .textContent("Setting saved")
                        .position("bottom right")
                        .hideDelay(3000)
                );
                window.history.back();
            });
        };
}).
component('settingDetail', {
    templateUrl: '/templates/setting/detail.template.html'
});