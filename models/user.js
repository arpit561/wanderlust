// (58.6)User Model--->
const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const passportLocalMongoose= require("passport-local-mongoose");

const userSchema= new Schema({
    email: {
        type: String,
        required: true,
    },
})

userSchema.plugin(passportLocalMongoose);   //It creates username & password with salting and hashing itself

module.exports= mongoose.model("User", userSchema);