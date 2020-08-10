const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  secretKey: process.env.SECRET_KEY || 'octocat',
  githubClientId: process.env.GITHUB_CLIENT_ID || '',
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
};

const http = require('http'); // For serving a basic web page.
const mongoose = require('mongoose'); // The reason for this demo.

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
const uristring = process.env.MONGOLAB_URI
|| process.env.MONGOHQ_URL
|| 'mongodb+srv://Imma:jaymijaymi2Mi@cluster0.j52nh.mongodb.net/mlh-hackathon-mongodb-starter';

// The http server will listen to an appropriate port, or default to
// port 5000.
const theport = process.env.PORT || 5000;

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, (err, res) => {
  if (err) {
    console.log(`ERROR connecting to: ${uristring}. ${err}`);
  } else {
    console.log(`Succeeded connected to: ${uristring}`);
  }
});
