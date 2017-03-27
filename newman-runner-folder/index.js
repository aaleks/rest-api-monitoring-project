'use strict';

var Promise = require('bluebird');
var newman = require('newman'), fs = require('fs');
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


        var allAppsTestedFailed = [];
        var allAppsTestedSucced = [];

        logger.info("[Runner-allTestedAppResult]Preparing call newman runner for apps :::: " + Object.keys(options) + " ::::");
        return Promise.map(Object.keys(options), currentKey => {
            return runTestScriptForApp(currentKey, options[currentKey].postmanFile, options[currentKey]).catch(e => e)
        }, {concurrency: 2}).then((allSummary) => {
            //logger.data("Result of the runner " + JSON.stringify(allSummary[0]))
            logger.info("[Execution-Finished] processing allSummary");

            //for all results
            allSummary.forEach((element) => {
                var currentApp = element.currentTested;
                var currentJSONVar = {};
                var currentSuccedJSONVar = {};

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
                                logger.info("[Execution-run-forEach] " + element.collection.name);

                                currentErrorObject.collectionName = element.collection.name;
                                currentErrorObject.itemTested = elm.item.name;
                                currentErrorObject.urlCalled = elm.request.url.toString();
                                currentErrorObject.atHostname = url.parse(elm.request.url.toString()).hostname;
                                currentErrorObject.response = elm.response.body;


                                if (elm.requestError != undefined) {
                                    currentErrorObject.error = elm.requestError.code;
                                    currentErrorObject.message = elm.requestError.code;
                                } else if (elm.response.code == 502) {
                                    logger.error("[Execution-Error-Proxy] error proxy for :::: " + currentErrorObject.urlCalled)
                                    currentCallsFailedForApps.push(currentErrorObject);
                                } else if (elm.assertions.length > 0) {


                                    elm.assertions.forEach((currentFilteredElement)=> {
                                        if (currentFilteredElement.error != undefined) {
                                            logger.info("[Execution-assertion-error] Addind error for " + currentApp + ", for call :" + currentErrorObject.urlCalled + " assertion for currentFilteredElement.error : " + JSON.stringify(currentFilteredElement.error))
                                            if (currentErrorObject.message == undefined) {
                                                currentErrorObject.message = "";
                                            }
                                            currentErrorObject.message += currentFilteredElement.error.stack + " \n";
                                            currentErrorObject.error = currentFilteredElement.error.name;
                                            currentErrorObject.assertionFailed = JSON.stringify(currentFilteredElement.error);
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
                            logger.info("[Execution-Failed-addedApp] Failed call added for " + currentApp);
                            currentJSONVar[currentApp] = currentCallsFailedForApps;
                            allAppsTestedFailed.push(currentJSONVar)
                        }

                        if (currentCallsSuccedForApps.length > 0) {
                            logger.info("[Execution-Succed-addedApp] Succed call added for " + currentApp);
                            currentSuccedJSONVar[currentApp] = currentCallsSuccedForApps;
                            allAppsTestedSucced.push(currentSuccedJSONVar)
                        }
                    } else {
                        logger.error("[Newman-execution-error] Nothing find for in Summary for, something went bad ! Missing error catching in the runTestScriptForApp function" + currentApp)

                    }

                }
            });

            logger.info("[Executino-Ended] Newman runner completed - return the results .... ");
            resolve({failed: allAppsTestedFailed, succed: allAppsTestedSucced});

        }).catch((err) => reject(err));
    })
}

function main(options) {
    return allTestedAppResult(options)

}

//testedAppName is the name of the application currently tested
//collectionBase contains all options except env + dataFile
function runTestScriptForApp(testedAppName, postmanCollectionFile, options) {
    return new Promise((resolve, reject) => {
        var uniqueUrls = {};

        logger.info("[Runner-LoadConfig-iterationData] to be used :::: " + JSON.stringify(options.iterationData));
        logger.info("[Runner-LoadConfig-environmentData] to be used :::: " + JSON.stringify(options.environmentData));
        newman.run({
            collection: postmanCollectionFile,
            iterationData: options.iterationData,
            environment: options.environmentData,
            reporters: "html",
            reporter: {
                html: {
                    export: options.reportOutput + 'report-' + dateFormat(new Date(), "dd-mm-yy_h:MM:ss") + '.html',
                    template: options.htmlTemplate
                }
            },
            bail: false
        }, function (err, summary) {
            if (err) {
                logger.error("[Runner-callback-summary] Error for app in runTestScriptForApp :::: " + testedAppName)
                resolve({"err": err.stack, "currentTested": testedAppName});
            } else {
                if (Object.keys(uniqueUrls).length == 0) {
                    logger.error("[Runner-missingURL] No URLS provided for app in runTestScriptForApp :::: " + testedAppName);
                    resolve({"err": "NO URLS provided", "currentTested": testedAppName})
                } else {
                    logger.info("[Runner-execution-succed] test run for ::: " + testedAppName)
                    summary.currentTested = testedAppName;
                    resolve(summary);
                }
            }
        }).on('request', function (err, args) {
            if (err) {
                logger.info("error in on request for app : " + testedAppName)
                //reject(err);
            }
            var url = args.request.url.toString();
            // store unique URLs and the count of times they were
            // requested.
            uniqueUrls[url] ?
                (uniqueUrls[url] += 1) : (uniqueUrls[url] = 1);
        }).on('start', function (err, args) { // on start of run, log to console
            logger.info('[Runner-start] Running a collection... for :::: ' + testedAppName);

        }).on('done', function (err, summary) {
            // list all unique URLs
            Object.keys(uniqueUrls).forEach(function (url) {
                logger.info("[Runner-execution-Info] url ::: " + " for " + testedAppName + " :: " + uniqueUrls[url] + ' occurrence(s): ' + url);
            });

            if (err || summary.error) {
                logger.error('[Runner-execution-Error-done] err || summary.error :: collection run encountered an error for :::: ' + testedAppName);
            }
            else {
                logger.info('[Runner-execution-succed] collection run completed. for :::: ' + testedAppName);
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