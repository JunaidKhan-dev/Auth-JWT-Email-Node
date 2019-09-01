const User = require('./../models/User')
const AppError = require('./../util/AppError')
const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) throw Error('Authentication Fail')

    const token = req.header('Authorization').replace('Bearer ', '')
    const decodeJwt = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decodeJwt._id, 'tokens.token': token })
    if (!user) throw Error('Authentication Fail')

    req.token = token
    req.user = user
    next()
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}

exports.userLogin = async (req, res, next) => {
  try {
    const user = await User.findByCredential(req.body.email, req.body.password)
    if (!user) return Error('invalid login')
    const token = await user.jsonWebTokenGenerator()

    res.status(200).json({
      user: user,
      token: token
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}

exports.logout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}

exports.logoutAllOut = async (req, res, next) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}
