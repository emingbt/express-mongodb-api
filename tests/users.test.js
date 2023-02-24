const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')

require('dotenv').config()

const mongoConnectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/mongodb'

mongoose.set('strictQuery', true)

beforeEach(async () => {
  await mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
})

afterEach(async () => {
  await mongoose.connection.close()
})

describe('GET /users', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/users')
    expect(res.status).toBe(200)
  })
})

describe('GET /users/:id', () => {
  it('should return 200', async () => {
    const res = await request(app).get('/users/63ecc72aebc24c74beba392a')
    expect(res.status).toBe(200)
  })

  it('should return 404', async () => {
    const res = await request(app).get('/users/5f5c3b5a5a5a5a5a5a5a5a5a')
    expect(res.status).toBe(404)
  })
})