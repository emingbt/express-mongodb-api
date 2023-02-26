const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { nanoid } = require('nanoid')
const transporter = require('../nodemailer-config')
const pug = require('pug')
const path = require('path')

const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken')

const { validate } = require('../utils/validate')
const { createSendToken, authenticateToken } = require('../utils/auth')

router.post('/register', validate('register'), async (req, res) => {
  const { name, email, password } = req.body

  const user = await User.findOne({ email: email })

  if (user) {
    return res.status(400).send({ message: 'There is a user exist with this email' })
  }

  const createdUser = await User.create({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 10)
  })

  const emailVerificationToken = await EmailVerificationToken.create({
    verificationToken: nanoid(),
    user: createdUser._id,
    expirationDate: new Date(Date.now() + 3600000) // 1 hour
  })

  const verificationUrl = `http://localhost:3000/auth/verifyEmail?emailVerificationToken=${emailVerificationToken.verificationToken}`

  const mailOptions = {
    from: process.env.EMAIL,
    to: createdUser.email,
    subject: 'Email Verification',
    html: pug.renderFile(
      path.join(__dirname, '../views/emailVerification.pug'), {
      name: createdUser.name,
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

  createSendToken(createdUser, 201, res)
})

router.get('/verifyEmail', async (req, res) => {
  const { emailVerificationToken } = req.query

  const token = await EmailVerificationToken.findOne({
    verificationToken: emailVerificationToken
  })

  try {

    const user = await User.findById(token.user)

    if (user.isEmailVerified) {
      return res.status(400).send({ message: 'Email already verified' })
    }

    user.isEmailVerified = true

    await token.delete()
    await user.save()

    res.status(200).send({ message: 'Email verified successfully' })
  } catch (err) {
    res.status(401).send({ message: 'Invalid token' })
  }
})

router.post('/login', validate('login'), async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email })

  if (!user) {
    return res.status(401).send({ message: "There isn't any user with this email" })
  }

  if (await bcrypt.compare(password, user.password)) {
    createSendToken(user, 200, res)
  } else {
    res.status(401).send({ message: 'Incorrect password' })
  }
})

router.get('/me', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id)

  user.password = undefined

  res.status(200).send(user)
})

router.post('/logout', authenticateToken, (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1000 * 10),
    httpOnly: true
  })

  res.status(200).send({ message: 'Logged out successfully' })
})

module.exports = router