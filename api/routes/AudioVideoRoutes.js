'use strict';
module.exports = function(app) {
    var fs = require('fs'),
        audio = require('../controllers/AudioController'),
        soundcloud = require('../controllers/SoundCloudController'),
        availableRoutes = require('express-list-endpoints'),
        config;

    // TODO: separate logic of home
    app.get('/', function (req, res) {
        fs.readFile('package.json', 'utf8', function (err, data) {
            if (err) throw err;
            config = JSON.parse(data);

            res.render(
                'index',
                {
                    name: config.name,
                    version: config.version
            })
        });
    });

    app.route('/api/soundcloud')
        .post(soundcloud.getId);

    app.get('/routes', function (req, res) {
        res.render(
            'routes',
            {
                routes: availableRoutes(app)
            })
    });

    app.route('/api/audio')
        .get(audio.all)
        .post(audio.create);

    app.route('/api/audio/:id')
        .get(audio.read)
        .put(audio.update)
        .delete(audio.delete);
};