const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// XSS detection
function isXssSuspected(input) {
  if (typeof input !== 'string') return true;
  const xssPattern = /[<>{}()"']/g;
  return xssPattern.test(input);
}

// Basic sanitization
function sanitizeInput(input) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// GET home page with form
app.get('/', (req, res) => {
  res.render('index', { error: null });
});

// POST search from form
app.post('/search', (req, res) => {
  const term = req.body.q;

  if (!term || isXssSuspected(term)) {
    return res.render('index', { error: 'Invalid input detected. Please try again.' });
  }

  const sanitized = sanitizeInput(term);
  res.render('results', { searchTerm: sanitized });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening at http://127.0.0.1:${port}`);
});
