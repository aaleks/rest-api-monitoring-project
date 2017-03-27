/**
 * Created by Aleksandar ANTONIJEVIC on 05/02/2017.
 */
var express = require('express');
//var models = require('../models');
const fs = require('fs');
const path = require('path');
var requireDir = require('require-dir');


var rootFolder = "../../../../";
var mainFunction = require(rootFolder + 'newman-runner-folder/index.js');
var CONFIG = require(rootFolder + "config.json");

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

function executeNewman(args) {
    var tmpConf = {};

    var apps = args.apps;
    var targetedEnv = args.prod;
    console.log( " args.prod  " + args.prod)
    //all apps here
    var directoryList = requireDir(path.join(__dirname, rootFolder + CONFIG.rootPathApps), {recurse: true});
    if (apps.length == 0) {
        apps = Object.keys(directoryList);
    }
    var tmpConf = {};

    apps.forEach(function (currentAppName) {
        tmpConf[currentAppName] = {};
        tmpConf[currentAppName].reportOutput = path.join(__dirname, rootFolder + CONFIG.reportOutput) + currentAppName + "/";
        tmpConf[currentAppName].rootPathApps = path.join(__dirname, rootFolder + CONFIG.rootPathApps);

        tmpConf[currentAppName].logDirectory = path.join(__dirname, rootFolder + CONFIG.logDirectory);
        tmpConf[currentAppName].htmlTemplate = path.join(__dirname, rootFolder + CONFIG.htmlTemplate);

        tmpConf[currentAppName].contextFileEnabled = false; //base datafile

        tmpConf[currentAppName].postmanFile = require(tmpConf[currentAppName].rootPathApps + currentAppName + "/simplecollection.json"); // empty if you want to test all apps

        tmpConf[currentAppName].iterationData = require(path.join(__dirname, rootFolder + CONFIG.iterationData + directoryList[currentAppName]["context"]["iterationData-"+targetedEnv]));

        // tmpConf[currentAppName].environmentData = [{"key": "hostname","value": "google.it"},{"key": "hostname11","value": "google.it"}]

        var envObject = {"values":[]};//currentFile.startWith
        directoryList[currentAppName]["context"]["environment-"+targetedEnv].forEach((currentFile)=>{
            if(currentFile.startsWith("/")){
                envObject.values=envObject.values.concat(require(rootFolder + CONFIG.dataFolder + currentFile ).values);
            }else{
                envObject.values=envObject.values.concat(require(tmpConf[currentAppName].rootPathApps + currentAppName + "/" + currentFile).values);
            }

        });
        tmpConf[currentAppName].environmentData = envObject;


        //added default env object
        tmpConf[currentAppName].environmentData.values = tmpConf[currentAppName].environmentData.values.concat(require(path.join(__dirname, rootFolder + CONFIG.iterationData + "environment/"+targetedEnv+"/environment.json")).values)
        //CONFIG[currentAppName].environmentData = directoryList[currentAppName]["environment-PROD"];
        //console.log("tmpConf[currentAppName].environmentData" + JSON.stringify(tmpConf[currentAppName].environmentData))

        // check report output
        if (!fs.existsSync(tmpConf[currentAppName].reportOutput)) {
            //logger.info("Directory " + currentAppName + "doesn't exist. Creation.... ")
            fs.mkdirSync(tmpConf[currentAppName].reportOutput);
        }

    });

    return mainFunction(tmpConf);
}

var AppsController = {
    index: function (req, res, next) {
        return res.json("api index function AppsController.js")
    },
    getAllApplicationsList: function (req, res, next) {
        var directoryList = getDirectories(require('path').resolve(__dirname, rootFolder + CONFIG.rootPathApps));
        ///api/apps/getAllApplicationsList
        return res.json(directoryList);
    },
    getAllApplicationsDetails: function (req, res, next) {
        var directoryList = requireDir(path.join(__dirname, rootFolder + CONFIG.rootPathApps), {recurse: true});
        var key = 'context';
        var result = {};

        Object.keys(directoryList).forEach((currentKey)=> {
            result[currentKey] = {};
            result[currentKey][key] = directoryList[currentKey][key];
        });
        return res.json(result);
    },
    executeTestForApps: function (req, res, next) {
        console.log(req.body.apps);
        //here contruct the apps

        executeNewman(req.body).then((allSummary) => {
            return res.json(allSummary)
        }).catch((err) => {
            console.log("BIG ERROR NEEDS TO BE INVESTIGATE " + err);
            res.statusCode = 500;
            return res.json({error:err.message});
        });
    }
};

module.exports = AppsController;