const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/', async (req, res) => {
  const users = await User.find({})

  res.render('users', { title: 'Users', users })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id)

  if (user) res.render('user', { title: 'User', user })
  else res.status(404).send({ message: "User doesn't exist" })
})

router.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createdUser = await User.create({
    name,
    email,
    password
  })

  res.status(200).send(createdUser)
})

router.put('/:id/:property', async (req, res) => {
  const { id, property } = req.params;
  const { value } = req.body;

  const user = await User.findById(id)
  if (!user) res.status(404).send({ message: "User doesn't exist" })

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
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete(id)
  if (deletedUser) res.status(200).send(deletedUser)
  else res.status(404).send({ message: "User doesn't exist" })
})

module.exports = router;