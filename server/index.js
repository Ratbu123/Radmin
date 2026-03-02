const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

app.get("/testimonials", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM testimonials ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/testimonials", async (req, res) => {
  const { rating, author, quote } = req.body;

  if (!rating || !author || !quote) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO testimonials (rating, author, quote) VALUES (?, ?, ?)",
      [rating, author, quote]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/testimonials/:id", async (req, res) => {
  const { id } = req.params;
  const { rating, author, quote } = req.body;

  if (!rating || !author || !quote) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const [result] = await db.query(
      "UPDATE testimonials SET rating = ?, author = ?, quote = ? WHERE id = ?",
      [rating, author, quote, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/testimonials", async (req, res) => {
  const { ids } = req.body; // expects an array of IDs
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No IDs provided" });
  }

  try {
    const [result] = await db.query(
      `DELETE FROM testimonials WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids
    );
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/blogs", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM blogs ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/blogs", async (req, res) => {
  const { title, category, excerpt, date } = req.body;

  if (!title || !category || !excerpt || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO blogs (title, category, excerpt, date) VALUES (?, ?, ?, ?)",
      [title, category, excerpt, date]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, category, excerpt, date } = req.body;

  if (!title || !category || !excerpt || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const [result] = await db.query(
      "UPDATE blogs SET title = ?, category = ?, excerpt = ?, date = ? WHERE id = ?",
      [title, category, excerpt, date, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/blogs", async (req, res) => {
  const { ids } = req.body; // expects array of IDs
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "No IDs provided" });
  }

  try {
    const [result] = await db.query(
      `DELETE FROM blogs WHERE id IN (${ids.map(() => "?").join(",")})`,
      ids
    );
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});