const express= require("express");
const router= express.Router();
const Listing = require("../models/listing");
const wrapAsync= require("../utils/wrapAsync");
const {listingSchema, reviewSchema}= require("../schema");
const ExpressError= require("../utils/ExpressError");
const notifier = require('node-notifier');
const {isLoggedIn, isOwner}= require("../middleware");
const flash= require("connect-flash");
const listingController= require("../controllers/listings");
const {storage}= require("../cloudConfig");
const multer= require("multer");
// const upload= multer({dest: 'uploads/'});
const upload= multer({storage});



// 5.Index Route--->
router.get("/", wrapAsync(listingController.index),
)

    // Handle the search logic--
router.get('/search', wrapAsync(listingController.searching));

// 7.New Route--->
router.get("/new", isLoggedIn,
     listingController.renderNewForm //isLoggedIn is a middleware, it is created in middleware.js
)

// 6.Show Route--->
router.get("/:id", wrapAsync(listingController.showListing));

// 8. Create Route--->
router.post("/", isLoggedIn, upload.single('image'), wrapAsync(listingController.createListing));
// router.post("/", upload.single('image') ,(req, res) => {
//     res.send(req.file);
// })

// 9.Edit Route--->
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//9.(2) Edit and update route--
router.put("/:id", isLoggedIn, isOwner, upload.single('image'), wrapAsync(listingController.updateListing));

// 10.Delete Route--->
router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


// Search listings by price
// router.get('/search', async (req, res) => {
//     // try {
//         console.log(req.query);
//         const maxPrice = parseInt(req.query.price); // Get the price from query params
//         // if (!maxPrice || isNaN(maxPrice)) {
//         //     res.flash("error", 'Invalid price parameter');
//         // // }

//         // Fetch listings where the price is less than or equal to maxPrice
//         const listings = await Listing.find({ price: { $lte: maxPrice } }).limit(10);

//         // Render a template or return JSON with the search results
//         res.render('/listings/search.ejs', { listings, maxPrice });
//     // } catch (error) {
//     //     console.error(error);
//     //     res.status(500).send('Server Error');
//     // }
// });



  

module.exports= router;