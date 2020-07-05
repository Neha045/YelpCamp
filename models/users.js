var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
	username: {type: String, unique: true, required: true},
	password : String,
	 isAdmin: {type: Boolean, default: false},
	avatar: String,
	firstname: String,
	lastname: String,
	email: String,
	 email: {type: String, unique: true, required: true},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);