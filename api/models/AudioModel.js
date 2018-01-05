'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AudioSchema = new Schema({
    name: {
        type: String,
        required: 'Enter the name of the audio'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    trackUrl: {
        type: [{
            type: String
        }]
    },
    trackId: {
        type: [{
            type: String
        }]
    },
    genres: {
        type: [{
            type: String
        }]
    },
    type: {
        type: [{
            type: String,
            enum: ['local', 'remote', 'SoundCloud', 'MixCloud']
        }],
        default: ['local']
    }
});

module.exports = mongoose.model('Audio', AudioSchema);