const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)


const listingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  markdown: {
    type: String,
    required: true
  },
  materials: {
    type: String
  },
  price: {
    type: Number
  },
  pricePer: {
    type: Number
  },
  pricePerQty: {
    type: Number
  },
  url: {
    type: String
  },
  tags: {
    type: String
  },
  thumbImage: {
    type: Buffer,
    required: true
  },
  thumbImageType: {
    type: String,
    required: true
  },
  section: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Section'
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizedHtml: {
    type: String,
    required: true
  }
})

listingSchema.pre('validate', function(next) {
  if (this.name) {
    this.slug = slugify(this.name + "-" + Math.floor(1000 + Math.random() * 9000), { lower: true, strict: true })
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.markdown))
  }
  
  next()
})

listingSchema.virtual('thumbImagePath').get(function() {
  if (this.thumbImage != null && this.thumbImageType != null) {
    return `data:${this.thumbImageType};charset=utf-8;base64,${this.thumbImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Listing', listingSchema)



