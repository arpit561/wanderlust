const Review= require("../models/review"); 
const Listing = require("../models/listing");

// POST ROUTE--
module.exports.createReview= async(req, res) => {
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author= req.user._id;
    listing.reviews.push(newReview);
    // console.log(newReview); 
    await newReview.save();
    await listing.save();

    console.log("New review saved");
    req.flash("success", "Review created");
    res.redirect(`/listings/${listing.id}`);
}

// DELETE ROUTE--
module.exports.destoryReview= async(req, res) => {
    let {id, reviewId}= req.params;
    let ans= await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
//    let ans= await Review.findByIdAndDelete(reviewId);
    console.log("Review removed successfully ", ans);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}