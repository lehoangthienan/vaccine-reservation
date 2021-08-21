import { Types } from 'mongoose'

import User from '../models/user'
import logger from '../utils/logger'
import ServerError from '../utils/serverError'
import { ROLES } from '../utils/constants'

export async function setupMasterAdmin(req, res) {
  try {
    const { fullname, email, password, username, phone } = req.body
    const masterAdmin = new User({
      role: ROLES.MASTER_ADMIN,
      fullname,
      email,
      username,
      phone,
      password,
      active: true,
    })
    await masterAdmin.save()
    res.status(200).json({ message: 'Ok' })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function registerUser(req, res) {
  try {
    const { fullname, email, password, username } = req.body
    const obj = { fullname, email, password, username }

    const newUser = new User(obj)
    await newUser.joiValidate(obj)
    const user = await newUser.save()
    user.password = ''

    res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function createUser(req, res) {
  try {
    const { fullname, email, password, role, username, phone, centreID } = req.body
    const obj = { fullname, email, password, role, username, phone }

    const newUser = new User(obj)
    await newUser.joiValidate(obj)
    newUser.centreID = centreID
    const user = await newUser.save()
    user.password = ''

    res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function createNurseUser(req, res) {
  try {
    const { fullname, email, password, username, phone, centreID, branchID } = req.body
    const obj = { fullname, email, password, role: ROLES.NURSE, username , phone }

    const newUser = new User(obj)
    await newUser.joiValidate(obj)
    newUser.centreID = centreID
    newUser.branchID = branchID
    const user = await newUser.save()
    user.password = ''

    res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function getUsers(req, res) {
  try {
    const { role } = req.query
    const queryOptions = {}
    const sort = { createdAt: 'desc' }

    let { limit, skip } = req.query

    limit = parseInt(limit) || 10
    skip = parseInt(skip) || 0

    if (role) {
      queryOptions.role = role
    }

    const results = await Promise.all([
      User.find(queryOptions).sort(sort).limit(limit).skip(skip).exec(),
      User.count(queryOptions).exec(),
    ])

    res.json({ users: results[0], total: results[1], message: 'Get users success' })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function getNurse(req, res) {
  try {
    const queryOptions = { role: ROLES.NURSE }
    const sort = { createdAt: 'desc' }
    let { limit, skip } = req.query

    limit = parseInt(limit) || 10
    skip = parseInt(skip) || 0

    const results = await Promise.all([
      User.find(queryOptions).sort(sort).limit(limit).skip(skip).exec(),
      User.count(queryOptions).exec(),
    ])

    res.json({ users: results[0], total: results[1], message: 'Get users success' })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function countUsers(req, res) {
  try {
    const { role } = req.query
    const queryOptions = {}

    if (role) {
      queryOptions.role = role
    }

    const count = await User.count(queryOptions).exec()

    res.json({ count, message: 'Count users success' })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function deleteUser(req, res) {
  try {
    const { _id } = req.params
    const user = await User.findByIdAndDelete(_id)

    res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function getUser(req, res) {
  try {
    const { _id } = req.params
    const user = await User.findById(_id)

    res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function updateUser(req, res) {
  try {
    const { fullname } = req.body
    const objUpdate = {};

    if (fullname) objUpdate.fullname = fullname

    const currentUser = req.user
    const { _id } = currentUser
    const userEdit = await User.findById(_id)
    userEdit.set({...objUpdate})
    const user = await userEdit.save()
    return res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function updateNurse(req, res) {
  try {
    const { _id } = req.params
    const { fullname, branchID } = req.body
    const objUpdate = {};

    if (fullname) objUpdate.fullname = fullname
    if (branchID) objUpdate.branchID = branchID

    const userEdit = await User.findById(_id)
    userEdit.set({...objUpdate})
    const user = await userEdit.save()
    return res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function changeUserStatus(req, res) {
  try {
    const { _id } = req.params
    const userEdit = await User.findById(_id)
    const currentStatus = userEdit.active
    userEdit.set({
      active: !currentStatus,
    })
    const user = await userEdit.save()
    return res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function changePasswordAdmin(req, res) {
  try {
    const { _id } = req.params
    const { password } = req.body
    const userEdit = await User.findById(_id)
    userEdit.set({
      password,
    })
    const user = await userEdit.save()
    return res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)

    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function changePassword(req, res) {

  try {
    const { password, newPassword } = req.body
    const currentUser = req.user
    const { _id } = currentUser
    const userEdit = await User.findById(_id).select('+password').exec()
    const isMatched = await userEdit.comparePassword(password)
    if (!isMatched) throw new ServerError('Wrong password', 401)
    userEdit.set({
      password: newPassword,
    })
    const user = await userEdit.save()
    return res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function getUserProfile(req, res) {
  try {
    const currentUser = req.user
    const { _id } = currentUser
    const user = await User.findById(_id)
    res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function getUserProfileInternal(req, res) {
  try {
    const { id } = req.params
    const user = await User.findById(id)
    res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function updateUserCenterInternal(req, res) {
  try {
    const { centreID } = req.body
    const { id } = req.params

    const userEdit = await User.findById(id)
    userEdit.set({ centreID })
    const user = await userEdit.save()
    return res.status(200).json({ message: 'Ok', user })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function getNurseNotIn(req, res) {
  try {
    const { ids, branchID } = req.body
    const newIDs = ids.map(id => new Types.ObjectId(id))
    const queryOptions = { role: ROLES.NURSE, _id: { $nin: newIDs }, branchID}

    const users = await User.find(queryOptions).exec()

    res.json({ users, message: 'Get users success' })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}
