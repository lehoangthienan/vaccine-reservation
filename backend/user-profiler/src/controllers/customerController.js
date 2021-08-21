import Customer from '../models/customer'
import logger from '../utils/logger'

export async function getCustomerByPhone(req, res) {
    try {
        const { phone } = req.params

        const customer = await Customer.findOne({
            phone,
        })

        res.status(200).json({ message: 'Success', customer: customer || {} })
    } catch (err) {
        logger.error(err)
        res.status(err.code || 500).json({ message: err.message })
    }
}

export async function getCustomerByID(req, res) {
    try {
        const { id } = req.params

        const customer = await Customer.findById(id)

        res.status(200).json({ message: 'Success', customer: customer || {} })
    } catch (err) {
        logger.error(err)
        res.status(err.code || 500).json({ message: err.message })
    }
}

export async function createCustomer(req, res) {
    try {
      const { fullname, email, phone, address } = req.body
      const obj = { fullname, email, phone, address  }
  
      const newCustomer = new Customer(obj)
      const customer = await newCustomer.save()
  
      res.status(200).json({ message: 'Ok', customer })
    } catch (error) {
      logger.error(error)
      res.status(error.code || 500).json({ message: error.message })
    }
}