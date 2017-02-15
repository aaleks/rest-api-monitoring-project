'use strict';

var CONFIG = {};
var _ = require('lodash');
var Promise = require('bluebird');
var newman = require('newman'), fs = require('fs');
var requireDir = require('require-dir');
var dateFormat = require('dateformat');

var logger = require("./utils/logger");

var url = require('url');


function filterApps(allApps, accepted) {
    var result = {};
    for (var type in allApps)
        if (accepted.indexOf(type) > -1)
            result[type] = allApps[type];
    return result;
}


function allTestedAppResult(options) {

    return new Promise((resolve, reject) => {
        CONFIG = options;

        var directoryList = requireDir(CONFIG.rootPathApps, {recurse: true});
        var allAppsTestedFailed = [];
        var allAppsTestedSucced = [];
        var isCustomDataFile = (CONFIG.isCustomDataFile != undefined && CONFIG.isCustomDataFile == true) ? true :false;
        var isCustomEnvDataJSON = (CONFIG.isCustomEnvDataJSON != undefined && CONFIG.isCustomEnvDataJSON == true) ? true :false;

        var appsToTest = [];
        if (CONFIG.appsToTest.length > 0) {
            appsToTest = filterApps(directoryList, CONFIG.appsToTest);
        } else {
            appsToTest = directoryList;
        }

        //TODO
        if(CONFIG.contextFileEnabled == false || CONFIG.contextFileEnabled == undefined){
        }

        logger.info("preparing call newman runner for apps: " + JSON.stringify(CONFIG.appsToTest));
        return Promise.map(Object.keys(appsToTest), currentKey => {
            var dataFile = null;
            try {
                dataFile = appsToTest[currentKey].context[options.dataFile];
                logger.info("using the data file at path : "+ CONFIG.iterationData + " for app :" + currentKey)
            } catch (err) {
                logger.error("missing dataFile for app " + currentKey)
            }
            return runTestScriptForApp(appsToTest[currentKey], currentKey, (isCustomDataFile ?CONFIG.dataFile :(CONFIG.iterationData + dataFile)),(isCustomEnvDataJSON ? CONFIG.envDataJSON :undefined)).catch(e => e)
        }, {concurrency: 2}).then((allSummary) => {
            //logger.data("Result of the runner " + JSON.stringify(allSummary[0]))

            //for all results
            allSummary.forEach((element) => {
                var currentApp = element.currentTested;
                var currentJSONVar = {};
                var currentSuccedJSONVar = {};

                logger.info("current " + currentApp);
                if (element.err != undefined) {
                    logger.info("current errror" + currentApp);
                    currentJSONVar[currentApp] = element.err;
                    allAppsTestedFailed.push(currentJSONVar)
                } else {
                        if (element.run != undefined && element.run.executions != undefined) {
                            var currentCallsFailedForApps = [];
                            var currentCallsSuccedForApps = [];

                            element.run.executions.forEach((elm) => {
                                    var currentErrorObject = {};
                                    logger.info("sumUp" + element.collection.name + "current " + element.currentTested);
                                    logger.info("sumUp" + elm.item.name);

                                    currentErrorObject.collectionName = element.collection.name;
                                    currentErrorObject.itemTested = elm.item.name;
                                    currentErrorObject.urlCalled = elm.request.url.toString();
                                    currentErrorObject.atHostname = url.parse(elm.request.url.toString()).hostname;
                                    currentErrorObject.response = elm.response.body;


                                    if (elm.requestError != undefined) {
                                        currentErrorObject.error = elm.requestError.code;
                                        currentErrorObject.message = elm.requestError.code;
                                    } else if (elm.assertions.length > 0) {


                                        elm.assertions.forEach((currentFilteredElement)=> {
                                            if (currentFilteredElement.error != undefined) {
                                                logger.info("Addind error for " + currentApp  + ", for call :" + currentErrorObject.urlCalled+" assertion for currentFilteredElement.error : " + JSON.stringify(currentFilteredElement.error))
                                                if (currentErrorObject.message == undefined) {
                                                    currentErrorObject.message = "";
                                                }
                                                currentErrorObject.message += currentFilteredElement.error.stack + " \n";
                                                currentErrorObject.error = currentFilteredElement.error.name;
                                            }
                                        });
                                        if (currentErrorObject.error == undefined) {
                                            currentCallsSuccedForApps.push(currentErrorObject);
                                        }

                                    } else {
                                        //added app to succed calls
                                        currentCallsSuccedForApps.push(currentErrorObject);
                                    }
                                    if (currentErrorObject.error != undefined) {
                                        logger.errornewman(JSON.stringify(currentErrorObject));
                                        currentCallsFailedForApps.push(currentErrorObject);
                                    }
                                }
                            )

                            if (currentCallsFailedForApps.length > 0) {
                                logger.info("Failed call added for " + currentApp);
                                currentJSONVar[currentApp] = currentCallsFailedForApps;
                                allAppsTestedFailed.push(currentJSONVar)
                            }

                            if (currentCallsSuccedForApps.length > 0) {
                                logger.info("Succed call added for " + currentApp);
                                currentSuccedJSONVar[currentApp] = currentCallsSuccedForApps;
                                allAppsTestedSucced.push(currentSuccedJSONVar)
                            }
                        }else {
                            logger.error("Nothing find for in Summary for, something went bad ! Missing error catching in the runTestScriptForApp function" + currentApp)

                        }

                }
            });

            logger.info("Newman runner completed - return the results .... ")
            resolve({failed: allAppsTestedFailed, succed: allAppsTestedSucced});

        }).catch((err) => reject(err));
    })
}

