const User= require("../models/user");

module.exports.renderSignupForm= (req, res) => {
    res.render("users/signup.ejs");
}

// SIGNUP--
module.exports.signup= async(req, res) => {
    try{
        let {username, email, password}= req.body;
    const newUser= new User({
        email,
        username,
    })
    let registeredUser= await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to wanderlust");
        res.redirect("/listings");
    })

    }  catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs");
}

// LOGIN--
module.exports.login= async(req, res) => { //used as route middleware to authenticate request
    req.flash("success", "Welcome to wanderlust, you are logged in")
    let redirectUrl= res.locals.redirectUrl  ||  "/listings";
    res.redirect(redirectUrl);
}

// LOGOUT--
module.exports.logout= (req, res) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }  else {
            req.flash("success", "You are logged out!");
            res.redirect("/listings");
        }
    })
}
