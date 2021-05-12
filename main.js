//const subscriber = require("./models/subscriber");

const express = require("express"), app = express(),
router = express.Router(),
homeController = require("./controllers/homeController"),
errorController = require("./controllers/errorController"), 
layouts = require("express-ejs-layouts"), 
mongoose = require("mongoose"), 
subscribersController = require("./controllers/subscribersController"),
usersController = require("./controllers/usersController"),
coursesController = require("./controllers/coursesController"),
methodOverride = require("method-override"),
cookieParser = require("cookie-parser"),
expressSession = require("express-session"),
expressValidator = require("express-validator"),
passport = require("passport"),
connectFlash = require("connect-flash")
User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/confetti_cuisine", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);

app.set("port", process.env.PORT || 3000);

app.set("view engine", "ejs");

app.use(express.urlencoded({extended: false}));
router.use(methodOverride("_method", {methods: ["POST", "GET"]}));
router.use(layouts);
router.use(express.static("public"));
router.use(expressValidator());

router.use(express.json());

router.use(cookieParser("my_passcode"));
router.use(expressSession({
    secret: "my_passcode",
    cookie: {
        maxAge: 360000
      },
    resave: false,
    saveUninitialized: false
 }));
router.use(connectFlash());

router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
//passport.use('local',User.serializeUser);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.User;
  next();
})


router.get("/", homeController.index);

router.get("/users", usersController.index, usersController.indexView);
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.validate, usersController.create, usersController.redirectView);
router.get("/users/login", usersController.login);
router.post("/users/login", usersController.authenticate);
router.post("/users/logout", usersController.logout, usersController.redirectView);

router.get("/users/:id", usersController.show, usersController.showView);
router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);
router.delete("/users/:id/delete", usersController.delete, usersController.redirectView);

router.get("/subscribers", subscribersController.index, subscribersController.indexView);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create, subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);
router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView);

router.get("/courses", coursesController.index, coursesController.indexView);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create, coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView);
router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);
router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView);

router.use(errorController.pageNotFoundError );
router.use(errorController.internalServerError );

app.use("/", router);

app.listen(app.get("port"), () => {
    console.log(`Server is running on port: $ ${app.get("port")}`)

});
