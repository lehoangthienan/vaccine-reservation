import { Router } from 'express'
import {
  createVaccineRegister,
} from '../../../../controllers/reservationController'
import {
  mwCreateReservation
} from '../../../../controllers/mw/reservationMiddleware'

const routers = Router()
routers.post('/reservations', mwCreateReservation, createVaccineRegister)

export default routers
