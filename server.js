/**
 * Goat Selling App - Backend
 * WARNING: This app contains intentional security vulnerabilities for educational purposes.
 */

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// SECURITY ISSUE 1: Hardcoded credentials (agents often do this for "demo" apps)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const API_SECRET_KEY = 'sk_live_goat_seller_12345_secret_key';
const DB_PATH = './goats.db';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

const db = new sqlite3.Database(DB_PATH);

// Initialize DB with vulnerable schema (no prepared statements in init)
db.run(`
  CREATE TABLE IF NOT EXISTS goats (
    id INTEGER PRIMARY KEY,
    name TEXT,
    breed TEXT,
    price REAL,
    description TEXT,
    seller_id INTEGER
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT,
    password TEXT,
    email TEXT
  )
`);

// SECURITY ISSUE 2: SQL Injection - building query from user input directly
app.get('/api/goats/search', (req, res) => {
  const query = req.query.q || '';
  // Vulnerable: concatenating user input into SQL
  const sql = `SELECT * FROM goats WHERE name LIKE '%${query}%' OR breed LIKE '%${query}%'`;
  db.all(sql, (err, rows) => {
    if (err) {
      // SECURITY ISSUE 3: Verbose error messages expose internal details
      res.status(500).json({ error: err.message, stack: err.stack });
      return;
    }
    res.json(rows);
  });
});

// SECURITY ISSUE 4: SQL Injection on id parameter
app.get('/api/goats/:id', (req, res) => {
  const id = req.params.id;
  db.all(`SELECT * FROM goats WHERE id = ${id}`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows[0] || null);
  });
});

// SECURITY ISSUE 5: No authentication/authorization - anyone can add goats
app.post('/api/goats', (req, res) => {
  const { name, breed, price, description } = req.body;
  const sql = `INSERT INTO goats (name, breed, price, description, seller_id) VALUES ('${name}', '${breed}', ${price}, '${description}', 1)`;
  db.run(sql, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, name, breed, price });
  });
});

// SECURITY ISSUE 6: Insecure "auth" - password in plain text, weak check
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // SECURITY ISSUE 7: Predictable session - just set username in cookie, no signing
    res.cookie('user', username, { httpOnly: false }); // httpOnly: false allows XSS to steal
    res.cookie('isAdmin', 'true');
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// SECURITY ISSUE 8: IDOR - no check that user owns the resource
app.delete('/api/goats/:id', (req, res) => {
  const id = req.params.id;
  db.run(`DELETE FROM goats WHERE id = ${id}`, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: this.changes });
  });
});

// "Admin" endpoint - checks cookie only, no proper session
app.get('/api/admin/stats', (req, res) => {
  if (req.cookies.isAdmin === 'true') {
    db.get('SELECT COUNT(*) as count FROM goats', (err, row) => {
      res.json({ totalGoats: row.count, secret: API_SECRET_KEY });
    });
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});

// Seed some goats
db.run("INSERT OR IGNORE INTO goats (id, name, breed, price, description, seller_id) VALUES (1, 'Billy', 'Nubian', 450, 'Friendly and great milk production', 1)");
db.run("INSERT OR IGNORE INTO goats (id, name, breed, price, description, seller_id) VALUES (2, 'Daisy', 'Alpine', 380, 'Very gentle with kids', 1)");
db.run("INSERT OR IGNORE INTO goats (id, name, breed, price, description, seller_id) VALUES (3, 'Horns', 'Boer', 520, 'Premium meat goat', 1)");

app.listen(PORT, () => {
  console.log(`Goat Seller running at http://localhost:${PORT}`);
});
