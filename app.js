const express = require('express')
const app = express()
const morgan = require('morgan')
const usersRouter = require('./routes/usersRoutes')
const tasksRouter = require('./routes/tasksRoutes')

// global middleware
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

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
