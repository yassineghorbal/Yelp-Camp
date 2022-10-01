const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../helpers/catchAsync')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews')

// add review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

// delete review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router