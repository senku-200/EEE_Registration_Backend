const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const cors = require("cors");
const app = express();
const port = 3000;
require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
app.get("/hello", (req, res) => {
  res.status(200).json({ message: "hello world!!!" });
  res.send("hello world!!");
});
app.post("/register", async (req, res) => {
  const {
    name,
    email,
    registernumber,
    phonenumber,
    gender,
    academicyear,
    department,
    college,
    events,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO registration (name,email,registernumber,phonenumber,gender,academicyear,department,college,events) values($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id",
      [
        name,
        email,
        registernumber,
        phonenumber,
        gender,
        academicyear,
        department,
        college,
        events,
      ]
    );
    res
      .status(201)
      .json({ message: "registrtation Completed", id: result.rows[0].id });
  } catch {
    console.error("Error saving user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.get("/registrations-list", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM registration");
    res.json(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
