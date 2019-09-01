const Task = require('./../models/Task')
const AppError = require('./../util/AppError')

// filters needed completed=trueorfalse
// paginaton is done via limit and skip ?limit=10&skip=0 (if you skip0 then u are on page 1, if you skip 10 then you are on page 2)
// sort ?sortBy=createdAt:desc or asec
exports.getAllTasks = async (req, res, next) => {
  try {
    let filterObject = {}; let limit = 12; let skip = 0; let sortBy = { createdAt: 1 }
    // filter completed
    if (req.query.completed) {
      filterObject = { owner: req.user._id, completed: req.query.completed }
    } else {
      filterObject = { owner: req.user._id }
    }

    // pagination
    if (req.query.limit && req.query.skip) {
      limit = req.query.limit * 1
      skip = req.query.skip * 1
    }

    // sorting bu createdAT
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':')
      sortBy[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    const tasks = await Task.find(filterObject).populate('owner').limit(limit).skip(skip).sort(sortBy)
    res.json({
      tasks: tasks
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}

exports.createTask = async (req, res, next) => {
  try {
    const newTask = {
      description: req.body.description,
      completed: req.body.completed,
      owner: req.user._id
    }
    const taskNew = await Task.create(newTask)

    res.json({
      taskNew: taskNew
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}

exports.singleTask = async (req, res, next) => {
  try {
    if (!req.params.id) Error('id required to find any task')

    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id }).populate('owner')
    res.status(200).json({
      task: task
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}
exports.updateTask = async (req, res, next) => {
  try {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const validUpdatesOperations = updates.every(u => {
      return allowedUpdates.includes(u)
    })

    if (!validUpdatesOperations) throw Error('invalid updates inputs')

    if (!req.params.id) throw Error('id required to find any task')
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id }).populate('owner')
    updates.forEach(update => {
      // task.description = req.body.description
      task[update] = req.body[update]
    })

    const updatedTask = await task.save()

    res.status(200).json({
      updatedTask: updatedTask
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}

exports.deleteTask = async (req, res, next) => {
  try {
    if (!req.params.id) Error('id required to find any task')

    const task = await Task.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
    if (!task) throw Error('not done')
    res.status(202).json({
      message: 'deleted'
    })
  } catch (error) {
    const err = new AppError(error, 400)
    next(err)
  }
}
