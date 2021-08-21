import logger from '../utils/logger'
import ServerError from '../utils/serverError'
import { getCustomerInfoByPhone } from '../services/user_profiler'
import ampqConnection from '../services/amqp_service';
import AMQP from '../workers/amqp'
import { RABBIT_QUEUE } from '../utils/constants'

export async function createVaccineRegister(req, res) {
  try {
    const { fullname, phone, address, idf } = req.body

    const customer = await getCustomerInfoByPhone(phone)

    if (Object.keys(customer).length > 0){
      throw new  ServerError('can not register twice', 400)
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
