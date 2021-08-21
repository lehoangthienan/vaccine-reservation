import axios from 'axios'

import configs from '../configs'

// Get data getUserInfo
export async function getUserInfo(userID) {
  try {
    const data = await axios.get(`${configs.USER_PROFILER_SVC}/api/v1/internal/users/${userID}`)
      .then(response => Promise.resolve(response.data.user || {}))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}

// createUser
export async function createUser(info) {
  try {
    const data = await axios.post(`${configs.USER_PROFILER_SVC}/api/v1/internal/users`, info)
      .then(response => Promise.resolve(response.data.user || {}))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}

// updateUserCentre
export async function updateUserCentre(userID, centreID) {
  try {
    const data = await axios.put(`${configs.USER_PROFILER_SVC}/api/v1/internal/users/${userID}/centre`, { centreID })
      .then(response => Promise.resolve(response.data.user || {}))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}

// deleteUserCentre
export async function deleteUser(userID) {
  try {
    const data = await axios.delete(`${configs.USER_PROFILER_SVC}/api/v1/internal/users/${userID}`)
      .then(response => Promise.resolve(response.data.user || {}))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}

// Get data getCustomerInfoByPhone
export async function getCustomerInfoByPhone(phone) {
  try {
    const data = await axios.get(`${configs.USER_PROFILER_SVC}/api/v1/internal/customers/${phone}/phone`)
      .then(response => Promise.resolve(response.data.customer || {}))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}

// Get data getCustomerInfoByID
export async function getCustomerInfoByID(customerID) {
  try {
    const data = await axios.get(`${USER_PROFILER_SVC}/api/v1/internal/customers/${customerID}`)
      .then(response => Promise.resolve(response.data.customer || {}))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}

// createCustomer
export async function createCustomer(info) {
  try {
    const data = await axios.post(`${configs.USER_PROFILER_SVC}/api/v1/internal/customers`, info)
      .then(response => Promise.resolve(response.data.customer || {}))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}

// getNurseNIn
export async function getNurseNIn(ids, branchID) {
  try {
    const data = await axios.post(`${configs.USER_PROFILER_SVC}/api/v1/internal/users/nin-nurse`, { ids, branchID })
      .then(response => Promise.resolve(response.data.users || []))
      .catch(err => Promise.reject(err))
    return data
  } catch (err) {
    throw err
  }
}
