angularApp.controller('audioListController',
    function audioListController($scope, Audio, $cookies, $filter, $element, $routeParams, $location, $rootScope, $mdDialog) {
        $scope.audios = Audio.query();

        $scope.audios.$promise.then(function(data) {
            $scope.data = data;
        });

        $scope.currentPage = 0;
        $scope.pageSize = 9;
        $scope.data = [];
        $scope.orderItem = "Created_date";
        $scope.orderReversed = true;
        $scope.genreSearch = "";
        $scope.q = $routeParams.search || '';


        $scope.genres = [
            "8bit",
            "Ambient",
            "Asia / Japan",
            "Bass",
            "Blues / Jazz",
            "Break Beat",
            "Chill",
            "Cross",
            "Death",
            "Deep",
            "Dirty",
            "Down Tempo",
            "Dream",
            "Drum & Bass",
            "Drunken",
            "Dub",
            "Electro",
            "Experimental",
            "Funk",
            "Hard",
            "Hawaii",
            "Healing",
            "High / Weed",
            "Hip-Hop / Rap",
            "House",
            "Instrumental",
            "Jam",
            "Jungle",
            "Liquid",
            "Lounge",
            "LSD / Trip",
            "Meditation",
            "Minimalism",
            "Neuro",
            "Old",
            "Psychedelic",
            "R&B",
            "Reggae",
            "Rock",
            "Singer / Vocal",
            "Ska",
            "Soft / Relaxation",
            "Soundtrack",
            "Step",
            "Swing",
            "Techno",
            "Trance",
            "Trap",
            "Trash",
            "Tropical",
            "Underground"
        ];

        $scope.searchTerm;
        $scope.clearSearchTerm = function() {
            //$scope.searchTerm = '';
        };
        // The md-select directive eats keydown events for some quick select
        // logic. Since we have a search input here, we don't need that logic.
        $element.find('input').on('keydown', function(ev) {
            ev.stopPropagation();
        });

        $scope.orderChange = function() {
            if($scope.orderReversed){
                $scope.orderReversed = false;
            } else {
                $scope.orderReversed = true;
            }
        };

        $scope.orderRevers = function() {
            if($scope.orderReversed){
                $scope.orderReversed = false;
            } else {
                $scope.orderReversed = true;
            }
        };

        $scope.getData = function () {
            // needed for the pagination calc
            // https://docs.angularjs.org/api/ng/filter/filter
            return $filter('filter')($scope.data, $scope.q)
            /*
              // manual filter
              // if u used this, remove the filter from html, remove above line and replace data with getData()

               var arr = [];
               if($scope.q == '') {
                   arr = $scope.data;
               } else {
                   for(var ea in $scope.data) {
                       if($scope.data[ea].indexOf($scope.q) > -1) {
                           arr.push( $scope.data[ea] );
                       }
                   }
               }
               return arr;
              */
        };

        $scope.searchUrl = function() {
            $location.search("search", $scope.q);
        };

        $scope.nextPage=function(){
            $scope.currentPage=$scope.currentPage+1;
            $scope.numberOfPages();

        };

        $scope.numberOfPages=function(){
            return $scope.numberOfPagesTotal = Math.ceil($scope.getData().length/$scope.pageSize);
        };

        //$scope.cookie = $cookies.getAll();


        $scope.playerUrl = function(data) {
            $rootScope.audioData = data;
        };

        $scope.new = function() {
            window.location.href = ' #/audio/new';
        };




}).
component('audioList', {
    templateUrl: '/templates/audio/list.template.html'
});