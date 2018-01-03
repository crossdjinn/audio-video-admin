'use strict';

var mongoose = require('mongoose'),
    Audio = mongoose.model('Audio');

exports.all = function(req, res) {
    Audio.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.create = function(req, res) {
    var new_task = new Audio(req.body);
    new_task.save(function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.read = function(req, res) {
    Audio.findById(req.params.id, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.update = function(req, res) {
    Audio.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.delete = function(req, res) {
    Audio.remove({
        _id: req.params.id
    }, function(err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Audio successfully deleted' });
    });
};