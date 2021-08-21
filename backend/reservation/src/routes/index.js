import { Router } from 'express'

import v1 from './api/v1'

const routes = Router()

routes.get('/', (req, res) => res.status(200).json('API'))
routes.use('/api/v1', v1)

routes.use((err, req, res, next) => {
  if (err.name !== 'HttpError' || !err.errorCode) return next(err)
  res.status(err.errorCode).json({ message: err.message })
})

export default routes