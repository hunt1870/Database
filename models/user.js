var mongoose = require('mongoose');
var passpordLocalMongoose = require('passport-local-mongoose');

var userSchema = mongoose.Schema({
    username : String,
    password : String,
    roll_no  : Number,
    city : String,
    phone_no : Number
});
userSchema.plugin(passpordLocalMongoose);
module.exports = mongoose.model("user", userSchema);;
