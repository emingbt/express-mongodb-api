const request = require('supertest')
const app = require('../app')

describe('Auth', () => {
  jest.setTimeout(10000)

  let user = {
    id: '',
    name: 'Emin',
    email: 'mehmet.e.gbt@gmail.com',
    password: '123456'
  }
  let token = ''

  describe('POST /register', () => {
    it('should return 201', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: user.name,
          email: user.email,
          password: user.password
        })

      expect(res.statusCode).toEqual(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body.data).toHaveProperty('user')
      expect(res.body.data.user).toHaveProperty('_id')
      expect(res.body.data.user).toHaveProperty('name')
      expect(res.body.data.user).toHaveProperty('email')
      expect(res.body.data.user).toHaveProperty('isEmailVerified')
      expect(res.body.data.user.name).toEqual(user.name)
      expect(res.body.data.user.email).toEqual(user.email)
      expect(res.body.data.user.password).toEqual(undefined)

      user.id = res.body.data.user._id
      token = res.body.token
    })

    it('should return 400', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          name: user.name,
          email: user.email,
          password: user.password
        })

      expect(res.statusCode).toEqual(400)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('There is a user exist with this email')
    })
  })

  // describe('GET /verify-email', () => {
  //   it('should return 200', async () => {
  //     const res = await request(app)
  //       .get(`/auth/verify-email/${user.id}`)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send()

  //     expect(res.statusCode).toEqual(200)
  //     expect(res.body).toHaveProperty('message')
  //     expect(res.body.message).toEqual('Email verified successfully')
  //   })

  //   it('should return 400', async () => {
  //     const res = await request(app)
  //       .get(`/auth/verify-email/${user.id}`)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send()

  //     expect(res.statusCode).toEqual(400)
  //     expect(res.body).toHaveProperty('message')
  //     expect(res.body.message).toEqual('Email already verified')
  //   })
  // })

  describe('POST /logout', () => {
    it('should return 200', async () => {
      console.log('asdas', token, 'token')
      const res = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Logged out successfully')
    })

    it('should return 401', async () => {
      const res = await request(app)
        .post('/auth/logout')

      expect(res.statusCode).toEqual(401)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Unauthorized')
    })

    it('should return 401', async () => {
      const res = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer wrongtoken`)

      expect(res.statusCode).toEqual(403)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Invalid Token')
    })
  })

  describe('POST /login', () => {
    it('should return 200', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: user.email,
          password: user.password
        })

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('token')
      expect(res.body.data).toHaveProperty('user')
      expect(res.body.data.user).toHaveProperty('_id')
      expect(res.body.data.user).toHaveProperty('name')
      expect(res.body.data.user).toHaveProperty('email')
      expect(res.body.data.user).toHaveProperty('isEmailVerified')

      expect(res.body.data.user.name).toEqual(user.name)
      expect(res.body.data.user.email).toEqual(user.email)

      token = res.body.token
      user.id = res.body.data.user.id
    })

    it('should return 401', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: user.email,
          password: 'wrongpassword'
        })

      expect(res.statusCode).toEqual(401)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Incorrect password')
    })

    it('should return 401', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong_email@example.comm',
          password: user.password
        })

      expect(res.statusCode).toEqual(401)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual("There isn't any user with this email")
    })
  })

  describe('GET /me', () => {
    it('should return 200', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('name')
      expect(res.body).toHaveProperty('email')
      expect(res.body).toHaveProperty('isEmailVerified')

      expect(res.body.name).toEqual(user.name)
      expect(res.body.email).toEqual(user.email)
    })

    it('should return 401', async () => {
      const res = await request(app)
        .get('/auth/me')

      expect(res.statusCode).toEqual(401)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Unauthorized')
    })

    it('should return 403', async () => {
      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer wrongtoken`)

      expect(res.statusCode).toEqual(403)
      expect(res.body).toHaveProperty('message')
      expect(res.body.message).toEqual('Invalid Token')
    })
  })
})