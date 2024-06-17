const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/forgot", (req, res) => {
  res.render("forgot");
});

router.get("/reset", (req, res) => {
  res.render("reset");
});

router.get("/contacts", (req, res) => {
  res.render("contacts");
});

// Weekly report of user
router.get("/week", (req, res) => {
  res.render("week");
});
// user detsils by admin
router.get("/users", (req, res) => {
  res.render("users");
});

// admin assigning projects
router.get("/projects", (req, res) => {
  res.render("projects");
});

router.post("/submit", userController.reg);

router.post("/login", userController.log);

// Weekly report:
// fetch first 3 common rows which are not changing from project table
router.get("/users-data", userController.getUsers);

// fetch dynamically added rows from project table which are added by admin in admin (projects) page
router.get("/projects-data", userController.getProjects);

// save report of users week report in weekly report table
router.post("/save-report", userController.saveReport);
// router.get("/get-report", userController.fetchAllWeeklyReports);

module.exports = router;
