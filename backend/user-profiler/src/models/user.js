import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Joi from 'joi'
import uniqueValidator from 'mongoose-unique-validator'

import * as regexp from '../utils/regexp'
import { ROLES } from '../utils/constants'
import ServerError from '../utils/serverError'

const userSchema = new mongoose.Schema({
  role: { type: String, default: ROLES.USER },
  email: { type: String },
  username: { type: String, required: true, unique: true},
  password: { type: String, required: true, select: false },
  fullname: { type: String, required: true },
  phone: { type: String, required: true, unique: true},
  gender: { type: String },
  avatar: { type: String },
  address: { type: String },
  centreID: { type: String },
  branchID: { type: String },
  address: { type: String },
  active: { type: Boolean, default: true },
  flag: { type: Number, default: 1 },   // 1 - new user 
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

userSchema.pre('save', function (next) {
  const user = this
  if (user.isNew || user.isModified('password')) {
    bcrypt.genSalt((err, salt) => {
      if (err) return next(err)

      bcrypt.hash(user.password, salt, (err, hashedPassword) => {
        if (err) return next(err)

        user.password = hashedPassword
        next()
      })
    })
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => (
    bcrypt.compare(password, this.password, (err, isMatched) => {
      if (err) return reject(err)
      resolve(isMatched)
    })
  ))
}

userSchema.methods.joiValidate = function (obj) {
  const schema = {
    username: Joi.string().min(6).max(30).regex(regexp.usernameRule).required(),
    fullname: Joi.string().regex(regexp.fullnameRule).required(),
    email: Joi.string().min(6).max(30).regex(regexp.emailRule),
    password: Joi.string().min(6).max(30).required(),
    role: Joi.string().valid([...Object.values(ROLES), '']),
    phone: Joi.string().min(10).max(30).required(),
  }

  return new Promise((resolve, reject) => (
    Joi.validate(obj, schema, (err, result) => {
      if (err) return reject(new ServerError(err.message, 400))
      resolve(result)
    })
  ))
}

userSchema.plugin(uniqueValidator)

export default mongoose.model('User', userSchema)