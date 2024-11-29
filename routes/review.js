const express= require("express");
const router= express.Router({mergeParams: true});
const wrapAsync= require("../utils/wrapAsync");
const {listingSchema, reviewSchema}= require("../schema");
const Review= require("../models/review"); 
const Listing = require("../models/listing");
const listings= require("../routes/listing");
const reviews= require("../routes/review");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController= require("../controllers/reviews");

// Reviews(Post Route)--->
router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));

// (55)Reviews--Delete Route--->
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destoryReview));

module.exports= router;