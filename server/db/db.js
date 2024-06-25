const mysql = require("mysql");
const util = require("util");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fives@123",
  database: "teamtrack",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

db.query = util.promisify(db.query);
module.exports = db;
