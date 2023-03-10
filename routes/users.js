const express = require('express')
const router = express.Router()

const User = require('../models/user')

router.get('/', async (req, res) => {
  const users = await User.find({})

  res.status(200).send(users)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)

  if (user) return res.status(200).send(user)
  res.status(404).send({ message: "User doesn't exist" })
})

module.exports = router