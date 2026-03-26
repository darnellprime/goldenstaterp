const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// DB
const db = new sqlite3.Database("./database.db");

// Middleware
app.use(express.json());
app.use(express.static("public"));

app.use(session({
  secret: "gsrp_secret",
  resave: false,
  saveUninitialized: true
}));

// ===== USERS (pre-created accounts) =====
const users = [
  { id: 1, username: "owner1", password: "pass123", role: "owner" },
  { id: 2, username: "director1", password: "pass123", role: "director" },
  { id: 3, username: "staff1", password: "pass123", role: "staff" },
];

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) return res.status(401).send("Invalid login");

  req.session.user = user;
  res.send(user);
});

// ===== GET CURRENT USER =====
app.get("/me", (req, res) => {
  res.send(req.session.user || null);
});

// ===== ROSTER TABLE (simple demo) =====
db.run(`
CREATE TABLE IF NOT EXISTS roster (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  callsign TEXT,
  dept TEXT
)
`);

// ===== GET ROSTER =====
app.get("/roster", (req, res) => {
  db.all("SELECT * FROM roster", [], (err, rows) => {
    res.send(rows);
  });
});

// ===== ADD MEMBER =====
app.post("/roster/add", (req, res) => {
  const { name, callsign, dept } = req.body;

  db.run(
    "INSERT INTO roster (name, callsign, dept) VALUES (?, ?, ?)",
    [name, callsign, dept]
  );

  res.send("Added");
});

// ===== START =====
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});