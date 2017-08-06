const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const favicon = require('serve-favicon');

const mongoose = require("./lib/db");

var app = express();

app.use(express.static(__dirname));
app.use(favicon(path.join(__dirname,'public','favi.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressValidator());
app.use(session({
  key: 'user_sid',
  secret: 'znxbcuzxxiyekjnadc',
  store: new MongoDBStore({uri: mongoose.DB_URL, collection: 'sessions'}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000,//10mins
    // secure: true //ENABLE when HTTPS is setup!!
  }
}));
// app.use(function(req, res, next){
//   res.locals.LoggedIn =  (req.session.user && req.cookies.user_sid) ? true : false;
//   next();
// });

app.engine('handlebars', handlebars({defaultLayout: 'main'})); //View engine (Handlebars)
app.set( 'view engine', 'handlebars');

app.listen(8080, function(){
  console.log("server running on port 8080!");
});

require("./routes/index.js")(app, mongoose);
require("./routes/login.js")(app, mongoose);
