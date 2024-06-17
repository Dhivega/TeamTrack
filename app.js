const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const path = require("path");
const app = express();
const routes = require("./server/routes/router");
const port = 3000;

// Static files
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));

// set views
app.set("views", "./views");
// app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//using router
app.use("/", routes);

// Listen on port 3000
app.listen(port, () => console.info(`Listening on port ${port}`));
