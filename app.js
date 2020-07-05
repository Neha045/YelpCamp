const express        = require('express'),
	  app            = express(),
	  bodyParser     = require("body-parser"),
	  mongoose       = require("mongoose"),
	  passport       = require("passport"),
	  flash          = require("connect-flash"),
	  LocalStrategy  = require("passport-local"),
	  methodOverride = require("method-override"),
	  Campground     = require("./models/campground"),
	  Comment        = require("./models/comment"),
	  User           = require("./models/users"),
	  seedDB         = require("./seeds");

// Requireing Routes
const campgroundRoutes  = require("./routes/campgrounds"),
	  commentRoutes     = require("./routes/comments"),
	  indexRoutes       = require("./routes/index");
const url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12";
// seedDB(); //seed the database
mongoose.connect(url,  {useNewUrlParser:true, useUnifiedTopology:true});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"Rusty is cutest!!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentuser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Using Routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 8080, function(){
	console.log("The YelpCamp server has started!!!!");
});