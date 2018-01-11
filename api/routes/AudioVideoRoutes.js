'use strict';
module.exports = function(app) {
    var fs = require('fs'),
        audio = require('../controllers/AudioController'),
        setting = require('../controllers/SettingController'),
        soundcloud = require('../controllers/SoundCloudController'),
        availableRoutes = require('express-list-endpoints'),
        backup = require('mongodb-backup'),
        restore = require('mongodb-restore'),
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

    app.post('/backup', function(req, res) {
        var file = req.files.file;

        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        var spaceFree = file.name.replace(/\s/g, '');

        file.mv('backup/' + spaceFree, function(err) {
            if (err)
                return res.status(500).send(err);

            backup({
                uri: "mongodb://localhost/AVdb",
                root: __dirname,
                tar: '../../backup/autoSafe.tar',
                callback: function(err) {
                    if (err) {
                        console.error(err);
                    } else {
                        restore({
                            uri: 'mongodb://localhost/AVdb',
                            root: __dirname, // read tar file from this dir
                            dropCollections: true,
                            tar: '../../backup/' + spaceFree,
                            callback: function(err) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    return res.status(200).send('finish');
                                }
                            }
                        });
                    }
                }
            });
        })
    });

    app.get('/backup', function(req, res) {
        res.writeHead(200, {
            'Content-Type': 'application/x-tar' // force header for tar download
        });
        backup({
            uri: "mongodb://localhost/AVdb",
            stream: res
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