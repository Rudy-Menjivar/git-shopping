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
// const passportConfig = { failureRedirect: "/login" };

const authRequired = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect("/login?required=1");
};

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

// // routes
// router.get("/", (req, res) => {
//   res.render("index");
// });

// // router.get("/members", authRequired, (req, res) => {
// //   const APIKey=process.env.API_KEY;
// //   APICart: APIKey,
// //   res.render("members");
// // });

// // members require auth & render with APICart
// router.get("/members", authRequired, (req, res) => {
//   res.render("members", {
//     APICart: APIKey,
//   });
// });

// router.get("/clothing", (req, res) => {
//   res.render("clothing");
// });

// router.get("/shoes", (req, res) => {
//   res.render("shoes");
// });

// router.all("/login", (req, res, next) => {
//   new Promise((resolve, reject) => {
//     if (req.method === "GET") {
//       return reject();
//     }
//     if (req.body.username && req.body.password) {
//       passport.authenticate("local", (err, user, info) => {
//         if (!err && user) {
//           return resolve(user);
//         }
//         reject(err);
//       })(req, res, next);
//     } else {
//       reject(new Error("Please fill all fields"));
//     }
//   })
//     .then(
//       user => new Promise((resolve, reject) => {
//         req.login(user, err => { // save authentication
//           if (err) {
//             return reject(err);
//           }
//           console.log("auth completed - redirecting to member area");
//           res.redirect("/members");
//         });
//       })
//     )
//     .catch(error => {
//       let errorMsg = (error && error.message) || "";
//       if (!error && req.query.required) {
//         errorMsg = "Authentication required";
//       }

//       res.render("login", {
//         csrfToken: req.csrfToken(),
//         hasError: errorMsg && errorMsg.length > 0,
//         error: errorMsg,
//         form: req.body
//       });
//     });
// });

// router.all("/register", (req, res) => {
//   new Promise(async (resolve, reject) => {
//     if (Object.keys(req.body).length > 0) {
//       // console.log(req.body)
//       if (
//         !(req.body.email && req.body.email.length > 5) ||
//         !(req.body.username && req.body.username.length > 1) ||
//         !(req.body.password && req.body.password.length > 3) ||
//         !(req.body.password2 && req.body.password2.length > 3)
//       ) {
//         reject("Please fill all fields");
//       } else if (
//         !(
//           req.body.email.indexOf("@") !== -1 &&
//           req.body.email.indexOf(".") !== -1
//         )
//       ) {
//         reject("Invalid email address");
//       } else if (req.body.password !== req.body.password2) {
//         reject("Password don't match");
//       } else if (await db.isUsernameInUse(req.body.username)) {
//         reject("Username is taken");
//       } else if (await db.isEmailInUse(req.body.email)) {
//         reject("Email address is already registered");
//       } else {
//         resolve(true);
//       }
//     } else {
//       resolve(false);
//     }
//   })
//     .then(
//       isValidFormData => new Promise((resolve, reject) => {
//         if (Object.keys(req.body).length > 0 && isValidFormData) {
//           db.createUserRecord({
//             username: req.body.username,
//             email: req.body.email,
//             password: req.body.password
//           })
//             .then(createdUser => {
//               resolve(createdUser);
//             })
//             .catch(err => reject(err));
//         } else {
//           resolve(false);
//         }
//       })
//     )
//     .then(createdUserRecord => {
//       if (createdUserRecord) {
//         // Log them in in the session
//         req.login(createdUserRecord, err => {
//           console.log(err);
//         });
//         res.render("register-success");
//       } else {
//         res.render("register", {
//           csrfToken: req.csrfToken(),
//           hasError: false,
//           form: req.body
//         });
//       }
//     })
//     .catch(error => {
//       // console.log(error)
//       res.render("register", {
//         csrfToken: req.csrfToken(),
//         hasError: true,
//         error,
//         form: req.body
//       });
//     });
// });
// router.get("/logout", authRequired, (req, res) => {
//   req.logout();
//   res.redirect("/");
// });
// Export routes for server.js to use
module.exports = router;
