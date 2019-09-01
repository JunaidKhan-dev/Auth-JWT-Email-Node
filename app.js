const express = require('express')
const app = express()
const morgan = require('morgan')
const usersRouter = require('./routes/usersRoutes')
const tasksRouter = require('./routes/tasksRoutes')
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
// global middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// maintenance mood
app.use((req, res, next) => {
  console.log(process.env.MAINTENANCE)
  if (process.env.MAINTENANCE) return res.send('MAINTENANCE Mode ON')

  next()
})
// routes
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/tasks', tasksRouter)

// wild route handler

app.use('*', (req, res, next) => {
  res.json({
    status: 'fail',
    message: 'The route not found on this server'
  })
})

// global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err
  })
})

module.exports = app
