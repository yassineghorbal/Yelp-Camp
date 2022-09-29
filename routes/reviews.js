const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../helpers/catchAsync')
const ExpressError = require('../helpers/ExpressError')
const Campground = require('../models/campground')
const Review = require('../models/review')
const { reviewSchema } = require('../schemas')
const { isLoggedIn } = require('../middleware')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const message = error.details.map(el => el.message).join(',')
        throw new ExpressError(result.error.details, 400)
    } else {
        next()
    }
}

// add review
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// delete review
router.delete('/:reviewId', isLoggedIn, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router