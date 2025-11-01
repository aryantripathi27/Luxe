const axios = require("axios");
require("dotenv").config();
const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    next(err);
  }
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.createListing = async (req, res, next) => {
  try {
    if (!req.user) {
      req.flash("error", "You must be logged in to create a listing!");
      return res.redirect("/login");
    }

    const locationQuery = req.body.listing.location?.trim();
    if (!locationQuery) {
      throw new Error("Location is missing");
    }

    const response = await axios.get(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(locationQuery)}.json`,
      {
        params: { key: process.env.MAPTILER_API_KEY, limit: 1 },
      }
    );

    if (!response.data?.features?.length) {
      throw new Error("Location not found");
    }

    const geometry = response.data.features[0].geometry;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = geometry;

    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    if (newListing.category) {
      newListing.category = newListing.category.toLowerCase().trim();
    }

    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (err) {
    console.log("🔥 CREATE LISTING ERROR:", err.message);
    next(err);
  }
};

module.exports.renderEditForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    const originalImageUrl = listing.image?.url
      ? listing.image.url.replace("/upload", "/upload/w_250")
      : null;

    res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (err) {
    next(err);
  }
};

module.exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
      await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log("🔥 UPDATE LISTING ERROR:", err.message);
    next(err);
  }
};

module.exports.destroyListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
