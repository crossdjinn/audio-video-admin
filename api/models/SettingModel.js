'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SettingSchema = new Schema({
    name: {
        type: String,
        required: 'Enter name of set'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    valueInteger: {
        type: [{
            type: Number
        }]
    },
    valueString: {
        type: [{
            type: String
        }]
    },
    valueBoolean: {
        type: [{
            type: Boolean
        }]
    },
    dataType: {
        type: [{
            type: String,
            enum: ['integer', 'string', 'boolean']
        }],
        default: ['string']
    }
});

module.exports = mongoose.model('Setting', SettingSchema);