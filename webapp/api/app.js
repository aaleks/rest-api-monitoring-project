var express = require('express');
var app = express();
var path = require('path');
var compression = require('compression')

var core = require('./config/core/main');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Cache-Control, x-access-token, Access-Control-Allow-Headers');

    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        res.end();
    } else {
        console.log('OTHER');
        //...other requests
        next();
    }
})


var oneDay = 86400000;

app.use(require("morgan")('dev'));

app.use(compression());

/*
app.use('/uploads/users', express.static(path.join(__dirname, './uploads/'),{ maxAge: 5 }));
*/


//api routes 
core.registerAPIRoutes(app, '../../src/controllers');

//api routes 
core.registerCustomRoutes(app, '../../src/controllers');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({'error': err.message});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({'error': err.message});
});

/*
 var server = app.listen(3000, function () {
 var port = server.address().port;
 console.log('Example app listening at port %s', port);
 });
 */


module.exports = app;
