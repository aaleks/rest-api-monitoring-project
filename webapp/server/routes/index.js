var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request');


router.all('*', function (req, res) {
    res.render('app', {title: 'Express'});

});

module.exports = router;