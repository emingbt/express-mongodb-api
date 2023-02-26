const jwt = require('jsonwebtoken')

const signtoken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

const createSendToken = (user, statusCode, res) => {
  const token = signtoken(user._id)

  cookieOptions = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4), // 4 weeks
    httpOnly: true
  }

  cookieOptions.secure = process.env.NODE_ENV === 'production' ? true : false

  res.cookie('jwt', token, cookieOptions)

  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  })
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.status(401).send({ message: 'Unauthorized' })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid Token' })
    }

    req.user = user

    next()
  })
}

module.exports = { signtoken, createSendToken, authenticateToken }