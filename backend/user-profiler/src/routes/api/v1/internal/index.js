import { Router } from 'express'
import {
  setupMasterAdmin,
  getUserProfileInternal,
  createUser,
  updateUserCenterInternal,
  deleteUser,
  getNurseNotIn,
} from '../../../../controllers/userController'
import {
  createCustomer,
  getCustomerByPhone,
  getCustomerByID,
} from '../../../../controllers/customerController'

const routes = Router()

routes.get('/customers/:phone/phone', getCustomerByPhone)
routes.get('/customers/:id', getCustomerByID)
routes.post('/customers', createCustomer)
routes.get('/users/:id', getUserProfileInternal)
routes.post('/users/setup-master', setupMasterAdmin)
routes.post('/users/nin-nurse', getNurseNotIn)
routes.post('/users', createUser)
routes.put('/users/:id/centre', updateUserCenterInternal)
routes.delete('/users/:id', deleteUser)

export default routes
