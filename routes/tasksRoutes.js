const express = require('express')
const router = express.Router()
const { auth } = require('./../controllers/authController')
const { getAllTasks, createTask, singleTask,
  updateTask, deleteTask } = require('./../controllers/tasksController')

router.route('/:id')
  .get(auth, singleTask)
  .patch(auth, updateTask)
  .delete(auth, deleteTask)

router.route('/')
  .get(auth, getAllTasks)
  .post(auth, createTask)

module.exports = router
