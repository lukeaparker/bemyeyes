/* Mongoose Connection */
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(
  'mongodb://localhost/bemyeyes',
  { useNewUrlParser: true }
)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection Error:'))

mongoose.set('debug', true)

module.exports = mongoose.connection