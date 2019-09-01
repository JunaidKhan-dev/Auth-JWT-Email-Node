const User = require('./../models/User')
const AppError = require('./../util/AppError')
const { sendWelcomeEmail, sendByeEmail } = require('./../util/emails/account')

exports.getMe = async (req, res, next) => {
  try {
    res.json({
      user: req.user
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}

exports.createUser = async (req, res, next) => {
  try {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      age: req.body.age
    }
    const userNew = await User.create(newUser)
    const token = await userNew.jsonWebTokenGenerator()
    sendWelcomeEmail(userNew.email, userNew.name)
    res.status(201).json({
      userNew: userNew,
      token: token
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'password', 'email']
    const isValidOperartion = updates.every((u) => {
      return allowedUpdates.includes(u)
    })
    if (!isValidOperartion) throw Error('invalid updates value')

    // const updatedNew = await User.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true })
    const user = req.user
    updates.forEach(update => {
      user[update] = req.body[update]
    })
    const updatedNew = await user.save()

    if (!updatedNew) throw Error('User not found')
    res.status(201).json({
      updatedNew: updatedNew
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    await user.remove()

    sendByeEmail(user.email, user.name)
    res.status(202).json({
      message: 'deleted'
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}
