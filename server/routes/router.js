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

router.get("/about", (req, res) => {
  res.render("about");
});
router.get("/progress", (req, res) => {
  res.render("progress");
});

router.get("/forgot", (req, res) => {
  res.render("forgot");
});

router.get("/demo", (req, res) => {
  res.render("demo");
});

router.get("/week", (req, res) => {
  res.render("week");
});
router.get("/projects", (req, res) => {
  res.render("projects");
});

router.post("/login", userController.log);
router.post("/submit", userController.reg);
// router.post("/report-table", userController.report);
// router.post("/project-table", userController.project);

// router.post("/user-table", userController.user);

// Fetch all users
router.get("/users-data", userController.getAllUsers);

// Add a new user
router.post("/save", userController.addUser);

// Update a user
router.put("/users", userController.updateUser);

// Delete a user
router.delete("/users/:user_id", userController.deleteUser);

router.post("/add-project", userController.addProject);
router.put("/update-project", userController.updateProject);
router.delete("/delete-project/:Project_id", userController.deleteProject);
router.get("/projects-data", userController.getAllProjects);

router.get("/progress-data", userController.getAllProgress);
router.put("/update-progress", userController.updateProgress);
router.post("/add-progress", userController.addprogress);

router.get("/users-data", userController.getUsers);

router.get("/projects-data", userController.getProjects);
router.post("/forgot-password", userController.getmail);

// Weekly report:
// fetch first 3 common rows which are not changing from project table
router.get("/report-data", userController.getreport);

// fetch dynamically added rows from project table which are added by admin in admin (projects) page
router.get("/proj-data", userController.getProj);

// save report of users week report in weekly report table
router.post("/save-report", userController.saveReport);
// router.get("/get-report", userController.fetchAllWeeklyReports);

module.exports = router;
