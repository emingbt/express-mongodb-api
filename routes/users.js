const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { nanoid } = require("nanoid")
const transporter = require('../nodemailer-config')

const User = require('../models/user')
const EmailVerificationToken = require('../models/emailVerificationToken')

router.get('/', async (req, res) => {
  const users = await User.find({})

  res.render('users', { title: 'Users', users })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)

  if (user) res.render('user', { title: 'User', user })
  else res.status(404).send({ message: "User doesn't exist" })
})

router.post('/', async (req, res) => {
  const salt = await bcrypt.genSalt(10)
  const { name, email, password } = req.body

  const createdUser = await User.create({
    name: name,
    email: email,
    password: await bcrypt.hash(password, salt)
  })

  const emailVerificationToken = await EmailVerificationToken.create({
    token: nanoid(6),
    user: createdUser._id,
    expirationDate: Date.now() + 3600000
  })

  const verificationUrl = `http://localhost:3000/verify/${emailVerificationToken.token}`

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
})

router.put('/:id/:property', async (req, res) => {
  const { id, property } = req.params
  const { value } = req.body

  const user = await User.findById(id)
  if (!user) return res.status(404).send({ message: "User doesn't exist" })

  const userProperties = Object.keys(user._doc)

  if (userProperties.includes(property)) {
    user[property] = value
    await user.save()
    res.status(200).send(user)
  } else {
    res.status(404).send({ message: "User doesn't have this property" })
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params

  const deletedUser = await User.findByIdAndDelete(id)
  if (deletedUser) res.status(200).send(deletedUser)
  else res.status(404).send({ message: "User doesn't exist" })
})

module.exports = router