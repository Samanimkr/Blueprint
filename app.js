const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const MongoDBStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const path = require('path');
const favicon = require('serve-favicon');
const sha256 = require('sha256');

var DB_URL = "mongodb://localhost/devtracker";
var app = express();
mongoose.Promise = global.Promise;
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
  secret: 'znxbcuzxxiyekjnadc',
  store: store,
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true } //ENABLE when HTTPS is setup!!
}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars({defaultLayout: 'main'})); //View engine (Handlebars)
app.set( 'view engine', 'handlebars');

app.listen(8080, function(){
  console.log("server running on port 8080!");
});

app.get('/', authenticationMiddleware(), function(req, res){
  res.render('home', {
    title: "DevTracker - Home"
  });
});

app.get('/login', function(req, res){
  res.render('login', {
    title: "DevTracker - Login"
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
    if (result.isEmpty()){
        var user = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email.toLowerCase(),
          password: sha256(req.body.password)
        }

        var data = new User(user);
        data.save()
        .then((result) => {

          var user_id = result._id;
          req.login(user_id, function(err){
            res.redirect('/');
          });

        }).catch((error) => {
          console.log(error); //email duplication error code is 11000 (error.code)
        });

    } else {
        res.render('login', {errors: result.array()});
    }
  });
});

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});

function authenticationMiddleware() {
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}

//--------------------------------------MONGOOSE STUFF (MOVE TO SEPERATE FILE EVENTUALLY) ----------------------------------

var Schema = mongoose.Schema;

var userSchema = new Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true}
}, {collection: 'users'});

var User = mongoose.model('User', userSchema);
