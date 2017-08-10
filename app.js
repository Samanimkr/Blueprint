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
    expires: 6000000,//10mins if u remove one zero
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
    Project.find({owner: req.session.user}).sort({last_updated: -1}).exec(function(err, userProjects){
      res.render('dashboard', {
        title: "DevTracker - Home",
        user: result,
        projects: userProjects,
        stylesheet: "dashboard"
      });
    });
  })
});

app.get('/login', function(req, res){
  if(!req.session.user){ //if user isnt logged in
    res.render('login', {
      title: "DevTracker - Login",
      stylesheet: "login"
    });
  } else {
    res.redirect('/');
  }
});

app.get('/signup', function(req, res){
  if(!req.session.user){ //if user isnt logged in
    res.render('signup', {
      title: "DevTracker - Signup",
      stylesheet: "login"
    });
  } else {
    res.redirect('/');
  }
});

app.post('/login', (req, res) => {
  //could insert the validation checks here so i dont have to query the db
  //group all checks for email into one line : "Incorrect email address." and same for password
  var email = req.body.email.toLowerCase();
  var password = sha256(req.body.password);

  User.findOne({'email': email}, function(err, user){
    if(user == null) {
      console.log("Incorrect email address.");
      res.redirect('/login');
    } else if(password == user.password) { //login successful!
      var user_id = user._id;
      req.session.user = user_id;
      res.redirect('/');
    } else {
      console.log("Incorrect password.");
      res.redirect('/login');
    }
  });
});

app.post('/signup', (req, res) => {
  req.checkBody('first_name', '- First name field cannot be empty.').notEmpty();
  req.checkBody('last_name', '- Last name field cannot be empty.').notEmpty();
  req.checkBody('email', '- Email you entered is invalid.').isEmail();
  req.checkBody('email', '- Email must be 4-100 characters long.').len(4, 100);
  req.checkBody('password', '- Password must be 8-100 characters long.').len(8, 100);
  req.checkBody('passwordMatch', '- Passwords do not match').equals(req.body.password);



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
          res.render('signup', {
            errors: result.array(),
            stylesheet: "login"
          });
        });

    } else {
        res.render('signup', {
          errors: result.array(),
          stylesheet: "login"
        });
    }
  });
});

app.get('/project/:id', sessionChecker, function(req, res){
  Project.findOne({owner: req.session.user, _id: req.params.id}, function(err, project){
    if (project == null) {
      res.status(404).send("project doesn't exist!");
    } else{
      res.render('features', {
        project: project,
        stylesheet: "features"
      });
    }
  });
});

app.post('/addproject', function(req, res){
  var project = new Project({
    owner: req.session.user,
    name: req.body.projectName,
    colour: req.body.projectColour
  });
  project.save()
  .then((savedProject) => {
    res.redirect('/');
  }).catch((error) => {
    console.log(error);
  });
});

app.get('/project/:id/addfeature', sessionChecker, function(req, res){
  Project.findOne({owner: req.session.user, _id: req.params.id}, function(err, project){
    if (project == null) {
      res.status(404).send("project doesn't exist!");
    } else{
      res.render('feature-options', {
        project: project,
        stylesheet: "features"
      });
    }
  });
});

app.post('/project/:id/addfeature', sessionChecker, function(req, res){
  //PERFORM VALIDATION CHECKS ON ALL FIELDS! if all good then run code below

  Project.findOneAndUpdate({owner: req.session.user, _id: req.params.id},
    { last_updated: Date.now(),
      $push: { features: {
      title: req.body.title,
      description: req.body.description,
      tag: req.body.tag,
      status: req.body.status
    }
  }}, function(err, updatedProject){
    if (err) console.log(err);
    res.redirect('/project/'+updatedProject.id);
  });
});

function getCurrentUser(session, callback){
  User.findOne({'_id': session.user}, function(err, user){
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

var featureSchema = new Schema({
  title: String,
  description: String,
  colour: String,
  tag: String,
  status: String,
  isPinned: {type: Boolean, default: false}
});

var issueSchema = new Schema({
  title: String,
  description: String,
  status: String,
});

var projectSchema = new Schema({
  owner: {type: String, required: true},
  name: {type: String, required: true},
  colour: {type: String, default: "white"},
  last_updated: {type: Date, default: Date.now},
  date_created: {type: Date, default: Date.now},
  features: [featureSchema],
  issues: [issueSchema]
}, {collection: 'projects'});

var Project = mongoose.model('Project', projectSchema);
/*
var project = new Project({
  owner: "Owner id",
  name: "PName",
  features: [{
    title: "FTitle",
    description: "FDescription",
    colour: "FColour",
    tag: "Ftag",
    status: "FStatus",
    isPinned: false
  }],
  issues: [{
    title: "ETitle",
    description: "EDscription",
    status: "EStatus"
  }]
});
project.save()
.then((savedProject) => {
  console.log(savedProject);
}).catch((error) => { //c-heck this code again because it doesnt tell the user when the email has been duplicated
  console.log(error); //email duplication error code is 11000 (error.code)
});
*/
