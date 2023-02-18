const mongoose = require('mongoose')

const mongoConnectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/mongodb'

mongoose.set('strictQuery', true)

mongoose.connect(mongoConnectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.error('Could not connect to MongoDB...', err)
  })