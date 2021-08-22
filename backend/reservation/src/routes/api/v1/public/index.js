import { Router } from 'express'
import {
  createVaccineRegister,
  getPublicReservation,
} from '../../../../controllers/reservationController'
import {
  mwCreateReservation
} from '../../../../controllers/mw/reservationMiddleware'

const routers = Router()
routers.post('/reservations', mwCreateReservation, createVaccineRegister)
routers.get('/reservations/:phone/phone', getPublicReservation)

export default routers
