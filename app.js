const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const router = express.Router();
const { formatDate } = require('./public/DataReform');
const { changeColor } = require('./public/DataReform');
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
  if (err) {
    res.render('error',{err:message});
    return;
  }
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

app.get('/gehege', (req, res) => {
  const sql = 'SELECT * FROM gehege';

  connection.query(sql, (err, result) => {
    if (err) throw err;

    // Extract data for chart
    const gehegeData = result.map((row) => ({
      gehege_name: row.gehege_name,
      kapazität: row.kapazität,
    }));

    // Prepare chart configuration
    const chartConfig = {
      type: 'bar',
      data: {
        labels: gehegeData.map((data) => data.gehege_name),
        datasets: [{
          label: 'Capacity',
          data: gehegeData.map((data) => data.kapazität),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Capacity',
            },
          },
        },
      },
    };

    res.render('gehege', { gehege: result, chartConfig, gehegeData });
  });
});


app.post('/gehege', (req, res) => {
  
});

app.post('/gehege/add', (req, res) => {
  const { gehege_nr, gehege_name, größe, kapazität, bezeichnung, gefahrenklasse } = req.body;

  // Perform validation or any additional processing
  const sql = 'INSERT INTO gehege (gehege_nr, gehege_name, größe,  kapazität, bezeichnung, gefahrenklasse) VALUES (?, ?, ?, ?, ?, ?)';
const values = [gehege_nr, gehege_name, größe,  kapazität, bezeichnung, gefahrenklasse];

  connection.query(sql, values, (err, result) => {
    if (err) {
      const message = err;
      res.render('error',{err:message});
      return;
    }
    res.redirect('/gehege');
});
});
app.get('/gehege/add', (req, res) => {
  const sql = 'SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
  const values = ['my_first_zoo', 'gehege'];

  connection.query(sql, values, (err, result) => {
    if (err) {
      const message = err;
      res.render('error',{err:message});
      return;
    }

    const tableColumns = result.map((row) => row.COLUMN_NAME);
    res.render('addGehege',{tableColumns});
  });
});

// Delete a record from the "tiere" table
app.post('/gehege/delete/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM gehege WHERE gehege_nr = ?';

  connection.query(sql, id, (err) => {
    if (err) {
      const message = err;
      res.render('error',{err:message});
      return;
    }
    res.redirect('/gehege'); 
  });
});




app.get('/paten/add', (req, res) => {
  const sql = 'SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
  const values = ['my_first_zoo', 'paten'];

  connection.query(sql, values, (err, result) => {
    if (err) {
      const message = err;
      res.render('error',{err:message});
      return;
    }

    const tableColumns = result.map((row) => row.COLUMN_NAME);
    res.render('addPaten', { tableColumns });
  });
});
 
app.get('/paten', (req, res) => {
  const sql = 'SELECT * from paten';
  const values = ['my_first_zoo', 'paten'];
  connection.query(sql, (err, result) => {
    if (err) {
      const message = err;
      res.render('error',{err:message});
      return;
    }
    res.render('paten', {  paten: result ,formatDate: formatDate});
  });
});

app.post('/paten/add', (req, res) => {
  const { paten_id, datum, betrag, benutzer_id } = req.body;

  // Perform validation or any additional processing
  const sql = 'INSERT INTO paten (paten_id, datum, betrag,  benutzer_id) VALUES (?, ?, ?, ?)';
const values = [paten_id, datum, betrag,  benutzer_id];

  connection.query(sql, values, (err, result) => {
    if (err) {
      const message = err;
      console.log(values);
      res.render('error',{err:message});
      return;
    }
    res.redirect('/gehege');
});
});


app.post('/paten/delet/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM paten WHERE paten_id = ?';

  connection.query(sql, id, (err) => {
    if (err) {
      const message = err;
      res.render('error',{err:message});
      return;
    }
    res.render('/paten');
  });
});
 

// Display all records from the "tiere" table
app.get('/tiere', (req, res) => {
  const sql = 'SELECT * FROM tiere';

  connection.query(sql, (err, result) => {
    if (err) {
      const message = err;
      res.render('error',{err:message});
      return;
    }
    res.render('tiere', { tiere: result ,formatDate: formatDate});
  });
});


app.get('/tiere/add', (req, res) => {
  const sql = 'SELECT COLUMN_NAME FROM information_schema.columns WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';
  const values = ['my_first_zoo', 'tiere'];

  connection.query(sql, values, (err, result) => {
    if (err) {
      const message = err;
      res.render('error',{err:message});
      return;
    }

    const tableColumns = result.map((row) => row.COLUMN_NAME);
    tableColumns.pop();
    console.log(tableColumns);
    res.render('addTier', { tableColumns });
  });
});



app.post('/tiere/add', (req, res) => {
  const { bezeichnung, geburtsdatum, geschlecht, größe, gewicht, kategorie_id, gehege_nr } = req.body;

  // Perform validation or any additional processing
  const sql = 'INSERT INTO tiere (bezeichnung, geburtsdatum, geschlecht, größe, gewicht, kategorie_id, gehege_nr) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [bezeichnung, geburtsdatum, geschlecht, größe, gewicht, kategorie_id, gehege_nr];

  connection.query(sql, values, (err, result) => {
    if (err) {
      const message = err;
      res.render('error',{err:message});
      
      return;
    }
    err = 'Tier successfully added';
    const message = err;
    res.redirect('/tiere'); // Redirect to the "tiere" table
  });
});

// Add a new record to the "tiere" table
 
 

 



 



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
