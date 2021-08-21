import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

import { changeAlias } from '../utils/helper'

//Define schema Centre
const centreSchema = new Schema({
  admin: { type: Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  city: { type: String, required: true },
  // isAutoAssignReservation: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  // Search
  titleSearch: { type: String },
  addressSearch: { type: String },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

centreSchema.index({
  titleSearch: 'text',
  addressSearch: 'text',
})

centreSchema.pre('save', function (next) {
  this.titleSearch = changeAlias(this.title).toLowerCase()
  this.addressSearch = changeAlias(this.address).toLowerCase()
  next()
})

centreSchema.plugin(uniqueValidator)

export default mongoose.model('Centre', centreSchema)
