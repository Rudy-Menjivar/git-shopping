// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
// Requiring passport as we've configured it
// const passport = require("./config/passport");  // disabling, see controller
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
// const db = require("./models");   // temporarily disabled

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
// app.use(passport.initialize());    // temporarily disabled, see controller
// app.use(passport.session());       // temporarily disabled, ""

// Set Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Import routes and give the server access to them
var routes = require("./controllers/gsController.js");

app.use(routes);

// App start
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))

// Requiring our routes // temporarily disabled
// require("./routes/html-routes.js")(app);  // routes moved to controllers
// require("./routes/api-routes.js")(app);   // routes moved to controllers

// Syncing our database and logging a message to the user upon success
// db.sequelize.sync().then(() => {
//   app.listen(PORT, () => {
//     console.log(
//       "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
//       PORT,
//       PORT
//     );
//   });
// });