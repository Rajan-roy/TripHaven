const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isreviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");

//Post Review Route

router.post("/",isLoggedIn, validateReview, wrapAsync (reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,
    wrapAsync(reviewController.destroyReview)
);
module.exports = router;