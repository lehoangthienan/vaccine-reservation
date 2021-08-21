import logger from '../../utils/logger'
import ServerError from '../../utils/serverError'

export async function mwCreateReservation(req, res, next) {
  if (req.method === 'OPTIONS') {
    // CROS: the browser will preflight a request 
    // to check which params are accepted by the server 
    // before sending the actual request,
    // so we need to ignore authenticateMasterAdmin() here
    return next()
  }

  try {
    const { fullname, phone, address, idf } = req.body

    if (!fullname) {
      throw new ServerError('Fullname is required', 400)
    }

    if (!phone) {
      throw new ServerError('Phone is required', 400)
    }

    if (!address) {
      throw new ServerError('Address is required', 400)
    }

    if (!idf) {
      throw new ServerError('ID is required', 400)
    }
  
    next()
  } catch (error) {
    logger.error(error)
    res.status(error.code || 500).json({ message: error.message })
  }
}
