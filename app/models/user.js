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

var Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true },
  avatar_url: String,
  github_id: String,

  profile: {
    name: String,
    gender: String,
    location: String
  }
}, { timestamps: true });

//Instance I created to replace the former.

// userSchema.statics.findOneOrCreate = function findOneOrCreate(condition, doc) {
//   const self = this;
//   const newDocument = doc;
//   return new Promise((resolve, reject) => {
//   return self.findOne(condition)
//   .then((result) => {
//   if (result) {
//   return resolve(result);
//   }
//   return self.create(newDocument)
//   .then((result) => {
//   return resolve(result);
//   }).catch((error) => {
//   return reject(error);
//   })
//   }).catch((error) => {
//   return reject(error);
//   })
//   });
//  };

const User = mongoose.model('User', userSchema);
module.exports = User;
