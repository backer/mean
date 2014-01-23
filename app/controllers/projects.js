'use strict';


function guid() {
    return 'xxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    _ = require('lodash');


/**
 * Find project by id
 */
exports.project = function (req, res, next, id) {
    Project.load(id, function (err, project) {
        if (err) return next(err);
        if (!project) return next(new Error('Failed to load project ' + id));
        req.project = project;
        next();
    });
};

/**
 * Create a project
 */
exports.create = function (req, res) {
    var project = new Project(req.body);
    project.user = req.user;
    project.projectId = guid();
    project.latest = true;
    project.save(function (err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                project: project
            });
        } else {
            res.jsonp(project);
        }
    });
};

/**
 * Update a project
 */
exports.update = function (req, res) {
    var project = req.project;

    project = _.extend(project, req.body);

    var origProject;
    Project.load(project._id, function (err, doc) {
        if (!doc.latest) {
          console.log("not latest project, so discard the change");
          res.jsonp(doc);
        } else {
            var backupJSON = doc.toJSON();
            delete backupJSON._id;
            delete backupJSON.latest;
            var backup = new Project(backupJSON);

            backup.save(function (err) {
                if (!err) {
                    project.ver++;
                    project.latest = true;
                    project.created = new Date();

                    project.save(function (err) {
                        if (err) {
                            return res.send('users/signup', {
                                errors: err.errors,
                                project: project
                            });
                        } else {
                            res.jsonp(project);
                        }
                    });
                } else {
                    console.log("failed to backup");
                    res.jsonp(project);

                }
            });
        }
    });
};

/**
 * Delete an project
 */
exports.destroy = function (req, res) {
    var project = req.project;

    project.remove(function (err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                project: project
            });
        } else {
            res.jsonp(project);
        }
    });
};

/**
 * Show an project
 */
exports.show = function (req, res) {
    res.jsonp(req.project);
};

/**
 * List of Projects
 */
exports.all = function (req, res) {
    Project.find().sort('-created').populate('user', 'name username').exec(function (err, projects) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(projects);
        }
    });
};

/**
 * List of Projects
 */
exports.latest = function (req, res) {
    Project.find({latest:true}).sort('-created').populate('user', 'name username').exec(function (err, projects) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(projects);
        }
    });
};