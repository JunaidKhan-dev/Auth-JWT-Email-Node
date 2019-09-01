const path = require('path')
const app = require('./app')
const mongoose = require('mongoose')

let DB = process.env.DB_ONLINE

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('Connected to MongoDB')
}).catch(err => console.log('not connect to mongodb', err))

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(' this server os running at port:', port)
})
