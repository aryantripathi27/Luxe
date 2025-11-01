const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// ✅ Allowed categories (exactly as per enum in Listing model)
const allowedCategories = [
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
];

// ---------------------
// ✅ All Listings + Create
// ---------------------
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// ---------------------
// ✅ New Listing Form
// ---------------------
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs", { categories: allowedCategories });
});

// ---------------------
// ✅ Search Route
// ---------------------
router.get(
  "/search",
  wrapAsync(async (req, res) => {
    const query = req.query.q?.trim();

    if (!query) return res.redirect("/listings");

    const listings = await Listing.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { location: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    if (listings.length === 0) {
      req.flash("error", `No listings found for "${query}"`);
      return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: listings });
  })
);

// ---------------------
// ✅ Category Filter Route
// ---------------------
router.get(
  "/category/:category",
  wrapAsync(async (req, res) => {
    const { category } = req.params;
    const normalizedCategory = category.toLowerCase().trim();

    if (!allowedCategories.includes(normalizedCategory)) {
      req.flash("error", `Invalid category "${category}"`);
      return res.redirect("/listings");
    }

    const listings = await Listing.find({ category: normalizedCategory });

    if (listings.length === 0) {
      req.flash("error", `No listings found for "${category}"`);
      return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: listings });
  })
);

// ---------------------
// ✅ Single Listing Show / Edit / Update / Delete
// ---------------------
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

// ---------------------
// ✅ Edit Listing Form
// ---------------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing, categories: allowedCategories });
  })
);

module.exports = router;
