/**
 * Created by Aleksandar ANTONIJEVIC on 05/02/2017.
 */
var express = require('express');
var models = require('../models');
const fs = require('fs');
const path = require('path');
var requireDir = require('require-dir');



var rootFolder =  "../../../../";
var mainFunction = require(rootFolder + 'newman-runner-folder/index.js');
var CONFIG = require(rootFolder+"config.json");

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

function executeNewman(apps){
    var tmpConf = {};
    tmpConf.reportOutput = path.join(__dirname, rootFolder+CONFIG.reportOutput);
    tmpConf.rootPathApps = path.join(__dirname, rootFolder+CONFIG.rootPathApps);
    tmpConf.iterationData = path.join(__dirname, rootFolder+CONFIG.iterationData);
    tmpConf.htmlTemplate = path.join(__dirname, rootFolder+CONFIG.htmlTemplate);
    tmpConf.dataFile = "dataFile1"; //base datafile
    tmpConf.appsToTest =apps; // empty if you want to test all apps
    return mainFunction(tmpConf);
} 

var AppsController = {
    index: function (req, res, next) {
        return res.json("api index function AppsController.js")
    },
    getAllApplicationsList: function (req, res, next) {
        var directoryList = getDirectories(require('path').resolve(__dirname, rootFolder+CONFIG.rootPathApps));
        ///api/apps/getAllApplicationsList
        return res.json(directoryList);
    },
    getAllApplicationsDetails: function (req, res, next) {
        var directoryList = requireDir(path.join(__dirname, rootFolder+CONFIG.rootPathApps), {recurse: true});
        var key = 'context';
        var result = {};

        Object.keys(directoryList).forEach((currentKey)=>{
            result[currentKey] = {};
            result[currentKey][key] = directoryList[currentKey][key];
        });
        return res.json(result);
    },
    executeTestForApps: function (req, res, next) {
        console.log(req.body.apps);
        executeNewman(req.body.apps).then((allSummary) => {
           return res.json(allSummary)
       }).catch((err) => {
           console.log("BIG ERROR NEEDS TO BE INVESTIGATE " + err);
           return res.statusCode(500).json("BIG ERROR NEEDS TO BE INVESTIGATE ");

       });
    }
};

module.exports = AppsController;