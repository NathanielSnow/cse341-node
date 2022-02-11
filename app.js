const PORT = process.env.PORT || 3000;

const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://nathanielsnow-cse341:L6gSuv4ON67BHBrF@cluster0.rqoxj.mongodb.net/shop";

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
<<<<<<< HEAD
    .catch((err) => {
      next(new Error(err));
    });
=======
    .catch((err) => console.log(err));
>>>>>>> parent of 9a47bba... Update 2/4/2022
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

const MONGODB_URL =
  process.env.MONGODB_URL ||
  "mongodb+srv://nathanielsnow-cse341:L6gSuv4ON67BHBrF@cluster0.rqoxj.mongodb.net/shop?retryWrites=true&w=majority";

const cors = require("cors"); // Place this with other requires (like 'path' and 'express')
const corsOptions = {
  origin: "https://final-cse341-snow.herokuapp.com/",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const options = {
  family: 4,
};

mongoose
  .connect(MONGODB_URI, options)
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Nate",
          email: "snow@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
