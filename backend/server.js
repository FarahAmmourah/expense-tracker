require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const allowedCategories = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Other"
];


// GET /api/expenses
// Return all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        amount::float8 AS amount,
        category,
        to_char(date, 'YYYY-MM-DD') AS date
      FROM expenses
      ORDER BY id
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get expenses"
    });
  }
});


// GET /api/expenses/:id
// Return one expense
app.get("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({
      message: "Expense not found"
    });
  }

  try {
    const result = await pool.query(`
      SELECT
        id,
        title,
        amount::float8 AS amount,
        category,
        to_char(date, 'YYYY-MM-DD') AS date
      FROM expenses
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get expense"
    });
  }
});


// POST /api/expenses
// Add a new expense
app.post("/api/expenses", async (req, res) => {
  const { title, amount, category, date } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  const numericAmount = Number(amount);

  if (
    amount === undefined ||
    amount === null ||
    amount === "" ||
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    return res.status(400).json({
      message: "Amount must be a number greater than 0"
    });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      message:
        "Category must be Food, Transport, Bills, Entertainment, or Other"
    });
  }

  if (!date || typeof date !== "string") {
    return res.status(400).json({
      message: "Date is required"
    });
  }

  try {
    const result = await pool.query(`
      INSERT INTO expenses (title, amount, category, date)
      VALUES ($1, $2, $3, $4)
      RETURNING
        id,
        title,
        amount::float8 AS amount,
        category,
        to_char(date, 'YYYY-MM-DD') AS date
    `, [
      title.trim(),
      numericAmount,
      category,
      date
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Invalid expense data"
    });
  }
});


// PUT /api/expenses/:id
// Update an expense
app.put("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({
      message: "Expense not found"
    });
  }

  const { title, amount, category, date } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message: "Title is required"
    });
  }

  const numericAmount = Number(amount);

  if (
    amount === undefined ||
    amount === null ||
    amount === "" ||
    !Number.isFinite(numericAmount) ||
    numericAmount <= 0
  ) {
    return res.status(400).json({
      message: "Amount must be a number greater than 0"
    });
  }

  if (!allowedCategories.includes(category)) {
    return res.status(400).json({
      message:
        "Category must be Food, Transport, Bills, Entertainment, or Other"
    });
  }

  if (!date || typeof date !== "string") {
    return res.status(400).json({
      message: "Date is required"
    });
  }

  try {
    const result = await pool.query(`
      UPDATE expenses
      SET
        title = $1,
        amount = $2,
        category = $3,
        date = $4
      WHERE id = $5
      RETURNING
        id,
        title,
        amount::float8 AS amount,
        category,
        to_char(date, 'YYYY-MM-DD') AS date
    `, [
      title.trim(),
      numericAmount,
      category,
      date,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Invalid expense data"
    });
  }
});


// DELETE /api/expenses/:id
// Delete an expense
app.delete("/api/expenses/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(404).json({
      message: "Expense not found"
    });
  }

  try {
    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Expense not found"
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete expense"
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});