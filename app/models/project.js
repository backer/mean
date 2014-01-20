'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Project Schema
 */
var ProjectSchema = new Schema({
    category:{
        type: String,
        default: '',
        trim: true
    },
//    businessArea:{
//        type: String,
//        default: '',
//        trim: true
//    },
//    businessPriority:{
//        type: String,
//        default: '',
//        trim: true
//    },
//    businessMoM:{
//        type: String,
//        default: '',
//        trim: true
//    },
    description:{
        type: String,
        default: '',
        trim: true
    },
//    asset:{
//        type: String,
//        default: '',
//        trim: true
//    },
//    businessAnalysis:{
//        status: {
//            type: String,
//            default: '',
//            trim: true
//        },
//        baselineDue: {
//            type: Date
//        },
//        forcastDue: {
//            type: Date
//        }
//
//    },
    updated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    ver: {
        type: Number,
        default: 1,
        min: 1,
        unique: true
    },
    createdBy: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
},{});

/**
 * Validations
 */
ProjectSchema.path('title').validate(function(title) {
    return title.length;
}, 'Title cannot be blank');

/**
 * Statics
 */
ProjectSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Project', ProjectSchema);
