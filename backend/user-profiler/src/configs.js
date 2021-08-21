import dotenv from 'dotenv'

dotenv.config()

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.BACKEND_PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET_TOKEN: process.env.JWT_SECRET_TOKEN,
}
