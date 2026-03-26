const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// ===== DATABASE =====
const db = new sqlite3.Database("./database.db");

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.static("public"));
app.use(session({
  secret: "gsrp_secret",
  resave: false,
  saveUninitialized: true
}));

// ===== ROLES =====
const users = [
  { username: "owner1", password: "pass123", role: "owner" },
  { username: "manager1", password: "pass123", role: "manager" },
  { username: "director1", password: "pass123", role: "director" },
  { username: "staff1", password: "pass123", role: "staff" },
];

// ===== GENERATE 100 FTO ACCOUNTS =====
for (let i = 1; i <= 100; i++) {
  users.push({
    username: `fto${i}`,
    password: `fto${i}pass`,
    role: "fto"
  });
}

// ===== LOGIN =====
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) return res.status(401).send("Invalid login");

  req.session.user = user;
  res.send(user);
});

// ===== AUTH CHECK =====
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user) return res.status(401).send("Not logged in");

    const roles = ["fto", "staff", "director", "manager", "owner"];
    if (roles.indexOf(req.session.user.role) < roles.indexOf(role)) {
      return res.status(403).send("No permission");
    }
    next();
  };
}

// ===== DATABASE TABLES =====
db.run(`
CREATE TABLE IF NOT EXISTS roster (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  callsign TEXT,
  dept TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  dept TEXT,
  status TEXT DEFAULT 'pending'
)
`);

// ===== LOG FUNCTION (DISCORD WEBHOOKS) =====
const webhooks = {
  lspd: "YOUR_LSPD_WEBHOOK",
  bcso: "YOUR_BCSO_WEBHOOK",
  sasp: "YOUR_SASP_WEBHOOK",
  gangs: "YOUR_GANGS_WEBHOOK"
};

async function sendLog(dept, message) {
  const url = webhooks[dept];
  if (!url) return;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message })
  });
}

// ===== ROSTER =====
app.get("/roster", (req, res) => {
  db.all("SELECT * FROM roster", [], (err, rows) => {
    res.send(rows);
  });
});

app.post("/roster/add", requireRole("staff"), (req, res) => {
  const { name, callsign, dept } = req.body;

  db.run(
    "INSERT INTO roster (name, callsign, dept) VALUES (?, ?, ?)",
    [name, callsign, dept]
  );

  sendLog(dept, `Member Added: ${name}`);

  res.send("Added");
});

// ===== PROMOTE / DISCHARGE =====
app.post("/roster/delete", requireRole("manager"), (req, res) => {
  const { id, dept } = req.body;

  db.run("DELETE FROM roster WHERE id = ?", [id]);

  sendLog(dept, `Member Removed ID: ${id}`);

  res.send("Deleted");
});

// ===== APPLICATIONS =====
app.get("/applications", (req, res) => {
  db.all("SELECT * FROM applications", [], (err, rows) => {
    res.send(rows);
  });
});

app.post("/applications/add", (req, res) => {
  const { name, dept } = req.body;

  db.run("INSERT INTO applications (name, dept) VALUES (?, ?)", [name, dept]);

  sendLog(dept, `New Application: ${name}`);

  res.send("Submitted");
});

app.post("/applications/update", requireRole("manager"), (req, res) => {
  const { id, status } = req.body;

  db.run("UPDATE applications SET status = ? WHERE id = ?", [status, id]);

  res.send("Updated");
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});