import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { changeAlias } from '../utils/helper'

const customerSchema = new Schema({
  fullname: { type: String, required: true },
  fullnameSearch: { type: String },
  titleName: { type: String },
  birthday: { type: Date },
  email: { type: String },
  phone: { type: String },
  country: { type: String },
  city: { type: String },
  address: { type: String },
  avatar: { type: String },
  group: { type: String },
  source: { type: String },
  nationCode: { type: String },
  note: { type: String },
  source: { type: String },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

customerSchema.pre('save', function (next) {
  this.phone = this.phone ? this.phone.replace(/ /g, '') : ''
  this.fullname = this.fullname ? this.fullname.trim() : ''
  this.fullnameSearch = changeAlias(this.fullname).toLowerCase()
  next()
})

customerSchema.index({
  fullnameSearch: 'text',
})

customerSchema.plugin(uniqueValidator)

export default mongoose.model('Customer', customerSchema)