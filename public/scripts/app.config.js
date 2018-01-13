angularApp.
config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $routeProvider.
        when('/', {
            template: '<home></home>',
            activetab: 'home',
            activename: 'API routes'
        }).
        when('/audio/new', {
            template: '<audio-new></audio-new>',
            activetab: 'audioNew',
            activename: 'New audio'
        }).
        when('/audio/list', {
            template: '<audio-list></audio-list>',
            activetab: 'audioList',
            activename: 'Audio & Video',
            reloadOnSearch : false
        }).
        when('/audio/:id', {
            template: '<audio-detail></audio-detail>',
            activename: 'Edit audio'
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