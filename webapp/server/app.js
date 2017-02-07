var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var sessionOptions = {
  secret: "secret",
  resave : true,
  saveUninitialized : false,
  httpOnly: true, secure: true,
  //maxAge: null
  cookie: {maxAge: 2592000000}//1 month expiration session
};

var routes = require('./routes/index');
var app = express();
var handlebars = require('express-handlebars');

app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(session(sessionOptions));

var hbConfig = {
  layoutsDir: path.join(app.settings.views, "layouts"),
  defaultLayout: "main.handlebars"
}
app.engine('handlebars', handlebars(hbConfig));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Cache-Control, x-access-token, Access-Control-Allow-Headers');

  if (req.method === 'OPTIONS') {
    //console.log('!OPTIONS');
    res.end();
  } else {
    //console.log('OTHER');
    //...other requests
    next();
  }
});

if (process.env.HOT) {
  var config = require('../webpack/webpack.config.development');
  var webpack = require('webpack');
  var compiler = webpack(config);
  app.use(logger('dev'));
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler)); 
  app.use('/public/favicon.ico', express.static(path.join(__dirname, './public/favicon.ico'),{ maxAge: 100 }));

  app.use('/public/plugins', express.static(path.join(__dirname, './public/plugins')));
  app.use('/public/stylesheets', express.static(path.join(__dirname, './public/stylesheets')));
  app.use('/public/images', express.static(path.join(__dirname, './public/images')));
  app.use('/public/js/scripts', express.static(path.join(__dirname, './public/js/scripts')));
  app.use('/public/fonts', express.static(path.join(__dirname, './public/fonts')));
  app.use('/public/pages/login', express.static(path.join(__dirname, './public/pages/login')));
} else {
  //app.use('/public', express.static(path.join(__dirname, './public')));
}
 
app.use('*', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
