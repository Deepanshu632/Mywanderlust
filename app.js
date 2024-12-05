if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose= require("mongoose");
const path =require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
 
const listings = require("./routes/listing.js");
const riviews  = require("./routes/riview.js");
const Users = require("./routes/users.js");

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const dbUrl = process.env.ATLAS_URL;

main()
.then((res)=>{
    console.log("connecion Successful");
})
.catch((err)=>{
    console.log(err);
});


 async function main(){
    await mongoose.connect(dbUrl);
 }

 const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
 })

 const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:"false",
    saveUninitialized:"true",
    cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
    },
};


//  app.get("/",(req,res)=>{
//  res.send("working");
//  });
 
app.use(session(sessionOptions));
app.use(flash());

//Authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) =>{
    res.locals.success= req.flash("Success"); 
    res.locals.error= req.flash("error"); 
    res.locals.curr= req.user;
    next();
});


app.use("/listings",listings);  //("/listings") ko match kiya jaygga listings ke sath jo routes se arhi hai.. 
app.use("/listings/:id/riviews",riviews);
app.use("/",Users);


// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// });


app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"} = err;
    res.status(status).render("listings/error.ejs",{err});
    console.log(err);
});


app.listen(8080,()=>{
    console.log("app is listening on port 8080");
});

