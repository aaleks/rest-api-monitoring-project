'use strict';

var CONFIG = {};
var _ = require('lodash');
var exec = require('child_process').exec;
var Promise = require('bluebird');
var newman = require('newman'), fs = require('fs');
var requireDir = require('require-dir');
var dateFormat = require('dateformat');


var logger = require("./utils/logger");

logger.warn("Listening on ");
logger.debug("Listening on ");
logger.debug('Debugging info');
logger.verbose('Verbose info');
logger.info('Hello world');
logger.warn('Warning message');
logger.data('Error info');

logger.error("readalltests");


function readalltests() {
    fs.readdir('./examples', function (err, files) {
        if (err) {
            throw err;
        }

        // we filter all files with JSON file extension
        files = files.filter(function (file) {
            return (file.substr(-5) === '.json');
        });

        // now wer iterate on each file name and call newman.run using each file name
        files.forEach(function (file) {
            newman.run({
                // we load collection using require. for better validation and handling
                // JSON.parse could be used
                collection: require(`${__dirname}/${file}`)
            }, function (err) {
                // finally, when the collection executes, print the status
                console.info(`${file}: ${err ? err.name : 'ok'}!`);
            });
        }); // the entire flow can be made more elegant using `async` module
    });
}


function main(options) {
    CONFIG = options;
    var directoryList = requireDir(CONFIG.rootPathApps, {recurse: true});

    Promise.map(Object.keys(directoryList), currentKey => {
        return runTestScriptForApp(directoryList[currentKey].simplecollection, currentKey).catch(e => e)
    }, {concurrency: 2}).then((allSummary) => {
        if (allSummary.run | allSummary.error) {
            console.log("errors found in testing end script ");
        } else {
            console.log("no errors found");
        }
        console.log("BEF SUM \n")
        console.log(allSummary)
        allSummary.forEach((element) => {
            // console.log("element.run " + element.run)
            if (element.run == undefined || (element.run.failures != undefined && element.run.failures.length > 0)) {
                console.log("FAILED")
            } else {
                console.log("OK");
            }
        });
    }).catch((err) => console.log("ERRRRRRR " + err.name));
}

function runTestScriptForApp(collection, key) {
    return new Promise((resolve, reject) => {
        var uniqueUrls = {};
        var reportDirname = CONFIG.reportOutput + key;

        if (!fs.existsSync(reportDirname)) {
            console.info("Directory " + key + "doesn't exist. Creation.... ")
            fs.mkdirSync(reportDirname);
        }

        console.info(dateFormat(new Date(), "dd:mm:yy-h:MM:ss") + " OR " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));

        newman.run({
            collection: collection,
            iterationData: "./resources/data/hostnames/PROD/pool-1/hostnames.json",
            reporters: "html",
            reporter: {html: {export: reportDirname + '/report-' + dateFormat(new Date(), "dd:mm:yy-h:MM:ss") + '.html'}},
            bail: false
        }, function (err, summary) {
            // finally, when the collection executes, print the status
            console.info(` ${err ? err.name : 'ok'}!`);
            if (err) {
                reject(err);
            } else {
                if (Object.keys(uniqueUrls).length == 0) {
                    console.error("NO URLS provided");
                    reject(new Error("NO URLS provided"))
                } else {
                    resolve(summary);
                }
            }
        }).on('request', function (err, args) {
            if (err) {
                reject(err);
            }
            var url = args.request.url.toString();
            // store unique URLs and the count of times they were
            // requested.
            uniqueUrls[url] ?
                (uniqueUrls[url] += 1) : (uniqueUrls[url] = 1);
        }).on('start', function (err, args) { // on start of run, log to console
            console.log('running a collection...');

        }).on('done', function (err, summary) {
            console.log("List of unique URLs in this collection:");
            // list all unique URLs
            Object.keys(uniqueUrls).forEach(function (url) {
                console.log(uniqueUrls[url] + 'occurrence(s): ' + url);
            });

            if (err || summary.error) {
                console.error('collection run encountered an error.');
                //         resolve(error)

            }
            else {
                console.log('collection run completed.');
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
module.exports = function(config) {
    return main(config);
};