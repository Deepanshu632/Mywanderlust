const Listing = require("../models/listing.js");
const Riview = require("../models/riview.js");


module.exports.postRiview = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newRiview = new Riview(req.body.riview);
    newRiview.author = req.user._id;
    console.log(newRiview);
    listing.riviews.push(newRiview);
    await newRiview.save();
    await listing.save();
    req.flash("Success", " New Riview Created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyRiview= async(req,res)=>{
    let{id,riviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{riviews:riviewId}});
    await Listing.findByIdAndDelete(riviewId);
    req.flash("Success", "Riview Deleted");
    res.redirect(`/listings/${id}`);
}