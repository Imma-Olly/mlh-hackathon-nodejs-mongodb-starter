const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const axios = require('axios');
const { Strategy: GitHubStrategy } = require('passport-github2');
const { Strategy: OpenIDStrategy } = require('passport-openid');
const { OAuthStrategy } = require('passport-oauth');
const { OAuth2Strategy } = require('passport-oauth');
const _ = require('lodash');
const moment = require('moment');

const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// /*
//  * OAuth Strategy Overview
//  *
//  * - User is already logged in.
//  *   - Check if there is an existing account with a provider id.
//  *     - If there is, return an error message. (Account merging not supported)
//  *     - Else link new OAuth account with currently logged-in user.
//  * - User is not logged in.
//  *   - Check if it's a returning user.
//  *     - If returning user, sign in and we are done.
//  *     - Else check if there is an existing account with user's email.
//  *       - If there is, return an error message.
//  *       - Else create a new account.
//  */

// */

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
    passReqToCallback: true,
    scope: ['user:email']
  }, (req, accessToken, refreshToken, profile, done) => {
    if (req.user) {
      User.findOne({ github: profile.id }, (err, existingUser) => {
        if (existingUser) {
          req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
          done(err);
        } else {
          User.findById(req.user.id, (err, user) => {
            if (err) { return done(err); }
            user.github = profile.id;
            user.tokens.push({ kind: 'github', accessToken });
            user.profile.name = user.profile.name || profile.displayName;
            user.profile.picture = user.profile.picture || profile._json.avatar_url;
            user.profile.location = user.profile.location || profile._json.location;
            user.profile.website = user.profile.website || profile._json.blog;
            user.save((err) => {
              req.flash('info', { msg: 'GitHub account has been linked.' });
              done(err, user);
            });
          });
        }
      });
    } else {
      User.findOne({ github: profile.id }, (err, existingUser) => {
        if (err) { return done(err); }
        if (existingUser) {
          return done(null, existingUser);
        }
        User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
          if (err) { return done(err); }
          if (existingEmailUser) {
            req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
            done(err);
          } else {
            const user = new User();
            user.email = _.get(_.orderBy(profile.emails, ['primary', 'verified'], ['desc', 'desc']), [0, 'value'], null);
            user.github = profile.id;
            user.tokens.push({ kind: 'github', accessToken });
            user.profile.name = profile.displayName;
            user.profile.picture = profile._json.avatar_url;
            user.profile.location = profile._json.location;
            user.profile.website = profile._json.blog;
            user.save((err) => {
              done(err, user);
            });
          }
        });
      });
    }
  }));

 