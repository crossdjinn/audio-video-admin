angularApp.controller('settingListController',
    function settingListController($scope, $location, Setting, $http, $mdToast, $mdDialog) {
        $scope.settings = Setting.query();

        $scope.settings.$promise.then(function(data) {
            $scope.settings = data;
        });

        function newSettingController($scope, $mdDialog, $mdToast, $http, $routeParams, $element, Setting) {
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
                    $scope.answer();
                });
            };

            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };

            $scope.cancel = function () {
                $mdDialog.cancel();
            };
        }

        function BackUpController($scope, $http, $mdDialog, $mdToast, $window) {
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.cancel = function() {
                $mdDialog.cancel();
            };

            $scope.generate = function() {
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

        $scope.newSetting = function(ev) {
            $mdDialog.show({
                controller: newSettingController,
                templateUrl: '/templates/setting/new.template.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            }).then(function(answer) {
                $location.path('/');
                $location.path('/settings/');
            }, function() {
            });
        };

        $scope.showBackUpCentre = function(ev) {
            $mdDialog.show({
                controller: BackUpController,
                templateUrl: '/templates/setting/backUpDialog.template.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            });
        };

        $scope.click = function(ev, setting) {
            function InputBooleanController($scope, $mdDialog, Setting) {
                $scope.setOld = Setting.get({id: setting._id}, function(data) {
                    $scope.setOldData = data;
                    $scope.inputName = $scope.setOldData.name;
                    $scope.inputBoolean = $scope.setOldData.valueBoolean[0];

                    $scope.changeString = function() {
                        if(setting.inputBoolean === true){
                            setting.inputBoolean = false;
                        } else {
                            setting.inputBoolean = true;
                        }

                        $scope.setOld.valueBoolean = $scope.inputBoolean;

                        $scope.setOld.$update(function() {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent("saved")
                                    .position("bottom right")
                                    .hideDelay(1000)
                            );
                        });
                    };

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.delete = function() {
                        $scope.setOld.$delete(function() {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent("deleted")
                                    .position("bottom right")
                                    .hideDelay(3000)
                            );
                            $scope.cancel();
                        });

                    };
                });
            }

            function InputStringController($scope, $mdDialog, Setting) {
                $scope.setOld = Setting.get({id: setting._id}, function(data) {
                    $scope.setOldData = data;
                    $scope.inputName = $scope.setOldData.name;
                    $scope.inputString = $scope.setOldData.valueString;

                    $scope.changeString = function() {
                        $scope.setOld.name = $scope.inputName;
                        $scope.setOld.valueString = $scope.inputString;

                        $scope.setOld.$update(function() {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent("saved")
                                    .position("bottom right")
                                    .hideDelay(1000)
                            );
                        });
                    };

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.delete = function() {
                        $scope.setOld.$delete(function() {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent("deleted")
                                    .position("bottom right")
                                    .hideDelay(3000)
                            );
                            $scope.cancel();
                        });

                    };
                });
            }

            function InputIntegerController($scope, $mdDialog, Setting) {
                $scope.setOld = Setting.get({id: setting._id}, function(data) {
                    $scope.setOldData = data;
                    $scope.inputName = $scope.setOldData.name;
                    $scope.inputInteger = $scope.setOldData.valueInteger[0];

                    $scope.changeString = function() {
                        $scope.setOld.name = $scope.inputName;
                        $scope.setOld.valueInteger = $scope.inputInteger;

                        $scope.setOld.$update(function() {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent("saved")
                                    .position("bottom right")
                                    .hideDelay(1000)
                            );
                        });
                    };

                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };

                    $scope.delete = function() {
                        $scope.setOld.$delete(function() {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent("deleted")
                                    .position("bottom right")
                                    .hideDelay(3000)
                            );
                            $scope.cancel();
                        });

                    };
                });
            }

            $scope.entry = Setting.get({id: setting._id}, function() {
                if(setting.dataType[0] === "boolean"){
                    $mdDialog.show({
                        controller: InputBooleanController,
                        templateUrl: '/templates/setting/inputBooleanDialog.template.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    })
                        .then(function(answer) {
                            //$scope.status = 'You said the information was "' + answer + '".';
                        }, function() {
                            //'You cancelled the dialog.';
                            $location.path('/');
                            $location.path('/settings/');
                        });
                } else if(setting.dataType[0] === "string"){
                    $mdDialog.show({
                        controller: InputStringController,
                        templateUrl: '/templates/setting/inputStringDialog.template.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    })
                    .then(function(answer) {
                        //$scope.status = 'You said the information was "' + answer + '".';
                    }, function() {
                        //'You cancelled the dialog.';
                        $location.path('/');
                        $location.path('/settings/');
                    });
                } else if(setting.dataType[0] === "integer"){
                    $mdDialog.show({
                        controller: InputIntegerController,
                        templateUrl: '/templates/setting/inputIntegerDialog.template.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose:true
                    })
                        .then(function(answer) {
                            //$scope.status = 'You said the information was "' + answer + '".';
                        }, function() {
                            //'You cancelled the dialog.';
                            $location.path('/');
                            $location.path('/settings/');
                        });
                }
            });
        };
    })
    .component('settingList', {
        templateUrl: '/templates/setting/list.template.html'
});