const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


//INDEX ROUTE: GET Request accept on /Listing ---> return to the all listings
//CREATE ROUTE: Handles form submission to create a new listing.
router.route("/")
.get(wrapAsync (listingController.index))
.post(isLoggedIn, upload.single("listing[image]"),validateListing,wrapAsync (listingController.createListing));

//New Route: Route to display a form for creating a new listing.
router.get("/new",isLoggedIn, listingController.renderNewForm);

//SHOW ROUTE: Any individuals Listings Data Print
//UPDATE ROUTE (Handles form submission to update a listing)
//DELETE ROUTE (Removes a listing from the database)
router.route("/:id")
.get(wrapAsync (listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync (listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync (listingController.deleteListing));

//EDIT ROUTE: Shows a form to update an existing listing.
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync (listingController.renderEditForm));

module.exports = router;