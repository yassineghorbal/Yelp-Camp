const express = require('express')
const router = express.Router()
const catchAsync = require('../helpers/catchAsync')
const Campground = require('../models/campground')
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const { campgroundSchema } = require('../schemas')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })


//show new campground form
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

//save new campground
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))

//show all campgrounds
router.get('/', catchAsync(campgrounds.index))

//show single campground
router.get('/:id', catchAsync(campgrounds.showCampground))

//show edit campground form
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//update campground
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

//delete campground
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router