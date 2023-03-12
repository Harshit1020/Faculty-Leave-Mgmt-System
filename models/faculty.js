var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var passportLocalMongoose = require("passport-local-mongoose");

var facultySchema = new mongoose.Schema({
  name: String,
  type: String,
  username: String,
  password: String,
  department: String,
  hostel: String,
  image: String,
  leaves: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave"
    }
  ]
});
facultySchema.plugin(passportLocalMongoose);
var Faculty = (module.exports = mongoose.model("Faculty", facultySchema));

module.exports.createFaculty = function(newFaculty, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newFaculty.password, salt, function(err, hash) {
      newFaculty.password = hash;
      newFaculty.save(callback);
    });
  });
};

module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  Faculty.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
  Faculty.findById(id, callback);
};

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, passwordFound) {
    if (err) throw err;
    callback(null, passwordFound);
  });
};
