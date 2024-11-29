const Listing = require("../models/listing");
const notifier = require('node-notifier');


// handle the search logic--
module.exports.searching= async (req, res) => {
    const maxPrice = parseFloat(req.query.price); // Convert price to a number
    if (!isNaN(maxPrice)) { // Ensure price is valid
      try {
        // Find listings with prices <= maxPrice
        const listings = await Listing.find({ price: { $lte: maxPrice } }).limit(10);
  
        // If no listings are found, render an error page
        if (listings.length === 0) {
          return res.render("listings/errsearch.ejs", { error: "No listings found below this price range" });
        }
  
        // Otherwise, render the search results
        res.render("listings/search.ejs", { listings });
      } catch (error) {
        console.error(error);
        res.render("listings/errsearch.ejs", { error: "An error occurred while retrieving listings" });
      }
    } else {
      res.render("listings/errsearch.ejs", { error: "Invalid price parameter" });
    }
  }

// INDEX ROUTE--
module.exports.index= async(req, res) => {
    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
 }

//  NEW ROUTE--
 module.exports.renderNewForm= (req, res) => {
    res.render("listings/new.ejs");
 }

// SHOW ROUTE--
module.exports.showListing= async(req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id).
    populate({path: "reviews", 
        populate: {path: "author"},
    }).populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
} 

// CREATE ROUTE--
module.exports.createListing= async(req, res, next) => {
    let url= req.file.path;
    let filename= req.file.filename;

    let {title, description, image, price, country, location}= req.body;
    // let result= listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400, result.error);
    // }
    let newListing= new Listing({title, description, image, price, country, location});

    newListing.owner= req.user._id;  //to add owner id by using passport
    newListing.image= {url, filename};

    await newListing.save();
    req.flash("success", "New listing created");
    console.log(newListing);
    notifier.notify({
        title: 'Notification',
        message: 'Created Successfully',
        sound: true,
    });
    res.redirect("/listings");
}

// EDIT ROUTE--
module.exports.renderEditForm= async (req, res) => {
    let {id}= req.params;
    const listing= await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl= listing.image.url;
    originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
}

// EDIT & UPDATE ROUTE--
module.exports.updateListing= async (req, res) => {
    if(!req.body){
        throw new ExpressError(400, "Send valid data for listing");
    }
    let {id}= req.params;
   const listing= await Listing.findByIdAndUpdate(id, {...req.body});
   console.log("change:", listing);

   if(typeof req.file !== "undefined"){
    let url= req.file.path;
    let filename= req.file.filename;
    listing.image= {url, filename};
    await listing.save();
   }
   
 notifier.notify({
    title: 'Notification',
    message: 'Edited Successfully',
    sound: true,
 });
   req.flash("success", "Listing updated");
   res.redirect(`/listings/${id}`);
}

// DELETE ROUTE--
module.exports.destroyListing= async(req, res) => {
    let {id}= req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    notifier.notify({
        title: 'Notification',
        message: 'Deleted Successfully',
        sound: true,
    });
    res.redirect("/listings");
}
