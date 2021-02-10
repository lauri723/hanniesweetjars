const mongoose = require('mongoose')
const slugify = require('slugify')

const sectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  slug: {
    type: String,
    required: true,
    unique: true
  }
})

sectionSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name + "-" + Math.floor(1000 + Math.random() * 9000), { lower: true, strict: true })
  }
  next()
})

module.exports = mongoose.model('Section', sectionSchema)




