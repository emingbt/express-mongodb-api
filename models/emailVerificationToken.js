const mongoose = require('mongoose')

const EmailVerificationTokenSchema = new mongoose.Schema({
  verificationToken: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  expirationDate: {
    type: Date,
    required: true
  }
})

const EmailVerificationToken = mongoose.model('emailVerificationToken', EmailVerificationTokenSchema)
module.exports = EmailVerificationToken