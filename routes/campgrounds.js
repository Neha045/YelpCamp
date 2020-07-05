const express = require("express"),
	  router  = express.Router(),
	  Campground     = require("../models/campground"),
	  Comment        = require("../models/comment");
var middleware     = require("../middleware");

// INDEX - show all
router.get("/", (req,res) =>{
	 var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB
        Campground.find({name: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              if(allCampgrounds.length < 1) {
                  noMatch = "No campgrounds match that query, please try again.";
              }
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    } else {
        // Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
           }
        });
    }

})
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, (req,res)=>{
	//get data from form and add to campgrounds
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name, price:price, image:image, description:desc, author:author};
	// create a new campground and add to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log("Error");
		}else{
			//redirect to campgrounds page
			res.redirect("/campgrounds");	
		}
	});
})
// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, (req,res)=>{
	res.render("campgrounds/new");
})
//SHOW - show more info about one capmground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			res.redirect("back");
		}else{
		res.render("campgrounds/edit", {campground : foundCampground});
		}
	});
});
	
	
//UPDATE route
router.put("/:id",middleware.checkCampgroundOwnership, function(req,res){
	//find and update the correct campgrounds
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
	//redirect somewhere
})
//DESTROY campground route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req,res){
	Campground.findByIdAndDelete(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");			
		}
	})
});
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;


