angularApp.controller('audioDetailController',
    function audioDetailController($scope, $routeParams, $mdToast, $mdDialog, $http, Audio) {
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

        $scope.entry = Audio.get({id: $routeParams.id}, function(data) {
            $scope.audio = data;

            var element = document.getElementById("widget");

            if($scope.audio.type[0] === "SoundCloud"){
                var newElement = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + $scope.audio.trackId + '"></iframe>';

                element.insertAdjacentHTML('afterend', newElement);
            } else if($scope.audio.type[0] === "MixCloud"){
                var newElement = '<iframe width="100%" height="120" src="https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=' + $scope.audio.trackId + '" frameborder="0"></iframe>';

                element.insertAdjacentHTML('afterend', newElement);
            } else if($scope.audio.type[0] === "remote"){
                var audio = document.getElementById('audio');

                var source = document.getElementById('audioSource');
                source.src = $scope.audio.trackUrl;

                audio.volume=0.5;
                audio.load(); //call this to just preload the audio without playing
                audio.play(); //call this to play the song right away
                audio.style.visibility = "visible";

            } else if($scope.entry.type[0] === "local"){
                var audio = document.getElementById('audio');

                var source = document.getElementById('audioSource');
                source.src = "http://" + window.location.host + $scope.audio.trackUrl;

                audio.volume=0.8;
                audio.load(); //call this to just preload the audio without playing
                audio.play(); //call this to play the song right away
                audio.style.visibility = "visible";

                var zoom = document.getElementById('zoom'),
                    volume = document.getElementById('volume'),
                    playPause = document.getElementById('playPause');

                var wavesurfer = WaveSurfer.create({
                    container: '#waveform',
                    waveColor: 'black',
                    progressColor: 'white',
                    splitChannels: true,
                    height: 96
                });

                wavesurfer.on('ready', function () {
                    var EQ = [
                        {
                            f: 16,
                            type: 'lowshelf'
                        },{
                            f: 32,
                            type: 'peaking'
                        }, {
                            f: 64,
                            type: 'peaking'
                        }, {
                            f: 128,
                            type: 'peaking'
                        }, {
                            f: 256,
                            type: 'peaking'
                        }, {
                            f: 512,
                            type: 'peaking'
                        }, {
                            f: 1024,
                            type: 'peaking'
                        }, {
                            f: 2048,
                            type: 'peaking'
                        }, {
                            f: 4096,
                            type: 'peaking'
                        }, {
                            f: 8172,
                            type: 'peaking'
                        }, {
                            f: 16344,
                            type: 'highshelf'
                        }
                    ];

                    // Create filters
                    var filters = EQ.map(function (band) {
                        var filter = wavesurfer.backend.ac.createBiquadFilter();
                        filter.type = band.type;
                        filter.gain.value = 0;
                        filter.Q.value = 1;
                        filter.frequency.value = band.f;
                        return filter;
                    });

                    // Connect filters to wavesurfer
                    wavesurfer.backend.setFilters(filters);

                    // Bind filters to vertical range sliders
                    var container = document.querySelector('#equalizer');
                    filters.forEach(function (filter) {
                        var input = document.createElement('input');
                        wavesurfer.util.extend(input, {
                            type: 'range',
                            min: -40,
                            max: 40,
                            value: 0,
                            title: filter.frequency.value
                        });
                        input.style.display = 'inline-block';
                        input.setAttribute('orient', 'vertical');
                        wavesurfer.drawer.style(input, {
                            'webkitAppearance': 'slider-vertical',
                            width: '50px',
                            height: '150px'
                        });
                        container.appendChild(input);

                        var onChange = function (e) {
                            filter.gain.value = ~~e.target.value;
                        };

                        input.addEventListener('input', onChange);
                        input.addEventListener('change', onChange);
                    });

                    // For debugging
                    wavesurfer.filters = filters;

                    zoom.style.visibility = "visible";
                    volume.style.visibility = "visible";
                    playPause.style.visibility = "visible";

                    $scope.zoom = 0;

                    var zoomFirstLevel = Number($scope.zoom);
                    wavesurfer.zoom(zoomFirstLevel);

                    wavesurfer.play();
                });

                $scope.volumeDisabled = "false";
                $scope.playPauseStatus = "PAUSE";
                $scope.muteStatus = "MUTE";
                $scope.zoom = 0;
                $scope.volume = 80;

                $scope.loadLocal = function() {
                    audio.pause();
                    $scope.experimentalSelected = true;
                    wavesurfer.load("http://" + window.location.host + $scope.audio.trackUrl);
                };

                $scope.volumeChanched = function() {
                    var volumeLevel = Number($scope.volume/100);
                    wavesurfer.setVolume(volumeLevel);
                };

                $scope.zoomChanched = function() {
                    var zoomLevel = Number($scope.zoom);
                    wavesurfer.zoom(zoomLevel);
                };

                $scope.zoomReset = function() {
                    $scope.zoom = 0;
                    var zoomLevel = Number(0);
                    wavesurfer.zoom(zoomLevel);
                };


                $scope.playPause = function() {
                    if(wavesurfer.isPlaying()){
                        $scope.playPauseStatus = "PLAY";
                        wavesurfer.pause();
                    } else {
                        $scope.playPauseStatus = "PAUSE";
                        wavesurfer.play();
                    }

                };

                $scope.mute = function() {
                    if(wavesurfer.getMute()){
                        $scope.muteStatus = "MUTE";
                        $scope.volume = 80;
                        wavesurfer.setMute(false);
                    } else {
                        $scope.muteStatus = "MUTED";
                        $scope.volume = 0;
                        wavesurfer.setMute(true);
                    }
                };
            }

        });

        $scope.getId = function() {
            $http.post("/api/soundcloud/", {'soundcloudURL': $scope.entry.trackUrl}).then(function (data, status, headers, config) {
                $scope.entry.trackId = data.data.trackID;

                var element = document.getElementById("soundcloud");
                var newElement = '<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/tracks/' + $scope.entry.trackId + '"></iframe>';

                element.insertAdjacentHTML('afterend', newElement);
            },function (data, status, headers, config) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Error: " + data)
                        .position("bottom right")
                        .hideDelay(3000)
                );
            });
        };

        $scope.delete = function(ev) {
            var confirm = $mdDialog.confirm()
                .title("Really delete audio?")
                .textContent($scope.audio.name)
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
                        .textContent("Audio saved")
                        .position("bottom right")
                        .hideDelay(3000)
                );
                window.history.back();
            });
        };
}).
component('audioDetail', {
    templateUrl: '/templates/audio/detail.template.html'
});