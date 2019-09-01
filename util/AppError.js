
class AppError extends Error {
  constructor (message, statusCode) {
    super(message)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.statusCode = statusCode || 500
    this.stack = Error.captureStackTrace(this, this.constructor)
    this.isOperational = true
  }
}

module.exports = AppError
