/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const express = require("express");
const router = express.Router();

const session = require("express-session");
const csurf = require("csurf");
const helmet = require("helmet");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../models/db")(session);

const APIKey=process.env.API_KEY;

router.use(
  session({
    secret: "awesome auth",
    store: db.SessionStore,
    resave: false,
    saveUninitialized: true
  })
);

// security
const csrf = csurf({ cookie: true });
router.use(helmet());
router.use(csrf);
router.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") {
    return next(err);
  }
  res.status(403).render("error", { message: "Invalid form submission!" });
});

// passport
router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.isLoggedIn = req.user && req.user.uid > 0;
  next();
});

passport.use(
  new LocalStrategy((username, password, done) => {
    db.getUserByUsername(username)
      .then(async user => {
        if (!user) {
          return done(new Error("User not found!"), false);
        }
        // eslint-disable-next-line curly
        if (!(await db.isPasswordHashVerified(user.password_hash, password)))
          return done(new Error("Invalid Password"), false);
        return done(null, user);
      })
      .catch(err => {
        return done(err);
      });
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.uid);
});

passport.deserializeUser((uid, cb) => {
  db.getUserById(uid)
    .then(user => {
      cb(null, user);
    })
    .catch(err => {
      cb(err, null);
    });
});

module.exports = router;
