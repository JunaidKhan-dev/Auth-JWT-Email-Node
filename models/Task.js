const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'name is required'],
    minlength: [3, 'min 3 chaaracter required']
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task
