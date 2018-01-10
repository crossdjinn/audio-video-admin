'use strict';

var mongoose = require('mongoose'),
    Setting = mongoose.model('Setting');

exports.all = function(req, res) {
    Setting.find({}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.create = function(req, res) {
    var new_task = new Setting(req.body);
    new_task.save(function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.read = function(req, res) {
    Setting.findById(req.params.id, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.update = function(req, res) {
    Setting.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, task) {
        if (err)
            res.send(err);
        res.json(task);
    });
};

exports.delete = function(req, res) {
    Setting.remove({
        _id: req.params.id
    }, function(err, task) {
        if (err)
            res.send(err);
        res.json({ message: 'Setting successfully deleted' });
    });
};