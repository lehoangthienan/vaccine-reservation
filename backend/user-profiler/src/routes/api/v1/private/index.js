import { Router } from 'express'

import {
  login,
  verifyToken,
  authenticateMasterAdmin,
  authenticateAdmin,
  authenticateNurse,
} from '../../../../controllers/authController'
import {
  createUser,
  getUserProfile,
  createNurseUser,
  updateUser,
  changePassword,
  getUsers,
  getNurse,
  changeUserStatus,
  updateNurse,
} from '../../../../controllers/userController'
import {
  mwCreateUser,
  mwCreateNurse,
} from '../../../../controllers/mw/userMiddleware'

const routers = Router()

routers.use(verifyToken)
routers.post('/users/login', login)
routers.post('/users', authenticateMasterAdmin, mwCreateUser, createUser)
routers.post('/users/nurse', authenticateAdmin, mwCreateNurse, createNurseUser)
routers.put('/users/password', authenticateNurse, changePassword)
routers.put('/users/:_id/status', authenticateAdmin, changeUserStatus)
routers.put('/users/:_id', authenticateAdmin, updateNurse)
routers.put('/users', authenticateAdmin, updateUser)
routers.get('/users/me', authenticateNurse, getUserProfile)
routers.get('/users/nurses', authenticateAdmin, getNurse)
routers.get('/users', authenticateMasterAdmin, getUsers)

routers.use((err, req, res, next) => {
  if (err.name !== 'HttpError' || !err.errorCode) return next(err)
  res.status(err.errorCode).json({ message: err.message })
})

export default routers
