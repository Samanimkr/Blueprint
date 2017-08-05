const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const favicon = require('serve-favicon');
const sha256 = require('sha256');

var DB_URL = "mongodb://localhost/devtracker";
var app = express();
mongoose.Promise = global.Promise; //this is very slow so change to bluebird for example
mongoose.connect(DB_URL, { useMongoClient: true });
// mongoose.connection.openUri('mongodb://localhost/devtracker'); use this if deprecated msg comes up again
var store = new MongoDBStore({
  uri: DB_URL,
  collection: 'sessions'
});
// Catch errors
store.on('error', function(error) {
  if (error) console.log(error);
});

app.use(express.static(__dirname));
app.use(favicon(path.join(__dirname,'public','favi.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator());
app.use(session({
  key: 'user_sid',
  secret: 'znxbcuzxxiyekjnadc',
  store: store,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,//10mins
    // secure: true //ENABLE when HTTPS is setup!!
  }
}));
app.use(function(req, res, next){
  res.locals.LoggedIn =  (req.session.user && req.cookies.user_sid) ? true : false;
  next();
});

app.engine('handlebars', handlebars({defaultLayout: 'main'})); //View engine (Handlebars)
app.set( 'view engine', 'handlebars');

app.listen(8080, function(){
  console.log("server running on port 8080!");
});

// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (!req.session.user || !req.cookies.user_sid) {
        res.redirect('/login');
    } else {
        next();
    }
};

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

function getCurrentUser(session, callback){
  User.findOne({'_id': session.user}, function(err, user){
    console.log("c1-----" + user);
    callback(user);
  });
}

//--------------------------------------MONGOOSE STUFF (MOVE TO SEPERATE FILE EVENTUALLY) ----------------------------------

var Schema = mongoose.Schema;

var userSchema = new Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  date_created: {type: Date, default: Date.now},
}, {collection: 'users'});

var User = mongoose.model('User', userSchema);
