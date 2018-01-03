'use strict';

var mongoose = require('mongoose'),
    getsoundcloud = require('./../modules/getsoundcloud');

exports.getId = function(req, res) {
    var url = req.body.soundcloudURL;

    getsoundcloud(url, function(err, trackID) {
        if (err) {
            console.log('SOUNDCLOUD ERROR ' + err);
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ trackID: 'application error' }));
            res.end();
        } else {
            res.status(200);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ trackID: trackID }));
            res.end();
        }
    })
};