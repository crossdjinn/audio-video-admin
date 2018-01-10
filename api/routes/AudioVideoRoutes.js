'use strict';
module.exports = function(app) {
    var fs = require('fs'),
        audio = require('../controllers/AudioController'),
        setting = require('../controllers/SettingController'),
        soundcloud = require('../controllers/SoundCloudController'),
        availableRoutes = require('express-list-endpoints'),
        id3 = require('id3js'),
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



    app.post('/upload', function(req, res) {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        var sampleFile = req.files.sampleFile;

        var spaceFree = sampleFile.name.replace(/\s/g, '');

        //tagID3.read(fileBuffer, function(tags) {
            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv('uploads/' + spaceFree, function(err) {
                if (err)
                    return res.status(500).send(err);


                res.writeHead(301,
                    {Location: 'http://localhost:3000/#!/audio/new?url=' + '/uploads/' + spaceFree}
                );
                res.end();

            })
        //});
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

    app.route('/api/setting')
        .get(setting.all)
        .post(setting.create);

    app.route('/api/setting/:id')
        .get(setting.read)
        .put(setting.update)
        .delete(setting.delete);

    app.route('/api/audio')
        .get(audio.all)
        .post(audio.create);

    app.route('/api/audio/:id')
        .get(audio.read)
        .put(audio.update)
        .delete(audio.delete);
};