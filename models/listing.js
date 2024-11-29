
const mongoose= require("mongoose");
const Review = require("./review");
const { type } = require("os");
const Schema= mongoose.Schema;

const listingSchema= new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    
    image: {
        // type: String,
        filename: { type: String},
        url: { type: String ,     
               default: "https://demo-source.imgix.net/house.jpg",
               set: (v) => v === "" ? "https://demo-source.imgix.net/house.jpg" : v,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",   //model name
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    
});

listingSchema.post("findOneAndDelete", async(listing1) => {
    if(listing1) {
        await Review.deleteMany({_id: {$in: listing1.reviews}});
    }
})
const Listing=  mongoose.model("Listing", listingSchema);
module.exports= Listing;