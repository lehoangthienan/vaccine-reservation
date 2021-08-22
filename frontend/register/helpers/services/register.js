import axios from 'axios'

import configs from '../../configs'

// getReservationByPhone func
export async function getReservationByPhone(phone) {
  try {
    const data = await axios.get(`${configs.RESERVATION_API}/api/v1/public/reservations/${phone}/phone`)
      .then(response => Promise.resolve(response.data.reservation || {}))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}

// createReservation func
export async function createReservation(info) {
  try {
    const data = await axios.post(`${configs.RESERVATION_API}/api/v1/public/reservations`, info)
      .then(response => Promise.resolve(response.data.reservation || {}))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}