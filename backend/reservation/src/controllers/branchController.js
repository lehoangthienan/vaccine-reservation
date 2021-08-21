import { Types } from 'mongoose'

import Centre from '../models/centre'
import Branch from '../models/branch'
import logger from '../utils/logger'
import ServerError from '../utils/serverError'
import { ROLES } from '../utils/constants'

export async function getBranches(req, res) {
  try {
    const objQuery = {}
    const { limit, skip } = req.query
    const { centreID } = req.user 

    objQuery.centre = new Types.ObjectId(centreID)

    const branches = await Branch.find()
      .where(objQuery)
      .sort([['createdAt', -1]])
      .limit(+limit)
      .skip(+skip)

    return res.status(200).json({ message: 'Success', branches })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function getBranch(req, res) {
  try {
    const { _id } = req.params
    const branch = await Branch.findById(_id)
    if (!branch) throw new ServerError('Couldn\'t find any branch', 404)

    return res.status(200).json({ message: 'Success', branch })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function createBranch(req, res) {
  try {
    const userSigningIn = req.user
    let centre
    const { title, address, hotline, centreID, capacity } = req.body

    if (userSigningIn.role === ROLES.MASTER_ADMIN) {
      if (!centreID) ServerError('centreID is required', 400)
      centre = centreID
    } else {
      centre = userSigningIn.centreID
    }

    const currentCentre = await Centre.findById(centre)

    if (!currentCentre) throw new ServerError('Couldn\'t find any centre', 404)
    const objCreate = {
      title,
      address,
      centre,
      hotline,
      capacity,
    }

    const branchTemp = new Branch(objCreate)
    const branch = await branchTemp.save()
    if (!branch) throw new ServerError('Couldn\'t create branch, please try again', 500)
    return res.status(200).json({ message: 'Success', branch })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}

export async function updateBranch(req, res) {
  try {
    const { _id } = req.params
    const { title, address, hotline, disabled, capacity } = req.body

    const currentBranch = await Branch.findById(_id)
    if (!currentBranch) throw new ServerError('Couldn\'t find any Branch', 404)

    const objUpdate = {
      title,
      address,
      hotline,
      disabled,
      capacity,
    }
    Object.keys(objUpdate).forEach(item => {
      if (objUpdate[item] === undefined) delete objUpdate[item]
    })
    currentBranch.set(objUpdate)

    const branch = await currentBranch.save()
    if (!branch) throw new ServerError('Couldn\'t update branch, please try again', 500)
    return res.status(200).json({ message: 'Success', branch })
  } catch (err) {
    logger.error(err)
    res.status(err.code || 500).json({ message: err.message })
  }
}