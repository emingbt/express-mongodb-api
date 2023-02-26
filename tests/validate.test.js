const request = require('supertest')
const app = require('../app')

describe('Validate /auth/register', () => {
  it('empty name should return 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: 'example@example.com',
        password: '123456'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Name is required')
  })

  it('short name should return 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'te',
        email: 'example@example.com',
        password: '123456'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Name must be at least 3 characters long')
  })

  it('empty email should return 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test',
        password: '123456'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Email is required')
  })

  it('wrong email should return 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Emin',
        email: 'wrongemail',
        password: '123456'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Invalid email')
  })

  it('empty password should return 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test',
        email: 'exapmle@exapmle.com'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Password is required')
  })

  it('short password should return 400', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test',
        email: 'example@gmail.com',
        password: '123'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Password must be at least 6 characters long')
  })
})

describe('Validate /auth/login', () => {
  it('empty email should return 400', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        password: '123456'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Email is required')
  })

  it('wrong email should return 400', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'wrongemail',
        password: '123456'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Invalid email')
  })

  it('empty password should return 400', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'exapmle@exapmle.com'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Password is required')
  })

  it('short password should return 400', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'example@gmail.com',
        password: '123'
      })

    expect(res.statusCode).toEqual(400)
    expect(res.body).toHaveProperty('message')
    expect(res.body.message).toEqual('Password must be at least 6 characters long')
  })
})