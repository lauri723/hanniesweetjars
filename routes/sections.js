const express = require('express')
const router = express.Router()
const Section = require('../models/section')
const Listing = require('../models/listing')
const middleware = require("../middleware"),
    { isLoggedIn} = middleware


router.get('/', async (req, res) => {
  let sections
  try {
    sections = await Section.find().sort({ createdAt: 'desc' })
  } catch {
    sections = []
  }
  res.render('sections/index', { sections: sections })
})

// New Section Route
router.get('/new', isLoggedIn, (req, res) => {
  res.render('sections/new', { section: new Section() })
})

// Create Section Route
router.post('/', isLoggedIn, async (req, res) => {
  const section = new Section({
    name: req.body.name,
  })
  try {
    const newSection = await section.save()
    console.log(newSection)
    // res.redirect(`sections/${newSection.slug}`)
      res.redirect('/sections')
  } catch (err){
    console.log(err)
    res.render('sections/new', {
      section: section,
      errorMessage: 'Error creating Section'
    })
  }
})

// Show Section Route
router.get('/:slug', async (req, res) => {
  try {
    const section = await Section.findOne({ slug: req.params.slug })
    const listings = await Listing.find({ section: section.id })
    res.render('sections/show', {
      section: section,
      listingsBySection: listings
    })
  } catch {
    res.redirect('/')
  }
})

// Edit Section Route
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
    const section = await Section.findById(req.params.id)
    res.render('sections/edit', { section: section })
  } catch {
    res.redirect('/sections')
  }
})

// Update Section Route
router.put('/:id', isLoggedIn, async (req, res) => {
  let section
  try {
    section = await Section.findById(req.params.id)
    section.name = req.body.name
    
    await section.save()
      res.redirect('/sections')
      // res.redirect(`/sections/${section.slug}`)
  } catch {
    if (section == null) {
      res.redirect('/')
    } else {
      res.render('sections/edit', {
        section: section,
        errorMessage: 'Error updating Section'
      })
    }
  }
})

// Delete Section Route
router.delete('/:id', isLoggedIn, async (req, res) => {
  let section
  try {
    section = await Section.findById(req.params.id)
    await section.remove()
    res.redirect('/sections')
  } catch {
    if (section == null) {
      res.redirect('/')
    } else {
      res.redirect(`/sections/${section.slug}`)
    }
  }
})

module.exports = router