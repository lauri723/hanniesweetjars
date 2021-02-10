const express = require('express')
const router = express.Router()
const Listing = require('../models/listing')
const Section = require('../models/section')
const Photo = require('../models/photo')
const middleware = require("../middleware"),
    { isLoggedIn} = middleware
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'images/gif']

// All Listings Route
router.get('/', async (req, res) => {
  let listings
  try {
    listings = await Listing.find()
    // listings = await Listing.find().sort({ createdAt: 'desc' })
    sections = await Section.find()
  } catch (err) {
    console.log(err)
    listings = []
  }
  res.render('listings/index', { listings: listings, sections: sections })
})

// New Listing Route
router.get('/new', isLoggedIn, async (req, res) => {
  renderNewPage(res, new Listing())
})

// Create Listing Route
router.post('/', isLoggedIn, async (req, res) => {
  const listing = new Listing({
    name: req.body.name,
    section: req.body.section,
    description: req.body.description,
    markdown: req.body.markdown,
    materials: req.body.materials,
    price: req.body.price,
    pricePer: req.body.pricePer,
    pricePerQty: req.body.pricePerQty,
    // url: req.body.url,
    tags: req.body.tags.split(' ').join(' #')
  })
  saveThumb(listing, req.body.thumb)

  try {
    const newListing = await listing.save()
    console.log(newListing)
    // res.redirect(`listings/${newListing.slug}`)
      res.redirect('/listings')
  } catch (err) {
    console.log(err)
    renderNewPage(res, listing, true)
  }
})

// Show Listing Route
router.get('/:slug', async (req, res) => {
  try {
    const listing = await Listing.findOne({slug: req.params.slug })
                           .populate('section')
                           .exec()
    const photos = await Photo.find({ listing: listing.id })
    res.render('listings/show', {
      listing: listing,
      photosByListing: photos
    })
  } catch {
    res.redirect('/')
  }
})

// Edit Listing Route
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
    renderEditPage(res, listing)
  } catch {
    res.redirect('/')
  }
})

