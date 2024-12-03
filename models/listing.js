const mongoose = require("mongoose");
const Riview = require("./riview.js"); 
const {Schema} = mongoose;

const listingSchema = new Schema({
    title:{
       type: String,
       required:true,
    },
    description:String,
    image:{
       filename: String,
       url: String,
    },
    price:Number,
    location:String,
    country:String,
    riviews:[
      {
         type:Schema.Types.ObjectId,
         ref:'Riview',
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:'User',
    },
    geometry:{
      type: {
         type: String, // Don't do `{ location: { type: String } }`
         enum: ['Point'], // 'location.type' must be 'Point'
         required: true
       },
       coordinates: {
         type: [Number],
         required: true
       },
    },
    
});

listingSchema.post("findOneAndDelete", async(listing)=>{
   if(listing){
      await Riview.deleteMany({_id: {$in: listing.riviews}});
   }
   console.log("Riview Deleted");
});

const Listing =  mongoose.model("Listing", listingSchema);
module.exports = Listing;
