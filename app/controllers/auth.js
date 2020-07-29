const express = require("express");
const models = require("../models");
const config = require("../../config");
const GitHub = require("../services/github");
const controllers = require("../controllers");
const router = express.Router();


router.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/login/github', (req, res) => {
  const github = new GitHub({ clientId: config.githubClientId, clientSecret: config.githubClientSecret });
  res.redirect(github.authorizationUrl('public_repo'));
});

router.get('/callback/github', async (req, res) => {
  if (!req.query.code) {
    return res.render('500');
  }

  // Fetch user from GitHub OAuth and store in session
  const github = new GitHub({ clientId: config.githubClientId, clientSecret: config.githubClientSecret });
  const accessToken = await github.getToken(req.query.code);

  console.log("Access token: " + access_token);

  if (!access_token) {
    return res.render("404");
  }

 const user = await models.userSchema.statics.findOneOrCreate(access_token);

  req.session.access_token = access_token;
  req.session.user = user;

  return res.redirect('/');
});

module.exports = router;
