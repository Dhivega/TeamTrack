const db = require("../db/db");
const bcrypt = require("bcrypt");
exports.reg = async (req, res) => {
  console.log("res:" + res);
  const { fname, lname, email, phone, password, designation, address } =
    req.body;

  try {
    // Check if user already exists
    const existingUser = await db.query(
      "SELECT * FROM employees WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Account already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert the user into the database
    const sql = `
      INSERT INTO employees (firstname, lastname, email, ph_no, password, Designation, Address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      fname,
      lname,
      email,
      phone,
      hashedPassword,
      designation,
      address,
    ];

    await db.query(sql, values);

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.log = async (req, res) => {
  // console.log("res:" + res);
  const { email, password } = req.body;

  try {
    // Fetch user data from MySQL database
    const results = await db.query("SELECT * FROM employees WHERE email = ?", [
      email,
    ]);

    if (results.length > 0) {
      const user = results[0];
      console.log("password:" + password);
      console.log("User password:" + user.password);
      // Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        console.log("User data verified successfully");
        console.log("result", user);
        return res.json({ success: true, message: "Welcome!..", data: user });
      } else {
        console.log("Incorrect password");
        return res
          .status(401)
          .json({ success: false, message: "Incorrect password" });
      }
    } else {
      console.log("User not found");
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
// Weekly report:
// fetch first 3 common rows which are not changing from project table

exports.getUsers = (req, res) => {
  // console.log("res:" + res);
  const query =
    "SELECT code as code,Description as description,Solution as solution,Activity_type as activity_Type,subsidiary as subsidiary,complementary_Description as complementary_Description  FROM project limit 3";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch user data" });
    }
    res.json({ success: true, data: results });
  });
};

// fetch dynamically added rows from project table which are added by admin in admin (projects) page
exports.getProjects = (req, res) => {
  // console.log("res:" + res);
  const query =
    "SELECT code as code,Description as description,Solution as solution,Activity_type as activity_Type,subsidiary as subsidiary,complementary_Description as complementary_Description FROM project LIMIT 3, 1000";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      return res
        .status(500)
        .json({ success: false, message: "Failed to fetch user data" });
    }
    res.json({ success: true, data: results });
    // console.log("res:" + results.code);
  });
};

exports.saveReport = (req, res) => {
  const {
    year,
    month,
    reportData,
    weekno1,
    weekno2,
    weekno3,
    weekno4,
    weekno5,
  } = req.body;
  console.log(req.body);

  if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No report data provided" });
  }

  const query = `
    INSERT INTO weekly_report (code, description, solution, activity_Type, subsidiary, complementary_Description, year, month, weekno1, weekno2, weekno3, weekno4, weekno5, data1, data2, data3, data4, data5)
    VALUES ?`;

  const values = reportData.map((row) => [
    row.code || null,
    row.description || null,
    row.solution || null,
    row.activity_Type || null,
    row.subsidiary || null,
    row.complementary_Description || null,
    year,
    month,
    weekno1,
    weekno2,
    weekno3,
    weekno4,
    weekno5,
    row.data1 || null,
    row.data2 || null,
    row.data3 || null,
    row.data4 || null,
    row.data5 || null,
  ]);

  console.log("Values:", values);

  db.query(query, [values], (error, results) => {
    if (error) {
      console.error("Error inserting data:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to save report" });
    }
    res.json({ success: true, message: "Report saved successfully!" });
  });
};

// exports.fetchAllWeeklyReports = (req, res) => {
//   const query = `
//     SELECT * FROM weekly_report
//   `;

//   db.query(query, (error, results) => {
//     if (error) {
//       console.error("Error fetching data:", error);
//       return res
//         .status(500)
//         .json({ success: false, message: "Failed to fetch report data" });
//     }
//     res.json({ success: true, data: results });
//   });
// };
