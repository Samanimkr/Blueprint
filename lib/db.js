module.exports = () => {
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var DB_URL = "mongodb://localhost/devtracker";
  mongoose.Promise = global.Promise; //this is very slow so change to bluebird for example
  mongoose.connect(DB_URL, { useMongoClient: true });
  // mongoose.connection.openUri('mongodb://localhost/devtracker'); use this if deprecated msg comes up again

  var userSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    date_created: {type: Date, default: Date.now},
  }, {collection: 'users'});

  var User = mongoose.model('User', userSchema);

}
