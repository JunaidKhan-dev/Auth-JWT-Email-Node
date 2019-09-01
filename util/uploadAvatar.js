const multer = require('multer')
const AppError = require('./AppError')
const User = require('./../models/User')
const sharp = require('sharp')
exports.upload = multer({
  // dest: 'avatars', // use this for outside database storage else buffer data will come inside req.file object
  limits: { fileSize: 1024 * 1024 },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new AppError('file must be a jpg, jpeg or png'))
    }

    return cb(undefined, true)
    // cb(new Error('file must be a pdf'))
  }
})

exports.uploadAvatar = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer()
    req.user.avatar = buffer
    // req.user.avatar = req.file.buffer // without using sharp
    await req.user.save()
    res.send({
      message: 'uploaded'
    })
  } catch (error) {
    throw new AppError('upload fail file is larger or wrong format', 500)
  }
}

exports.deleteAvatar = async (req, res) => {
  try {
    req.user.avatar = undefined
    await req.user.save()
    res.send({
      message: 'deleted'
    })
  } catch (error) {
    throw new AppError('upload fail file is larger or wrong format', 500)
  }
}

exports.getAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (error) {
    throw new AppError('upload fail file is larger or wrong format', 500)
  }
}
