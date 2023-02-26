const transporter = require('../nodemailer-config')
const pug = require('pug')
const path = require('path')
const { nanoid } = require('nanoid')

const EmailVerificationToken = require('../models/emailVerificationToken')

const sendVerificationEmail = async (user) => {
  const emailVerificationToken = await EmailVerificationToken.create({
    verificationToken: nanoid(),
    user: user._id,
    expirationDate: new Date(Date.now() + 3600000) // 1 hour
  })

  const verificationUrl = `http://localhost:3000/auth/verifyEmail?emailVerificationToken=${emailVerificationToken.verificationToken}`

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Email Verification',
    html: pug.renderFile(
      path.join(__dirname, '../views/emailVerification.pug'), {
      name: user.name,
      verificationUrl: verificationUrl
    })
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
      res.status(500).send({ message: 'An error occured while sending email' })
    }
    else {
      res.status(200).send({ message: 'Email sent successfully' })
    }
  })
}

module.exports = { sendVerificationEmail }