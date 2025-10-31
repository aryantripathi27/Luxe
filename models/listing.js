const mongoose = require("mongoose");
const Review = require("./review.js");
const { types, ref, required } = require("joi");
const { fileLoader } = require("ejs");
const { coordinates } = require("@maptiler/client");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
       type: String,
       required: true,
       },
       
    description: {
        type : String,
    },


image: {
  url: String,
  filename: String,
  },

price : { 
        type: Number,
        default:0,
    },

    location: {
        type: String,
    },

    country: {
        type: String,
    },
    
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },


    ],
   owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
   },

  geometry : {
        type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
        type : [Number],
        required: true,
    },
  }
}); 

listingSchema.post("findOneAndDelete" , async(listing)=>{
    if(listing){
await Review.deleteMany({_id: {$in : listing.reviews}});
}
});


const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing; 
