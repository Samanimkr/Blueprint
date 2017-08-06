const sha256 = require('sha256');

module.exports = function(app){

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

  app.post('/login', (req, res) => {
    var email = req.body.email.toLowerCase();
    var password = sha256(req.body.password);
    //could insert the validation checks here so i dont have to query the db
    //group all checks for email into one line : "Incorrect email address." and same for password
    User.findOne({'email': email}, function(err, user){
      if(user == null) {
        console.log("Incorrect email address.");
        res.render('login');
      } else if(password == user.password) { //login successful!
        var user_id = user._id;
        req.session.user = user_id;
        res.redirect('/');
      } else {
        console.log("Incorrect password.");
        res.render('login');
      }
    });
  });

  app.post('/signup', (req, res) => {
    req.checkBody('first_name', 'First name field cannot be empty.').notEmpty();
    req.checkBody('last_name', 'Last name field cannot be empty.').notEmpty();
    req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
    req.checkBody('email', 'Email address must be between 4-100 characters long, please try again.').len(4, 100);
    req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

    req.getValidationResult().then(function(result) {
      if (result.isEmpty()){ //if no errors then save new user else output validation errors
          var user = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email.toLowerCase(),
            password: sha256(req.body.password)
          }
          var data = new User(user);
          data.save()
          .then((savedUser) => {
            var user_id = savedUser._id;
            req.session.user = user_id;
            res.redirect('/');
          }).catch((error) => { //check this code again because it doesnt tell the user when the email has been duplicated
            console.log(error.code); //email duplication error code is 11000 (error.code)
            if(error.code == 11000){
              result.array().push("Email address has already been taken.");
              console.log("read: " + result.array());
            }
            res.render('login', {errors: result.array()});
          });

      } else {
          res.render('login', {errors: result.array()});
      }
    });
  });

}
