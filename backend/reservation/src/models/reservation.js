import mongoose, { Schema } from 'mongoose'

// Define reservation
const reservation = new Schema({
  branch: { type: Schema.Types.ObjectId, ref: 'Branch' },
  centre: { type: Schema.Types.ObjectId, ref: 'Centre' },
  nurseID: { type: Schema.Types.ObjectId },
  customerID: { type: Schema.Types.ObjectId },
  isVerify: { type: Boolean, default: false },
  isSendSMS: { type: Boolean, default: false },
  serveDay: { type: Date },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

export default mongoose.model('Reservation', reservation)