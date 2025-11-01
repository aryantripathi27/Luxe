const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    url: String,
    filename: String,
  },

  price: {
    type: Number,
    default: 0,
  },

  location: {
    type: String,
  },

  country: {
    type: String,
  },

  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true, // ✅ ensures consistency
    enum: [
      "trending",
      "rooms",
      "iconic cities",
      "mountains",
      "castles",
      "amazing pools",
      "camping",
      "farms",
      "arctic",
      "domes",
      "boats",
    ],
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

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point", // ✅ optional for now
    },
    coordinates: {
      type: [Number],
      default: [0, 0], // ✅ optional placeholder
    },
  },
});

// ✅ index for category filter/search
listingSchema.index({ category: 1 });

// ✅ delete reviews when listing deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
