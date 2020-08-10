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

// User.find_or_create_from_token = async function(access_token) {
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

// return User;

const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const GitHub = require('../services/github');

const { Schema } = mongoose;

const UserSchema = new Schema({
  username: { type: String, unique: true },
  avatar_url: String,
  github_id: String,
  access_token: String,

  profile: {
    name: String,
    gender: String,
    location: String,
  },
}, { timestamps: true });

UserSchema.plugin(findOrCreate);

const User = mongoose.model('User', UserSchema);

User.find_or_create_from_token = async (accessToken) => {
  const apiUser = await GitHub.get_user_from_token(accessToken);
  console.log('Github user: ', apiUser);
  const mongoUser = function () {
    User.findOrCreate({
      raw: true,
      where: { username: apiUser.login },
      defaults: {
        username: apiUser.login,
        avatar_url: apiUser.avatar_url,
        github_id: apiUser.id,
      },
      function(err, user) {
        if (err) {
          return done(err);
        }
      },
    });
  };

  return mongoUser;
};

module.exports = User;
