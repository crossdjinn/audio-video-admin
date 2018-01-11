angularApp.controller('settingListController',
    function settingListController($scope, Setting, $http, $mdToast, $mdDialog) {
        $scope.settings = Setting.query();

        $scope.settings.$promise.then(function(data) {
            $scope.settings = data;
        });

        function BackUpController($scope, $http, $mdDialog, $mdToast, $window) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.generate = function(format) {
                $window.location = '/backup';
                $mdDialog.hide();
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Downloading BackUp file... now")
                        .position("bottom right")
                        .hideDelay(3333)
                );
            };

            $scope.upload = function() {
                console.log("upload");

                var formData = new FormData();
                formData.append('file', $scope.file);
                $http.post('/backup', formData, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                }).then(function () {
                    $mdDialog.hide();
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Database was restored from BackUp file")
                            .position("bottom right")
                            .hideDelay(3333)
                    );
                });



            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
        }

        $scope.showBackUpCentre = function(ev) {
            $mdDialog.show({
                controller: BackUpController,
                templateUrl: '/templates/setting/backUpDialog.template.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
                .then(function(answer) {
                    //$scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    //'You cancelled the dialog.';
                });
        };

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