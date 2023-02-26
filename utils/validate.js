const { z } = require('zod')

const Schemas = {
  register: z.object({
    name: z.string({ required_error: 'Name is required' }).min(3, { message: 'Name must be at least 3 characters long' }),
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters long' })
  }),
  login: z.object({
    email: z.string({ required_error: 'Email is required', }).email(),
    password: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be at least 6 characters long' })
  })
}

const validate = (schema) => (req, res, next) => {
  try {
    Schemas[schema].parse(req.body)
    next()
  } catch (err) {
    res.status(400).send({ message: err.errors[0].message })
  }
}

module.exports = { validate }