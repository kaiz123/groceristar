'use strict';


const path      = require('path');
// var validator = require('express-validator');

let app    = require(path.resolve(__dirname, '../server'));
// var Video     = server.models.VideoModel;
// var Example   = server.models.ExampleModel;

// let middleware = require(path.resolve(__dirname, '../like-middleware-helper'));

exports.getHomepage = async (req, res, next) => {

      var ultimateGL = {};
      let admin
      try {

        var User = app.models.user;
        // var groceryId = req.params.groceryId;  

        // this is a duplicated code. :todo
        admin    = await User.findOne(User.queryUltimateAdmin());

        var json     = admin.toJSON();
        var ultimate = json.groceries[0];
        ultimateGL = {
          id: ultimate.id,
          name: ultimate.name
        };

        // console.log(data);

        res.render('pages/landing', {
          user: req.user,
          url : req.url,
          
          title: "Online Grocery Lists", //:todo

          ultimate: ultimateGL
          
        });

        
      } catch (e) {
        //this will eventually be handled by your error handling middleware
        next(e) 
      }

	

};

exports.getCreditsPage = function(req, res, next){
  console.log(req.user);



  res.render('pages/credits', {
    user        : req.user,
    url         : req.url,
    title: "Credits"
  });

};

exports.getPrivacyPage = function(req, res, next){
  console.log(req.url);
  console.log(req.user);
  res.render('pages/static/privacy', {
    user        : req.user,
    url         : req.url,
    title: "Privacy"
  });

};

exports.getTermsPage = function(req, res, next){
  console.log(req.user);
  res.render('pages/static/terms', {
    user        : req.user,
    url         : req.url,
    title: "Terms"
  });

};


// Fancy console.log
function output (err, data) {
  console.dir (err || data, {
    depth: null,
    colors: true
  });
}