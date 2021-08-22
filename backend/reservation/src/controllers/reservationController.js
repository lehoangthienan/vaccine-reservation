import { Types } from 'mongoose'

import logger from '../utils/logger'
import ServerError from '../utils/serverError'
import { getCustomerInfoByPhone } from '../services/user_profiler'
import ampqConnection from '../services/amqp_service';
import AMQP from '../workers/amqp'
import { RABBIT_QUEUE, ROLES } from '../utils/constants'
import Reservation from '../models/reservation'

export async function createVaccineRegister(req, res) {
  try {
    const { fullname, phone, address, idf } = req.body

    const customer = await getCustomerInfoByPhone(phone)

    if (Object.keys(customer).length > 0){
      const reservation = await Reservation.findOne({ customerID: new Types.ObjectId(customer._id) })
      if (reservation) throw new  ServerError('can not register twice', 400)
    }

    const msg = { fullname, phone, address, idf }

    const rabbitConnection = await ampqConnection.getInstance();

    AMQP.publish(rabbitConnection, RABBIT_QUEUE.exchange, RABBIT_QUEUE.routingKey, msg)

    return res.status(200).json({ message: 'Success' })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function getReservations(req, res) {
  try {
    const { role, _id, centreID } = req.user
    const { limit, skip } = req.query
    const objQuery = {}

    if (role === ROLES.NURSE) {
      objQuery.nurseID = new Types.ObjectId(_id)
    }
    console.log('centreID', centreID)
    objQuery.centre = new Types.ObjectId(centreID)

    const reservations = await Reservation.find()
      .where(objQuery)
      .sort([['createdAt', -1]])
      .limit(+limit)
      .skip(+skip)
      .populate('branch')
      .populate('centre')

    return res.status(200).json({ message: 'Success', reservations })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function getReservation(req, res) {
  try {
    const { _id } = req.params

    const reservation = await Reservation.findById(_id).populate('branch').populate('centre')

    return res.status(200).json({ message: 'Success', reservation })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function getPublicReservation(req, res) {
  try {
    const { phone } = req.params

    const customer = await getCustomerInfoByPhone(phone)

    if (!customer) throw new ServerError('You have not registered for the covid 19 vaccine', 400)

    const reservation = await Reservation.find({ customerID: customer._id })
    .populate('branch', 'title address')
    .populate('centre', 'title address')
    .select({ "isSendSMS": 0, "_id": 0, "createdAt": 0, "updatedAt": 0, "nurseID": 0, "customerID": 0 })

    return res.status(200).json({ message: 'Success', reservation })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function updateReservation(req, res) {
  try {
    const {
      branch,
      nurseID,
      isVerify,
      isSendSMS,
      centre,
    } = req.body
    const { _id } = req.params

    const objUpdate = {
      branch,
      nurseID,
      isVerify,
      isSendSMS,
      centre,
    }

    Object.keys(objUpdate).forEach(key => {
      if (!objUpdate[key]) {
        if (typeof objUpdate[key] !== 'boolean') {
          delete objUpdate[key]
        }
      }
    })

    // Update
    const reservation = await Reservation.findByIdAndUpdate(_id, objUpdate)
    if (!reservation) throw new ServerError('Could not update reservation', 400)

    res.status(200).json({ message: 'Success', reservation })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function deleteReservation(req, res) {
  try {
    const { _id } = req.params
    const reservation = await Reservation.findByIdAndDelete(_id)

    res.status(200).json({ message: 'Ok', reservation })
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}
