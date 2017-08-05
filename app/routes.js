module.exports = (app) => {

  app.get('/login', function(req, res){
    if(!req.session.user){ //if user isnt logged in
      res.render('login', {
        title: "DevTracker - Login"
        //state: login or signup
      });
    } else {
      res.redirect('/');
    }
  });

  app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/login');
  });

  app.get('/', sessionChecker, function(req, res){
    getCurrentUser(req.session, function(result){
      res.render('home', {
        title: "DevTracker - Home",
        user: result
      });
    })
  });


}
