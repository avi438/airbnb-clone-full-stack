const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema, reviewSchema } = require("../utils/schema.js");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };


  module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
          populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist!");
    }
    res.render("listings/show.ejs", { listing });
  };

// simple create listing without upload features:
  // module.exports.createListing = async (req, res, next) => {
  //   if(!req.body.listing) {
  //     throw new ExpressError(400, "Send valid data for listing");
  //   }
  //   const newListing = new Listing(req.body.listing);
  //   newListing.owner = req.user._id; //for post author
  //   await newListing.save();
  //   req.flash("success", "New Listing Created");
  //   console.log(Listing);
  //   res.redirect("/listings");
  // };

//create listing with upload features
module.exports.createListing = async (req, res, next) => {
  if(!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; //for post author
  newListing.image = {url, filename};
  await newListing.save();
  req.flash("success", "New Listing Created");
  // console.log(Listing);
  res.redirect("/listings");
};


  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  };

  module.exports.updateListing = async (req, res) => {
    // console.log(req.body.listing);
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  };