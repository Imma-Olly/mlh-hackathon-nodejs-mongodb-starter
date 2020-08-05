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

const mongoose = require('mongoose');
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


const User = mongoose.model('User', UserSchema);
User.find_or_create_from_token = async (access_token) => {
  const apiUser = await GitHub.get_user_from_token(access_token);
  // console.log('Github user: ', apiUser);
  if (apiUser.login) {
    // const mongoUser = User.findbyLogin(apiUser.login);
    if (mongoUser)
      return mongoUser;

    return User.create({
      username: apiUser["login"],
      avatar_url: apiUser["avatar_url"],
      github_id: apiUser["id"]         
    });


   
  } else {
    console.log('Bad response from Github')
  }
};

module.exports = User;

// userSchema.statics.findUser = async function (access_token) {
//   const data = await GitHub.get_user_from_token(access_token);
//   const user = await this.findOne({username, github_id:{}});
//   return !!user;

// };
