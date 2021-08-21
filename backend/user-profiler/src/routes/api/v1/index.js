import { Router } from 'express'

import publicAPI from './public';
import privateAPI from './private';
import internalAPI from './internal';

const routes = Router()

routes.use('/public', publicAPI)
routes.use('/private', privateAPI)
routes.use('/internal', internalAPI)

export default routes