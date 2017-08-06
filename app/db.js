module.exports = () => {
  var Schema = mongoose.Schema;

  var userSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    date_created: {type: Date, default: Date.now},
  }, {collection: 'users'});

  var User = mongoose.model('User', userSchema);
}
