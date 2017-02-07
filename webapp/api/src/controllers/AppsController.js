/**
 * Created by Aleksandar ANTONIJEVIC on 05/02/2017.
 */
var express = require('express');
var models = require('../models');
const fs = require('fs')
const path = require('path')


function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

var AppsController = {
    index: function (req, res, next) {
        return res.json("api index function AppsController.js")
    },
    getAllApplicationsList: function (req, res, next) {
        var directoryList = getDirectories(require('path').resolve(__dirname, "../../../../resources/applications-tests"));
        return res.json(directoryList);
    },
    getLastModifiedDate: function (req, res, next) {

    },
    executeTestForApp: function (req, res, next) {
        //test execution
        console.log(req.query.app)

    },
    executeTestForApps: function (req, res, next) {
        //test execution
        console.log(req.body.apps)
        return res.json(req.body.apps);

        //return array of status

    }

};

module.exports = AppsController;