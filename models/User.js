const mongoose = require('mongoose')
const Task = require('./Task')
const _validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'name is required'],
    unique: [true, 'name is already taken'],
    minlength: [3, 'min 3 chaaracter required'],
    maxlength: [15, 'max is 15 character']
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, 'email is required'],
    validate: {
      validator: function (val) {
        const check = _validator.isEmail(val)
        return check
      },
      message: 'invalid email'
    }
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    trim: true,
    minlength: [7, 'min 6 character long'],
    validate: {
      validator: function (val) {
        const check = !`${val}`.includes('password')

        return check
      },
      message: 'Invalid password it should not include "passsword" word '
    }
  },
  age: {
    type: Number,
    validate: {
      validator: function (value) {
        return value > 0
      },
      message: 'inValid age'
    }
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

// virtual properties are usually shows the relationship of data.

userSchema.virtual('tasks', {
  ref: 'Task', // reference modal name
  localField: '_id', // local field name on userSchema
  foreignField: 'owner' // field name that has a relationship with taskSchema/Task model
})

// instance methods use on instance of the model not on model!! and this represent instance in this case this = user
// toJSON will run before JSONSTRINGIFY means on each time we send the response which include user so we can change the data here and create a new object of user and delete the fields we dont want to send, this change will only effect to new obj not actaual data
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar
  return userObject
}
userSchema.methods.jsonWebTokenGenerator = async function () {
  const user = this

  const token = jwt.sign({ _id: `${user._id}`.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN })

  user.tokens.push({ token })
  await user.save()

  return token
}

// static functions directly call on Model not have any access to this

userSchema.statics.findByCredential = async function (email, password) {
  const user = await User.findOne({ email: email })
  if (!user) throw Error('invalid login')
  const passCheck = await bcrypt.compare(password, user.password)
  if (!passCheck) throw Error('invalid login')
  return user
}

// middleware mongoose run automatically on diffrent events pre or post

userSchema.pre('save', async function (next) {
  const user = this
  if (!user.isModified('password')) return next()

  const hashPass = await bcrypt.hash(user.password, 8)
  user.password = hashPass
  next()
})

userSchema.pre('remove', async function (next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
