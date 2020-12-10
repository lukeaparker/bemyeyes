require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
var cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const serverless = require('serverless-http')


app.use(cookieParser()); // Add this after you initialize express.

app.use(express.static('public'))

// db
require('./data/reddit-db')

// set db
const exphbs = require('express-handlebars')

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')


var checkAuth = (req, res, next) => {
  console.log("Checking authentication");
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.user = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }

  next()
}

app.use(checkAuth);

// routes
require('./controllers/tickets.js')(app)

require('./controllers/evaluations.js')(app)

require('./controllers/auth.js')(app)

require('./controllers/landing.js')(app)



// Start Server
app.listen(3000, () => {
  console.log('Bemyeyes listening on port localhost:3000!');
});

module.exports = app
module.exports.handler = serverless(app)