//var CONFIG = require("./../config");
var winston = require('winston');
const env = process.env.NODE_ENV || 'development';
const logDir = "./logs/";
var tsFormat = false;

if (true) {
    tsFormat = () => (new Date()).toLocaleTimeString();
} else {
}

winston.setLevels({
    trace: 0,
    input: 1,
    verbose: 2,
    prompt: 3,
    debug: 4,
    info: 5,
    data: 6,
    help: 7,
    warn: 8,
    error: 9
});
var transports = [];

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
transports.push(new winston.transports.File({
    level: 'info',
    name: "info-non-json",
    filename: './logs/all-logs-nonjson.log',
    handleExceptions: true,
    json: false,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false,
    timestamp: tsFormat
}));
transports.push(new (require('winston-daily-rotate-file'))({
    name: "info-nonjson.rotate",
    filename: `${logDir}results-non-json-rotate.log`,
    timestamp: tsFormat,
    datePattern: 'yyyy-MM-dd_HH:mm',
    level: 'info'
}));

transports.push(new winston.transports.File({
    name: "error",
    level: 'error',
    filename: `${logDir}results-error.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, //5MB
    maxFiles: 5,
    colorize: false,
    timestamp: tsFormat,
    timestamp: tsFormat,
    level: env === 'development' ? 'debug' : 'info'
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
    name: "data",
    level: 'data',
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
        error: 9
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
        error: 'red'
    }
});

module.exports = logger;
module.exports.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};