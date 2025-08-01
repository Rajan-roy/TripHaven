const Listing = require("../models/listing")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    id = id.trim(); // To avoid CastError due to extra space
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",}}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings"); // also correct URL spelling
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    let url = req.file.path;
    let filename = req.file.name;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    if (response.body.features.length) {
        newListing.geometry = response.body.features[0].geometry;
    }
    let savedListing =  await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    id = id.trim(); // Remove accidental spaces in ID
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested for does not exist!");
            res.redirect("/listings"); // also correct URL spelling
        }
        let originalImageUrl =  listing.image.url
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_100,w_150")
        res.render("listings/edit.ejs", { listing , originalImageUrl});
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;    
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if (req.body.listing.location) {
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();
        if (response.body.features.length) {
            listing.geometry = response.body.features[0].geometry;
            await listing.save();
        }
    }
    if (typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.name;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

    module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}