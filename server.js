// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;

// Import routes and give the server access to them
const routes = require("./controllers/gsController.js");
const routes2 = require("./controllers/gsController2.js"); // New Controller Route ***********
// Compress all responses, set Handlebars and create express app
const compression = require('compression')
const exphbs = require("express-handlebars");
const app = express();
app.use(compression())
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
app.use(routes2); // New Controller Route********
// App start
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
