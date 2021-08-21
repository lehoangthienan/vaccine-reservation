import jwt from 'jsonwebtoken'

import User from '../models/user'
import configs from '../configs'
import logger from '../utils/logger'
import ServerError from '../utils/serverError'
import { ROLES } from '../utils/constants'
import { createToken } from '../utils/helper'

export async function verifyToken(req, res, next) {
  if (req.method === 'OPTIONS') {
    // CROS: the browser will preflight a request 
    // to check which params are accepted by the server 
    // before sending the actual request,
    // so we need to ignore verifyToken() here
    return next()
  }

  try {
    const authorization = req.get('Authorization')
    if (!authorization) return next()

    const token = authorization.split(' ')[1]
    const payload = await new Promise((resolve, reject) => (
      jwt.verify(token, configs.JWT_SECRET_TOKEN, function (err, payload) {
        if (err) return reject(err)
        resolve(payload)
      })
    ))

    req.user = { ...payload.user }
    next()

  } catch (error) {
    logger.error(error)
    if (error.message === 'jwt expired') {
      return res.status(error.code || 500).json({ message: error.message })
    }
    next()
  }
}

export async function authenticateMasterAdmin(req, res, next) {
  if (req.method === 'OPTIONS') {
    // CROS: the browser will preflight a request 
    // to check which params are accepted by the server 
    // before sending the actual request,
    // so we need to ignore authenticateMasterAdmin() here
    return next()
  }

  try {
    const currentUser = req.user
    if (!currentUser) throw new ServerError('Please login to continue', 401)

    const user = await User.findById(currentUser._id)

    if (!user) throw new ServerError('Account is not found', 401)
    if (!user.active) throw new ServerError('Account is locked', 401)
    if (currentUser.role !== user.role) {
      throw new ServerError('Your role is not found or has been changed. Please login again', 403)
    }

    if (user.role !== ROLES.MASTER_ADMIN) {
      throw new ServerError('Access denied', 403)
    }

    next()
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function authenticateAdmin(req, res, next) {
  if (req.method === 'OPTIONS') {
    // CROS: the browser will preflight a request 
    // to check which params are accepted by the server 
    // before sending the actual request,
    // so we need to ignore authenticateMasterAdmin() here
    return next()
  }

  try {
    const currentUser = req.user
    if (!currentUser) throw new ServerError('Please login to continue', 401)

    const user = await User.findById(currentUser._id)

    if (!user) throw new ServerError('Account is not found', 401)
    if (!user.active) throw new ServerError('Account is locked', 401)
    if (currentUser.role !== user.role) {
      throw new ServerError('Your role is not found or has been changed. Please login again', 403)
    }

    if (user.role !== ROLES.MASTER_ADMIN && user.role !== ROLES.ADMIN) {
      throw new ServerError('Access denied', 403)
    }

    next()
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function authenticateModerator(req, res, next) {
  if (req.method === 'OPTIONS') {
    // CROS: the browser will preflight a request 
    // to check which params are accepted by the server 
    // before sending the actual request,
    // so we need to ignore authModerator() here
    return next()
  }

  try {
    const currentUser = req.user
    if (!currentUser) throw new ServerError('Please login to continue', 401)

    const user = await User.findById(currentUser._id)

    if (!user) throw new ServerError('Account is not found', 401)
    if (!user.active) throw new ServerError('Account is locked', 401)
    if (currentUser.role !== user.role) {
      throw new ServerError('Your role is not found or has been changed. Please login again', 403)
    }

    if (user.role !== ROLES.MASTER_ADMIN && user.role !== ROLES.ADMIN && user.role !== ROLES.MODERATOR) {
      throw new ServerError('Access denied', 403)
    }

    next()
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function authenticateNurse(req, res, next) {
  if (req.method === 'OPTIONS') {
    // CROS: the browser will preflight a request 
    // to check which params are accepted by the server 
    // before sending the actual request,
    // so we need to ignore authModerator() here
    return next()
  }

  try {
    const currentUser = req.user
    if (!currentUser) throw new ServerError('Please login to continue', 401)

    const user = await User.findById(currentUser._id)

    if (!user) throw new ServerError('Account is not found', 401)
    if (!user.active) throw new ServerError('Account is locked', 401)
    if (currentUser.role !== user.role) {
      throw new ServerError('Your role is not found or has been changed. Please login again', 403)
    }

    if (user.role !== ROLES.MASTER_ADMIN && user.role !== ROLES.ADMIN && user.role !== ROLES.MODERATOR && user.role !== ROLES.NURSE) {
      throw new ServerError('Access denied', 403)
    }

    req.user = user

    next()
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username }).select('+password').exec()
    if (!user) throw new ServerError('Invalid username', 404)
    if (!user.active) throw new ServerError('Account is locked', 401)

    const isMatched = await user.comparePassword(password)
    if (!isMatched) throw new ServerError('Wrong password', 401)

    const token = createToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    })

    res.json({
      message: 'You are now logged in',
      user: {
        token,
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}
