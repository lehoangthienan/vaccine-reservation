import { Router } from 'express'

import {
  verifyToken,
  authenticateMasterAdmin,
  authenticateAdmin,
  authenticateNurse,
} from '../../../../controllers/authController'
import {
  createCentreByMasterAdmin,
  updateCentreByMasterAdmin,
  getCurrentCentre,
  updateCurrentCentre,
} from '../../../../controllers/centreController'
import {
  getBranches,
  getBranch,
  createBranch,
  updateBranch,
} from '../../../../controllers/branchController'
import {
  getReservations,
  getReservation,
  updateReservation,
  deleteReservation,
} from '../../../../controllers/reservationController'

const routers = Router()

routers.use(verifyToken)

routers.post('/centres', authenticateMasterAdmin, createCentreByMasterAdmin)
routers.put('/centres/:_id', authenticateMasterAdmin, updateCentreByMasterAdmin)
routers.get('/centres', authenticateNurse, getCurrentCentre)
routers.put('/centres', authenticateAdmin, updateCurrentCentre)

routers.get('/branches', authenticateAdmin, getBranches)
routers.get('/branches/:_id', authenticateNurse, getBranch)
routers.post('/branches', authenticateAdmin, createBranch)
routers.put('/branches/:_id', authenticateAdmin, updateBranch)

routers.get('/reservations', authenticateNurse, getReservations)
routers.get('/reservations/:_id', authenticateNurse, getReservation)
routers.put('/reservations/:_id', authenticateNurse, updateReservation)
routers.delete('/reservations/:_id', authenticateAdmin, deleteReservation)

routers.use((err, req, res, next) => {
  if (err.name !== 'HttpError' || !err.errorCode) return next(err)
  res.status(err.errorCode).json({ message: err.message })
})

export default routers
