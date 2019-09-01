const express = require('express')
const router = express.Router()
const { uploadAvatar, upload, deleteAvatar, getAvatar } = require('./../util/uploadAvatar')

const { getMe, createUser,
  updateUser, deleteUser } = require('./../controllers/usersController')
const { userLogin, auth, logout, logoutAllOut } = require('./../controllers/authController')

router.post('/login', userLogin)
router.post('/logout', auth, logout)
router.post('/logoutall', auth, logoutAllOut)
router.get('/me/:id/avatar', getAvatar)

router.route('/me/avatar')
  .post(auth, upload.single('avatar'), uploadAvatar)
  .delete(auth, deleteAvatar)

router.route('/me')
  .get(auth, getMe)
  .delete(auth, deleteUser)
  .patch(auth, updateUser)

router.route('/')
  .get(auth, getMe)
  .post(createUser)

module.exports = router
