module.exports = function(app){

  require('./login');
  require('../lib/db');

  app.get('/', function(req, res){
    getCurrentUser(req.session, function(result){
      res.render('home', {
        title: "DevTracker - Home",
        user: result
      });
    })
  });


  // middleware function to check for logged-in users
  var sessionChecker = (req, res, next) => {
      if (!req.session.user || !req.cookies.user_sid) {
          res.redirect('/login');
      } else {
          next();
      }
  }

  //function to get the currently logged in user's details from db
  function getCurrentUser(session, callback){
    User.findOne({'_id': session.user}, function(err, user){
      console.log("c1-----" + user);
      callback(user);
    });
  }


}
