const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { nanoid } = require('nanoid')
const transporter = require('../nodemailer-config')
const jwt = require('jsonwebtoken')

const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken')

const signtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

const createSendToken = (user, statusCode, res) => {
  const token = signtoken(user._id)

  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  const createdUser = await User.create({
    name: name,
    email: email,
    password: await bcrypt.hash(password, 10)
  })

  const emailVerificationToken = await EmailVerificationToken.create({
    verificationToken: nanoid(),
    user: createdUser._id,
    expirationDate: Date.now() + 3600000
  })

  const verificationUrl = `http://localhost:3000/auth/verifyEmail?emailVerificationToken=${emailVerificationToken.verificationToken}`

  const mailOptions = {
    from: process.env.EMAIL,
    to: createdUser.email,
    subject: 'Email Verification',
    html: `<p>Please click on the link below to verify your email address:</p><a href="${verificationUrl}">${verificationUrl}</a>`
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err)
      res.status(500).send({ message: 'An error occured while sending email' })
    }
    else {
      console.log(info)
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

    user.isEmailVerified = true
    await user.save()

    res.status(200).send({ message: 'Email verified successfully' })
  } catch (err) {
    res.status(401).send({ message: 'Invalid token' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email })

  if (!user) {
    res.status(401).send({ message: "There isn't any user with this email" })
  }

  if (await bcrypt.compare(password, user.password)) {
    createSendToken(user, 200, res)
  } else {
    res.status(401).send({ message: 'Incorrect password' })
  }
})

router.get('/me', async (req, res) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403)

    const foundUser = await User.findById(user.id)

    res.json(foundUser)
  })
})

module.exports = router