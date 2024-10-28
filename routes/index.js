var express = require("express");
var router = express.Router();
const User = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local")
const upload = require('../utils/multer')
const Post = require('./post')

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
};

passport.use(new localStrategy(User.authenticate()));

//get routes

router.get("/", function (req, res, next) {
  res.render("index", { nav: false});
});

router.get("/register", (req, res) => {
  res.render("register", { nav: false});
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/profile", isLoggedIn, async(req, res) => {
  const user = await User.findOne({username: req.session.passport.user}).populate('posts')
  res.render("profile", {user, nav: true});
});

router.get('/add', (req,res)=>{
   res.render('add',{nav:true})
})

router.get('/show/posts',  async(req, res)=>{
  const user = await User.findOne({username: req.session.passport.user}).populate('posts')
  res.render('show',{user, nav: true})
})

router.get('/show/posts/:id',  async(req, res)=>{
  const post = await Post.findOne({_id: req.params.id}).populate('user')
  res.render('postdetails',{post, nav: true})
})

router.get('/feed',async(req,res)=>{
  const posts = await Post.find({}).populate('user')
  
  res.render('feed',{posts, nav: true})
})

//post routes

router.post("/register", (req, res) => {
  const data = new User({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
  });
  User.register(data, req.body.password).then(() => {
    passport.authenticate("local")(req, res, function () {
      res.redirect("/profile");
    });
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/profile",
  })
);

router.post('/fileupload', isLoggedIn, upload.single('image'), async(req, res, next)=>{
  const user = await User.findOne({username: req.session.passport.user})
  user.profilePic = req.file.filename;
  await user.save();
  res.redirect('/profile')
})

router.post('/createpost' ,isLoggedIn, upload.single('postImage') ,async(req,res)=>{
  const user = await User.findOne({ username: req.session.passport.user }).populate('posts');

  const post = await Post.create({
    user: user._id,
    title : req.body.title,
    description: req.body.description,
    image: req.file.filename,
  });

   user.posts.push(post._id)
   await user.save()
   res.redirect('/profile')
})

module.exports = router; 
