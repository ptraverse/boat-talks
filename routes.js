'use strict';

var bodyParser = require('body-parser');
var jade = require('jade');
var express = require('express');
var stormpath = require('express-stormpath');

/**
 * Create an Express Router, to contain our custom routes.
 */
var router = express.Router();

/**
 * Define the route for our homepage.
 */
router.get('/', function(req, res) {
  var html = jade.renderFile('views/index.jade');
  res.send(html);
});


router.get('/material-test', function(req, res) {
  var html = jade.renderFile('views/material-test.jade');
  res.send(html);
});

router.get('/stormpath', stormpath.getUser, function(req, res) {
  res.render('home');
});

/**
 * When someone visits /profile, render the profile form.
 */

router.get('/profile', stormpath.loginRequired, function(req, res) {
  res.render('profile');
});

/**
 * When someone posts the profile form, read the data and save it to the
 * custom data object on the account.  The body-parser library is used
 * for parsing the form data.
 */

router.post('/profile', bodyParser.urlencoded({extended: false}), stormpath.loginRequired, function(req, res, next) {
  for (var key in req.body) {
    req.user.customData[key] = req.body[key];
  }

  req.user.customData.save(function(err) {
    if (err) {
      return next(err);
    }
    res.render('profile');
  });
});

module.exports = router;
