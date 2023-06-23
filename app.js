const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'my_first_zoo',
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// To serve the static files from the public directory
app.use(express.static('public'));

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

let successMessage = '';

// Render the main page with buttons
app.get('/', (req, res) => {
  res.render('index');
});

// Add route for /tiere/add
app.get('/tiere/add', (req, res) => {
  res.render('addTier', { successMessage: successMessage });
});

// Display all records from the "tiere" table
app.get('/tiere', (req, res) => {
  const sql = 'SELECT * FROM tiere';

  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.render('tiere', { tiere: result });
  });
});

app.get('/gehege', (req, res) => {
    const sql = 'SELECT * FROM gehege';
  
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render('tiere', { tiere: result });
    });
  });

  

// Add a new record to the "tiere" table
app.post('/tiere', (req, res) => {
  const { bezeichnung, geburtsdatum, geschlecht, größe, gewicht, kategorie_id, gehege_nr } = req.body;

  // Perform validation or any additional processing
  const sql = 'INSERT INTO tiere (bezeichnung, geburtsdatum, geschlecht, größe, gewicht, kategorie_id, gehege_nr) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [bezeichnung, geburtsdatum, geschlecht, größe, gewicht, kategorie_id, gehege_nr];

  connection.query(sql, values, (err, result) => {
    if (err) throw err;
    successMessage = 'Tier successfully added';
    res.render('addTier', { successMessage: successMessage });
  });
});


//Add a new record to the "Gehege Tabel"
app.post('/gehege', (req, res) => {
    const { bezeichnung, geburtsdatum, geschlecht, größe, gewicht, kategorie_id, gehege_nr } = req.body;
  
    // Perform validation or any additional processing
    const sql = 'INSERT INTO tiere (bezeichnung, geburtsdatum, geschlecht, größe, gewicht, kategorie_id, gehege_nr) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [bezeichnung, geburtsdatum, geschlecht, größe, gewicht, kategorie_id, gehege_nr];
  
    connection.query(sql, values, (err, result) => {
      if (err) throw err;
      successMessage = 'Tier successfully added';
      res.render('addTier', { successMessage: successMessage });
    });
  });



// Delete a record from the "tiere" table
app.post('/tiere/delete/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM tiere WHERE tiere_id = ?';

  connection.query(sql, id, (err) => {
    if (err) throw err;
    res.redirect('/tiere');
  });
});

// ... Similar routes for other tables ...

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
