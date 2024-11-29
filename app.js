// 1.Basic Setup--->
// run command, npm init -y, npm i ejs mongoose express ejs-mate joi node-notifier passport passport-local passport-local-mongoose multer dotenv cloudinary@^1.21.0 multer-storage-cloudinary connect-mongo
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express= require("express");
const app= express();
const port= 8080;
const mongoose= require("mongoose");
const Listing = require("./models/listing");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate"); //help to create so many templates
const notifier = require('node-notifier');
const wrapAsync= require("./utils/wrapAsync");
const ExpressError= require("./utils/ExpressError");
const {listingSchema, reviewSchema}= require("./schema");
const Review= require("./models/review"); 
const listingRouter= require("./routes/listing");
const reviewRouter= require("./routes/review");
const session= require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const LocalStrategy= require("passport-local");
const User= require("./models/user");
const userRouter= require("./routes/user");
const { isLoggedIn } = require("./middleware");
const MongoStore= require("connect-mongo");
const { error } = require("console");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


main().then(()=> console.log("Connected to Db")).catch(err => console.log(err));

const dbUrl= process.env.ATLASDB_URL;
// console.log(process.env.ATLASDB_URL);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
//   const dbUrl= process.env.ATLASDB_URL;
//   await mongoose.connect(dbUrl);
}


const store= MongoStore.create({
    // mongoUrl: dbUrl,
    mongoUrl: "mongodb://127.0.0.1:27017/wanderlust",
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24* 3600,
})
store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", error);
})
const sessionOptions= {
    store,
    secret: process.env.SECRET,
    resave: false, 
    saveUninitialized: true,
    Cookie: {
        expires: Date.now()+ 7* 24* 60* 60* 1000,
        maxAge: 7* 24* 60* 60* 1000,
        httpOnly: true
    },
}

app.use(session(sessionOptions));
app.use(flash());

// (58.7) Configuring Strategy--->
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser= req.user;
    console.log(res.locals.success);
    next();
})

// app.get("/demouser", async(req, res) => {
//     let fakeUser= new User({
//         email: "stu@gmail.com",
//         username: "delta-student",
//     })
//   let registeredUser= await User.register(fakeUser, "helloworld");//last 1 is password //register method save this data into database
//   res.send(registeredUser);
// })


// app.get("/testListening", async(req, res) => {
//     let sampleListing= new Listening({
//         title: "My new Villa",
//         decsription: "By the beach",
//         price: 12000,
//         location: "Calengute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// })

// const validateReview= ((req, res, next) => {
//     let {error}= reviewSchema.validate(req.body);
//     if(error){
//         let errMsg= error.details.map((el) => el.message).join(",");
//     }  else {
//         next();
//     }
// })


// // 5.Index Route--->
// app.get("/", wrapAsync(async(req, res) => {
//    const allListings= await Listing.find({});
//    res.render("listings/index.ejs", {allListings});
// })
// )

// // 7.New Route--->
// app.get("/new", (req, res) => {
//     res.render("listings/new.ejs");
// })

// // 6.Show Route--->
// app.get("/:id", wrapAsync(async(req, res) => {
//     let {id}= req.params;
//     const listing= await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs", {listing});
// })
// )

// // 8. Create Route--->
// app.post("/",wrapAsync(async(req, res, next) => {
//     let {title, description, image, price, country, location}= req.body;
//     // let result= listingSchema.validate(req.body);
//     // console.log(result);
//     // if(result.error){
//     //     throw new ExpressError(400, result.error);
//     // }
//     let newListing= new Listing({title, description, image, price, country, location});

//     await newListing.save();
//     console.log(newListing);
//     notifier.notify({
//         title: 'Notification',
//         message: 'Created Successfully',
//         sound: true,
//     });
//     res.redirect("/listings");
// })
// )

// // 9.Edit Route--->
// app.get("/:id/edit", wrapAsync(async (req, res) => {
//     let {id}= req.params;
//     const listing= await Listing.findById(id);
//     res.render("listings/edit.ejs", {listing});
// })
// )

// //9.(2) Edit and update route--
// app.put("/:id", wrapAsync(async (req, res) => {
//     if(!req.body){
//         throw new ExpressError(400, "Send valid data for listing");
//     }
//     let {id}= req.params;
//    const change= await Listing.findByIdAndUpdate(id, {...req.body});
//    console.log("change:", change);
// notifier.notify({
//     title: 'Notification',
//     message: 'Edited Successfully',
//     sound: true,
// });
//    res.redirect(`/listings/${id}`);
// })
// )

// // 10.Delete Route--->
// app.delete("/:id", wrapAsync(async(req, res) => {
//     let {id}= req.params;
//     let deletedListing= await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     notifier.notify({
//         title: 'Notification',
//         message: 'Deleted Successfully',
//         sound: true,
//     });
//     res.redirect("/listings");
// })
// )

app.use("/listings", listingRouter);   //jha pr bhi /listings aayega, vha pr hm listingAll use
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// // Reviews(Post Route)--->
// app.post("/listings/:id/reviews",  wrapAsync(async(req, res) => {
//     let listing= await Listing.findById(req.params.id);
//     let newReview= new Review(req.body.review);

//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();

//     console.log("New review saved");
//     res.redirect(`/listings/${listing.id}`)

// }),
// )

// // (55)Reviews--Delete Route--->
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
//     let {id, reviewId}= req.params;
//     let ans= await Review.findByIdAndDelete(reviewId);
//     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
// //    let ans= await Review.findByIdAndDelete(reviewId);
//     console.log("Review removed successfully ", ans);
//     res.redirect(`/listings/${id}`);
// }))


// app.get("/", (req, res) => {
//     res.send("Hii, I am Arpit rajput");
// })

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

// Error handling Middleware--->
app.use((err, req, res, next) => {
    // res.send("Something went wrong");
    let {statusCode= 500, message="Something went wrong"}= err;   //default value
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs", {err});
})

app.listen(port, () => {
    console.log(`Server is listening at port no. ${port}`);
})

// Form Validations--->
// When we enter data in the wrong format, the browser will check to see that the data 
// is in the correct format and within the constraintsset by the 


// Cookies--->
// HTTP cookies are the small blocks of data created by a web server while a user is browsing
// a website and placed on the user's computer or other device by the user's web browser


// (57)State--->
// Stateful Protocol-- It requires server to save the status & session. ex-ftp
// Stateless Portocol-- It doesn't require the server to retain the server info. ex-http

// Connect-flash (for show any msg)--->
// The flash is a special area of the session used for storing messages. Messages are written
// to the flash & cleared after being displayed to the user


// (58)Let's Understand --->
// Authentication-- It is the process of veryfying who someone is
// Authorization-- It is the process of veryfying that specific applications, files, & data
// a user has access to  

// (58.2)Storing Password--->
// We never stored a password as it is, we store their hashed form

// (58.3)Hashing--->
// For every input, there is fixed output
// They are one-way func, we can't get input from output 
// For a different input, there is a output of same length
// Small changes in input should bring large changes in output
// Ex-SHA256, MD5, CRC, bcrypt, pbkdf2

// (58.4)Salting--->
// Password Salting is a technique to protect passwords stored in databases by adding a
// string of 32 or more characters and then hashing them
