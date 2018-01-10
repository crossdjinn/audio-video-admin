angularApp.controller('settingNewController',
    function settingNewController($scope, $mdToast, $http, $routeParams, $element, Setting) {
        $scope.data = new Setting();
        $scope.data.dataType = "string";
        $scope.data.valueBoolean = false;

        $scope.add = function() {
            $scope.data.$save(function() {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Setting " + $scope.data.name + " added")
                        .position("bottom right")
                        .hideDelay(3333)
                );
            });
        };
}).
component('settingNew', {
    templateUrl: '/templates/setting/new.template.html'
});