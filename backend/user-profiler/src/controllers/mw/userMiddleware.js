import logger from '../../utils/logger'
import ServerError from '../../utils/serverError'

export async function mwCreateUser(req, res, next) {
  if (req.method === 'OPTIONS') {
    // CROS: the browser will preflight a request 
    // to check which params are accepted by the server 
    // before sending the actual request,
    // so we need to ignore authenticateMasterAdmin() here
    return next()
  }

  try {
    const { centreID } = req.body;

    if (!centreID) {
      throw new ServerError('Centre ID is required', 400)
    }
  
    next()
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}

export async function mwCreateNurse(req, res, next) {
  if (req.method === 'OPTIONS') {
    // CROS: the browser will preflight a request 
    // to check which params are accepted by the server 
    // before sending the actual request,
    // so we need to ignore authenticateMasterAdmin() here
    return next()
  }

  try {
    const { centreID, branchID } = req.body;

    if (!centreID) {
      throw new ServerError('Centre ID is required', 400)
    }

    if (!branchID) {
      throw new ServerError('Branch ID is required', 400)
    }
  
    next()
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}