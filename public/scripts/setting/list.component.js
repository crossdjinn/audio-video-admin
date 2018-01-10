angularApp.controller('settingListController',
    function settingListController($scope, Setting, $http, $mdToast) {
        $scope.settings = Setting.query();

        $scope.settings.$promise.then(function(data) {
            $scope.settings = data;
        });

        $scope.click = function (setting) {
            console.log(setting);

            $scope.entry = Setting.get({id: setting._id}, function(data) {
                if(setting.dataType[0] === "boolean"){
                    if(setting.valueBoolean === true){
                        setting.valueBoolean = false;
                    } else {
                        setting.valueBoolean = true;
                    }

                    $scope.entry.valueBoolean = setting.valueBoolean;

                    $scope.entry.$update(function() {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent("Setting " + setting.name + " saved")
                                .position("bottom right")
                                .hideDelay(3333)
                        );
                    });

                }


            });


        };

}).
component('settingList', {
    templateUrl: '/templates/setting/list.template.html'
});