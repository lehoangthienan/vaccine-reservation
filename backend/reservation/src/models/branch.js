import mongoose, { Schema } from 'mongoose'

// Define branch
const branch = new Schema({
  title: { type: String, required: true },
  address: { type: String, required: true },
  hotline: { type: String },
  centre: { type: Schema.Types.ObjectId, ref: 'Centre' },
  disabled: { type: Boolean, default: false },
  capacity: { type: Number, required: true, default: 100 },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

export default mongoose.model('Branch', branch)