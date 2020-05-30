const express = require("express"),
	  router  = express.Router(),
	  passport = require("passport"),
	  User     = require("../models/users"),
	  Campground = require("../models/users");

// Root Route
router.get("/",(req, res)=>{
	res.render("landing");
});

//Auth Routes
router.get("/register", function(req,res){
	res.render("register", {page: 'register'});
});

router.post("/register", function(req,res){
	var newUser = new User({   
		username: req.body.username, 
		firstname: req.body.firstname, 
		lastname: req.body.lastname, 
		email: req.body.email, 
	    avatar: req.body.avatar
	 });
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});
//show login form
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}) ,function(req,res){
	
})

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/campgrounds")
});

// User Profile
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      res.render("users/show", {user: foundUser, campgrounds: campgrounds});
    })
  });
});


module.exports = router;