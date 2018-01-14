angularApp.
config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $routeProvider.
        when('/', {
            template: '<home></home>',
            activetab: 'home',
            activename: 'API routes'
        }).
        when('/av/new', {
            template: '<media-new></media-new>',
            activetab: 'mediaNew',
            activename: 'New AV'
        }).
        when('/av/list', {
            template: '<media-list></media-list>',
            activetab: 'mediaList',
            activename: 'Audio & Video',
            reloadOnSearch : false
        }).
        when('/av/:id', {
            template: '<media-detail></media-detail>',
            activename: 'Edit AV'
        }).
        when('/settings', {
            template: '<setting-list></setting-list>',
            activetab: 'settingList',
            activename: 'Settings'
        }).
        when('/settings/new', {
            template: '<setting-new></setting-new>',
            activetab: 'settingNew',
            activename: 'Settings new'
        }).
        when('/settings/:id', {
            template: '<setting-detail></setting-detail>',
            activename: 'Settings edit'
        }).
        otherwise('/');
    }
]);