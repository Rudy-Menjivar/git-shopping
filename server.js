// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
// const db = require("./models");   // temporarily disabled

// Import routes and give the server access to them
const routes = require("./controllers/gsController.js");

// Set Handlebars and create express app
const exphbs = require("express-handlebars");
const app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configuring middleware needed for authentication & set static folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get routes from gsController
app.use(routes);

// App start
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

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
