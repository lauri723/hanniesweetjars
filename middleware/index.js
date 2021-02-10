const Photo = require("../models/photo")
const Listing = require("../models/listing")
const Section = require("../models/section")
const Article = require("../models/article")
const Topic = require("../models/topic")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}


