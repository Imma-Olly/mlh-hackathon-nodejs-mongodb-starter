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

  // User.associate = function(models) {
  //   // associations can be defined here
  // };

 //User.find_or_create_from_token = async function(access_token) {
//   const data = await GitHub.get_user_from_token(access_token);

//   /* Find existing user or create new User instances */
//   const [instance, created] = await this.findOrCreate({
//     raw: true,
//     where: { username: data["login"] },
//     defaults: {
//       username: data["login"],
//       avatar_url: data["avatar_url"],
//       github_id: data["id"]
//     }
//   });

//   return instance;
// };

//return User;

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
//const findOrCreate = require('mongoose-find-or-create')
var findOrCreate = require('mongoose-findorcreate')
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, unique: true },
  avatar_url: String,
  github_id: String,
  access_token: String,

  profile: {
    name: String,
    gender: String,
    location: String
  }
}, { timestamps: true });


module.exports = User = mongoose.model('User', UserSchema);

const User = mongoose.model('users', userSchema);
User.find_or_create_from_token = async (access_token) => {
  const user = await Github.findById(access_token);
  if (!user) {
    User.create({ name: 'username' }, 
    {_id:  'github_id'}, 
    {token: 'access_token'}, 
    {_url: 'avatar_url'}, function (err) {
      if (err) return handleError(err);
      // saved!
    });
  }
};


// userSchema.statics.findUser = async function (access_token) {
//   const data = await GitHub.get_user_from_token(access_token);
//   const user = await this.findOne({username, github_id:{}});
//   return !!user;

// };
