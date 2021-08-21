import Centre from '../models/centre'
import logger from '../utils/logger'
import ServerError from '../utils/serverError'
import { createUser, updateUserCentre, deleteUser } from '../services/user_profiler'
import { ROLES } from '../utils/constants'

export async function createCentreByMasterAdmin(req, res) {
  let admin
  try {
    const {
      username,
      password,
      phone,
      title,
      address,
      description,
      cityCode,
      // isAutoAssignReservation,
    } = req.body

    const objCentreAdmin = {
      username: username.trim(),
      fullname: title,
      password,
      phone,
      role: ROLES.ADMIN,
    }

    // Create admin
    admin = await createUser(objCentreAdmin)
    if (!admin) throw new ServerError('Could not create centre admin', 400)

    const objCentre = {
      admin: admin._id,
      title,
      address,
      city: cityCode,
      description,
      // isAutoAssignReservation,
    }

    // Create Centre
    const newCentre = new Centre(objCentre)
    const centre = await newCentre.save()

    await updateUserCentre(admin._id, centre._id)

    if (!centre) throw new ServerError('Could not create centre', 400)

    res.status(200).json({ message: 'Success', centre })
  } catch (err) {
    if (admin) await deleteUser(admin._id)
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function updateCentreByMasterAdmin(req, res) {
  try {
    const {
      title,
      address,
      description,
      cityCode,
      active,
      // isAutoAssignReservation,
    } = req.body
    const { _id } = req.params

    const objUpdate = {
      title,
      address,
      description,
      cityCode,
      active,
      // isAutoAssignReservation,
    }

    Object.keys(objUpdate).forEach(key => {
      if (!objUpdate[key]) {
        if (typeof objUpdate[key] !== 'boolean') {
          delete objUpdate[key]
        }
      }
    })

    // Update
    const centre = await Centre.findByIdAndUpdate(_id, objUpdate)
    if (!centre) throw new ServerError('Could not update centre', 400)

    res.status(200).json({ message: 'Success', centre })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function getCurrentCentre(req, res) {
  try {
    const { centreID } = req.user

    const centre = await Centre.findById(centreID)
    if (!centre) throw new ServerError('Could not find any centre', 404)

    res.status(200).json({
      message: 'Success',
      centre,
    })

  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function updateCurrentCentre(req, res) {
  try {
    console.log('req.user', req.user)
    const { centreID } = req.user

    const {
      title,
      address,
      description,
      cityCode,
      // isAutoAssignReservation,
    } = req.body

    const currentCentre = await Centre.findById(centreID)
    if (!currentCentre) throw new ServerError('Can not find Centre', 400)

    const objUpdate = {
      title,
      address,
      description,
      cityCode,
      // isAutoAssignReservation,
    }

    Object.keys(objUpdate).forEach(item => {
      if (!objUpdate[item] || objUpdate[item] === undefined) delete objUpdate[item]
    })

    const centre = await Centre.findByIdAndUpdate(currentCentre._id, objUpdate, { new: true })
    if (!centre) throw new ServerError('Couldn\'t update profile, please try again', 500)

    res.status(200).json({
      message: 'Success',
      centre,
    })

  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}