function main(options) {
    return allTestedAppResult(options)

}


function runTestScriptForApp(collectionBase, key, dataFile,envData) {
    return new Promise((resolve, reject) => {
        var uniqueUrls = {};
        var reportDirname = CONFIG.reportOutput + key;

        if (!fs.existsSync(reportDirname)) {
            logger.info("Directory " + key + "doesn't exist. Creation.... ")
            fs.mkdirSync(reportDirname);
        }

        newman.run({
            collection: collectionBase.simplecollection,
            iterationData: dataFile,
            environment: envData != undefined ? envData : collectionBase.environment,
            reporters: "html",
            reporter: {
                html: {
                    export: reportDirname + '/report-' + dateFormat(new Date(), "dd-mm-yy_h:MM:ss") + '.html',
                    template: CONFIG.htmlTemplate
                }
            },
            bail: false
        }, function (err, summary) {
            if (err) {
                logger.error("error for app in runTestScriptForApp: "+  key)
                resolve({"err": err.stack, "currentTested": key});
            } else {
                if (Object.keys(uniqueUrls).length == 0) {
                    logger.error("NO URLS provided for app in runTestScriptForApp: "+  key);
                    resolve({"err": "NO URLS provided", "currentTested": key})
                } else {
                    logger.info("test run for " + key)
                    summary.currentTested = key;
                    resolve(summary);
                }
            }
        }).on('request', function (err, args) {
            if (err) {
                logger.info("error in on request for app : " +key )
                //reject(err);
            }
            var url = args.request.url.toString();
            // store unique URLs and the count of times they were
            // requested.
            uniqueUrls[url] ?
                (uniqueUrls[url] += 1) : (uniqueUrls[url] = 1);
        }).on('start', function (err, args) { // on start of run, log to console
            logger.info('running a collection... for ' + key );

        }).on('done', function (err, summary) {
            // list all unique URLs
            Object.keys(uniqueUrls).forEach(function (url) {
                logger.info(uniqueUrls[url] + 'occurrence(s): ' + url);
            });

            if (err || summary.error) {
                logger.error('collection run encountered an error for : ' +key);
            }
            else {
                logger.info('collection run completed. for : ' +key);
            }
        })
    });
}

/**
 * Adds commas to a number
 * @param {number} number
 * @param {string} locale
 * @return {string}
 */
module.exports = function (config) {
    return main(config);
};