const Listing= require("./models/listing");
const Review = require("./models/review");
module.exports.isLoggedIn= (req, res, next) => {
    console.log(req.user);
    // console.log(req.path, ".....", req.originalUrl);
    if(!req.isAuthenticated()){
        req.session.redirectUrl= req.originalUrl;
        req.flash("error", "You must be logged in");
        res.redirect("/login");
    }
    next();
}

module.exports.savedRedirectUrl= (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner= async(req, res, next) => {
    let {id}= req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "Permission denied, You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.isReviewAuthor= async(req, res, next) => {
    let {id, reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "Permission denied, You are not author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}