//var CONFIG = require("./../config");
var winston = require('winston');
const env = process.env.NODE_ENV || 'development';
var path = require("path")
const logDir = path.join(__dirname, "../../logs/");
var tsFormat = false;
var logFileName = "newman-runner.stdout.log";
var logFileNameError = "newman-runner.stderr.log";

if (true) {
    tsFormat = () => (new Date()).toLocaleTimeString();
} else {

}


var transports = [];

/*
 transports.push(new winston.transports.File({
 level: 'info',
 name: "info",
 filename: `${logDir}all-logs.log`,
 handleExceptions: true,
 json: true,
 maxsize: 5242880, //5MB
 maxFiles: 5,
 colorize: false,
 timestamp: tsFormat
 }));
 */

transports.push(new (require('winston-daily-rotate-file'))({
    level: 'info',
    name: "info-non-json",
    filename: `${logDir}${logFileName}`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false,
    datePattern: 'yyyy-MM-dd',
    timestamp: tsFormat
}));
/*
 transports.push(new (require('winston-daily-rotate-file'))({
 name: "info-nonjson.rotate",
 filename: `${logDir}${logFileName}`,
 timestamp: tsFormat,
 datePattern: 'yyyy-MM-dd',
 level: 'info'
 }));
 */

/*
 transports.push(new (require('winston-daily-rotate-file'))({
 name: "error",
 level: 'error',
 filename: `${logDir}${logFileNameError}`,
 handleExceptions: true,
 json: false,
 maxsize: 5242880, //5MB
 maxFiles: 5,
 colorize: false,
 timestamp: tsFormat,
 datePattern: 'yyyy-MM-dd'
 }));

 //level: env === 'development' ? 'debug' : 'info'
 */

/*
 transports.push(new (require('winston-daily-rotate-file'))({
 name: "data-file",
 level: 'data',
 handleExceptions: true,
 json: false,
 colorize: false,
 filename: `${logDir}newman-runner-data-logs.log`,
 datePattern: 'yyyy-MM-dd',
 timestamp: tsFormat
 }));
 */


transports.push(new (require('winston-daily-rotate-file'))({
    name: "errornewman-file",
    level: 'errornewman',
    handleExceptions: true,
    json: false,
    colorize: false,
    datePattern: 'yyyy-MM-dd',
    filename: `${logDir}${logFileName}`,
    timestamp: tsFormat
}));


transports.push(new winston.transports.Console({
    name: "debug",
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: tsFormat
}));


transports.push(new winston.transports.Console({
    name: "errornewman-console",
    level: 'errornewman',
    handleExceptions: true,
    json: false,
    colorize: true,
    timestamp: tsFormat
}));
var logger = new winston.Logger({
    transports: transports, exitOnError: false, levels: {
        trace: 0,
        input: 1,
        verbose: 2,
        prompt: 3,
        debug: 4,
        info: 5,
        data: 6,
        help: 7,
        warn: 8,
        error: 9,
        errornewman: 10
    }, colors: {
        trace: 'magenta',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        debug: 'blue',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        error: 'red',
        errornewman: 'red',

    }
});

//winston.remove(winston.transports.Console);


module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};