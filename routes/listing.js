const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../utils/schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner ,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

//for image upload
const multer = require("multer");
const{storage} = require("../cloudconfig.js");
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });

//!router.route : for mult same req
/* 
router.route("/")
    .get(wrapAsync (listingController.index))
    .post(
    isLoggedIn,
    validateListing, 
    wrapAsync (listingController.createListing));
*/

//Index Route
// router.get("/", wrapAsync (listingController.index));
  
//New Route
router.get("/new", 
isLoggedIn, 
listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync (listingController.showListing));

  
//index & Create Route
router
.route("/")
.get( wrapAsync (listingController.index))
.post(
    isLoggedIn,
    // validateListing, 
    upload.single("listing[image]"),
    wrapAsync (listingController.createListing)
);
  
//Edit Route
router.get("/:id/edit", 
isLoggedIn, 
isOwner, 
wrapAsync (listingController.renderEditForm));


//Update Route
router.put("/:id", 
isLoggedIn, 
isOwner, 
validateListing, 
wrapAsync (listingController.updateListing));

//Delete Route
router.delete("/:id", 
isLoggedIn, 
isOwner, 
wrapAsync (listingController.destroyListing));

module.exports = router;



//! ("/:id") = thsese types of path should be used at last