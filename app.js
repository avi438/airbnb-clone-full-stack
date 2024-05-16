if(process.env.Node_ENV != "production") {
  require("dotenv").config();
}

console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); //for css layout
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//for express session (check in cookies for session)
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // today date + mili second(7 days, 24h, 60min, 60sec, 1000 mili sec)
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true // for cross-scripting attack
  },
};

//session and flash
app.use(session(sessionOptions));
app.use(flash()); // must be use before route

//passport: Login
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); // use static authenticate method of model in LocalStrategy

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //for login/logout & signup disappear feature
  next();
});

//for database
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_DB;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.get("/", (req, res) => {
  res.redirect('/listings');
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews); // to send parent ID to review.js we have to use mergeParams:true to their express.Route()

app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

//creating a demo user on database
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student"
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });



app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
