//Two different usage
//node cli.js -a=app1 usage
//node cli.js -a=app1 -i=absolutePath
//node cli.js -a=app1 -e='{"key": "hostname","value": "google.it"}' or absolute path
//node cli.js -a=app1 -e='[{"key": "hostname","value": "google.it"},{"key": "hostname11","value": "google.it"}]'


/*
 [{
 "hostname": "google.dk"
 },{
 "hostname": "google.rs"
 }]
 */

var ArgumentParser = require('argparse').ArgumentParser;
var mainFunction = require('./newman-runner-folder/index.js');
var logger = require('./newman-runner-folder/utils/logger.js');
var path = require('path');
var BASECONFIG = require("./config.json");
var process = require('process');
var fs = require('fs');


var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse example'
});
parser.addArgument(
    ['-a', '--app'],
    {
        help: 'add the app to test',
        required: true
    }
);
parser.addArgument(
    ['-i', '--iterationData'],
    {
        help: 'add the data to iterationData'
        //action: "append"
    }
);

parser.addArgument(
    ['-e', '--environmentData'],
    {
        help: 'add JSON variable object or a path to a file containing the JSON'
        //action: "append"
    }
);


var args = parser.parseArgs();
//console.dir(args.app);
console.dir(args);

var isFilePath = 0;

//others check to add like if exist
if (args.iterationData != undefined) {
    if (!fs.existsSync(args.iterationData)) {
        // Do something
        logger.error("environmentData provided does not exist");
        isFilePath = 0;
    } else {
        isFilePath = 1;
    }

    if (!path.isAbsolute(args.iterationData)) {
        logger.error("Path not absolute");
        isFilePath = 0;
    }

    if (isFilePath) {
        isJSON(JSON.stringify(require(args.iterationData)))
        args.iterationData = JSON.parse(JSON.stringify(require(args.iterationData)));
    } else {
        isJSON(args.iterationData)

    }
}

isFilePath = 0;

//others check to add like if exist
if (args.environmentData != undefined) {
    if (!fs.existsSync(args.environmentData)) {
        // Do something
        logger.error("environmentData provided does not exist");
        isFilePath = 0;
    } else {
        isFilePath = 1;
    }

    if (!path.isAbsolute(args.environmentData)) {
        logger.error("Path not absolute");
        isFilePath = 0;
    }

    if (isFilePath) {
        isJSON(JSON.stringify(require(args.environmentData)))
        args.environmentData = JSON.parse(JSON.stringify(require(args.environmentData)));
    } else {
        isJSON(args.environmentData)

    }
}

function isJSON(jsonObj) {
    try {
        JSON.parse(jsonObj)
    } catch (e) {
        logger.error("Wrong JSON format");
        process.exit(1);
    }
}


if (args.app == undefined) {
    logger.error("no -a args provided");
    process.exit(1);
} else {

    var CONFIG = {};
    args.app.split(",").forEach(function (currentAppName) {
        CONFIG[currentAppName] = {};
        CONFIG[currentAppName].reportOutput = path.join(__dirname, BASECONFIG.reportOutput) + currentAppName + "/" ;
        CONFIG[currentAppName].rootPathApps = path.join(__dirname, BASECONFIG.rootPathApps);
        //CONFIG[currentAppName].iterationData = path.join(__dirname, CONFIG[currentAppName].iterationData);

        CONFIG[currentAppName].iterationData = undefined;
        CONFIG[currentAppName].logDirectory = path.join(__dirname, BASECONFIG.logDirectory);
        CONFIG[currentAppName].htmlTemplate = path.join(__dirname, BASECONFIG.htmlTemplate);

        CONFIG[currentAppName].contextFileEnabled = false; //base datafile

        CONFIG[currentAppName].appsToTest = args.app.split(","); // empty if you want to test all apps
        CONFIG[currentAppName].postmanFile = require(CONFIG[currentAppName].rootPathApps + currentAppName + "/simplecollection.json"); // empty if you want to test all apps


        // check report output
        if (!fs.existsSync(CONFIG[currentAppName].reportOutput)) {
            logger.info("Directory " + currentAppName + "doesn't exist. Creation.... ")
            fs.mkdirSync(CONFIG[currentAppName].reportOutput);
        }

        //CONFIG[currentAppName].appsToTest.push(args.app);

        if (args.iterationData != undefined) {
            if (!isFilePath) {
                CONFIG[currentAppName].iterationData = [];
                CONFIG[currentAppName].iterationData = CONFIG[currentAppName].iterationData.concat(JSON.parse(args.iterationData)); //base datafile
            } else {
                CONFIG[currentAppName].iterationData = args.iterationData;
            }
        } else {
            CONFIG[currentAppName].iterationData = [];
        }

        if (args.environmentData != undefined) {
            if (!isFilePath) {
                CONFIG[currentAppName].environmentData = {
                    "values": []
                };
                CONFIG[currentAppName].environmentData.values = CONFIG[currentAppName].environmentData.values.concat(JSON.parse(args.environmentData)); //base datafile
            } else {
                CONFIG[currentAppName].environmentData = args.environmentData;
            }
        } else {
            CONFIG[currentAppName].environmentData = [];
        }
        logger.info("CONFIG[currentAppName].environmentData" + JSON.stringify(CONFIG[currentAppName].environmentData) + " it " + JSON.stringify(CONFIG[currentAppName].iterationData))


    })


    mainFunction(CONFIG).then((allSummary) => {
        console.log("ALL DONE " + JSON.stringify(allSummary.failed));
        if (allSummary == undefined || (allSummary.failed.length == 0 && allSummary.succed.length == 0)) {
            logger.error("uncatched error in the process needs to be investigated");
            process.exit(1);
        }


        if (allSummary.failed.length == 0 && allSummary.succed.length != 0) {
            logger.info("no issues api full available & controled");
            process.exit(0);
        } else {
            // script well run but issues
            logger.info("the scripts were executed but they are some failures in the checks");
            process.exit(2);
        }


        //check if the return is succed or failed
    }).catch((err) => {
        //exit code 0
        console.log("BIG ERROR NEEDS TO BE INVESTIGATE " + err);
        process.exit(1);
    });

}


