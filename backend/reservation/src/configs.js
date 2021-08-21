import dotenv from 'dotenv'

dotenv.config()

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.BACKEND_PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
  USER_PROFILER_SVC: process.env.USER_PROFILER_SVC,
  RABBIT_CONFIG: {
    host: process.env.AMQP_IP,
    port: process.env.AMQP_PORT,
    login: process.env.AMQP_USERNAME,
    password: process.env.AMQP_PASSWORD,
    heartbeat: 5,
  }
}
