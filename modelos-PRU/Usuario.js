const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  firstName: String,
  lastName: String,
  role: { type: String, default: 'user' }
});
const Usuario = mongoose.model('User', UserSchema);
module.exports = Usuario;
