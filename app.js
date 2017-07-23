const express = require('express');
const handlebars = require('express-handlebars');
const redis = require('redis');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const favicon = require('serve-favicon');

var app = express();
var client = redis.createClient();

client.on('connect', function(){
  console.log("Connected to redis!");
});

app.use(express.static(path.join(__dirname, '/public')));
app.use(favicon(path.join(__dirname,'public','favi.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

app.engine('handlebars', handlebars({defaultLayout: 'main'})); //View engine (Handlebars)
app.set( 'view engine', 'handlebars');

app.listen(8080, function(){
  console.log("server running on port 8080!");
});

app.get('/', function(req, res){
  res.render('home', {
    title: "DevTracker - Home"
  });
});
