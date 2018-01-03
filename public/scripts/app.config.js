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
            activename: 'All audio files'
        }).
        when('/audio/:id', {
            template: '<audio-detail></audio-detail>',
            activename: 'Edit audio'
        }).
        otherwise('/');
    }
]);