// Update Listing Route
router.put('/:id', isLoggedIn, async (req, res) => {
  let listing

  try {
    listing = await Listing.findById(req.params.id)
    listing.name = req.body.name
    listing.section = req.body.section
    listing.description = req.body.description
    listing.markdown = req.body.markdown,
    listing.materials = req.body.materials,
    listing.price = req.body.price,
    listing.pricePer = req.body.pricePer,
    listing.pricePerQty = req.body.pricePerQty,
    // listing.url = req.body.url,
    listing.tags = req.body.tags.replace(/#/g, '').split(' ').join(' #')
    if (req.body.thumb != null && req.body.thumb !== '') {
      saveThumb(listing, req.body.thumb)
    }
    await listing.save()
      res.redirect('/listings')
    // res.redirect(`/listings/${listing.slug}`)
  } catch {
    if (listing != null) {
      renderEditPage(res, listing, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Listing Page
router.delete('/:id', isLoggedIn, async (req, res) => {
  let listing
  try {
    listing = await Listing.findById(req.params.id)
    await listing.remove()
    res.redirect('/listings')
  } catch {
    if (listing != null) {
      res.render('listings/show', {
        listing: listing,
        errorMessage: 'Could not remove listing'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, listing, hasError = false) {
  renderFormPage(res, listing, 'new', hasError)
}

async function renderEditPage(res, listing, hasError = false) {
  renderFormPage(res, listing, 'edit', hasError)
}

async function renderFormPage(res, listing, form, hasError = false) {
  try {
    const sections = await Section.find({})
    const params = {
      sections: sections,
      listing: listing
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Listing'
      } else {
        params.errorMessage = 'Error Creating Listing'
      }
    }
    res.render(`listings/${form}`, params)
  } catch {
    res.redirect('/listings')
  }
}

function saveThumb(listing, thumbEncoded) {
  if (thumbEncoded == null) return
  const thumb = JSON.parse(thumbEncoded)
  if (thumb != null && imageMimeTypes.includes(thumb.type)) {
    listing.thumbImage = new Buffer.from(thumb.data, 'base64')
    listing.thumbImageType = thumb.type
  }
}

module.exports = router



// const express = require('express')
// const router = express.Router()
// const Listing = require('../models/listing')
// const Photo = require('../models/photo')
// const middleware = require("../middleware"),
//     { isLoggedIn} = middleware
// const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'images/gif']

// // All Listings Route
// router.get('/', async (req, res) => {
//   let searchOptions = {}
//   if (req.query.name != null && req.query.name !== '') {
//     searchOptions.name = new RegExp(req.query.name, 'i')
//   }
//   try {
//     const listings = await Listing.find(searchOptions).sort({ createdAt: 'desc' })
//     res.render('listings/index', {
//       listings: listings,
//       searchOptions: req.query
//     })
//   } catch {
//     res.redirect('/')
//   }
// })

// // New Listing Route
// router.get('/new', isLoggedIn, (req, res) => {
//   res.render('listings/new', { listing: new Listing() })
// })

// // Create Listing Route
// router.post('/', isLoggedIn, async (req, res) => {
//   const listing = new Listing({
//     name: req.body.name,
//     description: req.body.description,
//     markdown: req.body.markdown,
//     materials: req.body.materials,
//     price: req.body.price
//   })
//   saveThumb(listing, req.body.thumb)
//   try {
//     console.log(new Listing)
//     const newListing = await listing.save()
//     res.redirect(`listings/${newListing.slug}`)
//   } catch (err){
//     console.log(err)
//     res.render('listings/new', {
//       listing: listing,
//       errorMessage: 'Error creating Listing'
//     })
//   }
// })

// router.get('/:slug', async (req, res) => {
//   try {
//     const listing = await Listing.findOne({ slug: req.params.slug })
//     const photos = await Photo.find({ listing: listing.id })
//     res.render('listings/show', {
//       listing: listing,
//       photosByListing: photos
//     })
//   } catch {
//     res.redirect('/')
//   }
// })

// router.get('/:id/edit', isLoggedIn, async (req, res) => {
//   try {
//     const listing = await Listing.findById(req.params.id)
//     res.render('listings/edit', { listing: listing })
//   } catch {
//     res.redirect('/listings')
//   }
// })

// router.put('/:id', isLoggedIn, async (req, res) => {
//   let listing
//   try {
//     listing = await Listing.findById(req.params.id)
//     listing.name = req.body.name
//     listing.description = req.body.description,
//     listing.markdown = req.body.markdown,
//     listing.materials = req.body.materials,
//     listing.price = req.body.price
//     if (req.body.thumb != null && req.body.thumb !== '') {
//       saveCover(listing, req.body.thumb)
//     }
//     await listing.save()
//     res.redirect(`/listings/${listing.slug}`)
//   } catch {
//     if (listing == null) {
//       res.redirect('/')
//     } else {
//       res.render('listings/edit', {
//         listing: listing,
//         errorMessage: 'Error updating Listing'
//       })
//     }
//   }
// })

// router.delete('/:id', isLoggedIn, async (req, res) => {
//   let listing
//   try {
//     listing = await Listing.findById(req.params.id)
//     await listing.remove()
//     res.redirect('/listings')
//   } catch {
//     if (listing == null) {
//       res.redirect('/')
//     } else {
//       res.redirect(`/listings/${listing.slug}`)
//     }
//   }
// })

// function saveThumb(listing, thumbEncoded) {
//   if (thumbEncoded == null) return
//   const thumb = JSON.parse(thumbEncoded)
//   if (thumb != null && imageMimeTypes.includes(thumb.type)) {
//     listing.thumbImage = new Buffer.from(thumb.data, 'base64')
//     listing.thumbImageType = thumb.type
//   }
// }

// module.exports = router