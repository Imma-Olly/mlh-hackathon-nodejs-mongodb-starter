const GitHub = require("../services/github");

// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define(
//     "User",
//     {
//       username: { type: DataTypes.STRING, unqiue: true, allowNull: false },
//       avatar_url: DataTypes.STRING,
//       github_id: DataTypes.STRING
//     },
//     { sequelize }
//   );

//   User.associate = function(models) {
//     // associations can be defined here
//   };

//   User.find_or_create_from_token = async function(access_token) {
//     const data = await GitHub.get_user_from_token(access_token);

//     /* Find existing user or create new User instances */
//     const [instance, created] = await this.findOrCreate({
//       raw: true,
//       where: { username: data["login"] },
//       defaults: {
//         username: data["login"],
//         avatar_url: data["avatar_url"],
//         github_id: data["id"]
//       }
//     });

//     return instance;
//   };

//   return User;
// };
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  github: String,
  
  profile: {
    name: String,
    gender: String,
    location: String
  }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next) {
  const user = this;
  if (!user.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};



const User = mongoose.model('User', userSchema);

module.exports = User;
