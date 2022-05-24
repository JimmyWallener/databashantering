const express = require('express');
const mysql = require('mysql');
require('dotenv').config();
const app = express();
const port = 3000;

const database = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
});

database.connect();

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// READ FROM PROCEDURE

app.get('/getAll', (req, res) => {
  database.query('CALL get_all_data()', (err, rows, fields) => {
    if (err) throw err;

    res.send(rows);
  });
});

// READ FROM VIEW

app.get('/getSongs&Albums', (req, res) => {
  const query = 'SELECT * FROM get_songs_from_albums';
  database.query(query, (err, rows, fields) => {
    if (err) throw err;

    res.send(rows);
  });
});

// READ - Query based on keyword, fetches if query starts with it

app.get('/searchSongs/:query', (req, res) => {
  const query = `SELECT * FROM Song WHERE Song.name LIKE '${req.params.query}%'`;
  database.query(query, (err, rows, fields) => {
    if (err) throw err;
    console.log(`${req.params.query}`);
    res.send(rows);
  });
});

// FUNCTION - Get artist name by ID

app.get('/artist/:id', (req, res) => {
  const query = `SELECT getArtistById(${req.params.id}) AS Artist`;

  database.query(query, (err, rows, fields) => {
    if (err) throw err;

    res.send(rows);
  });
});

// CREATE - Insert data to artist table

app.get('/addArtist/:name', (req, res) => {
  if (req.params.name != null && typeof req.params.name === 'string') {
    const query = `INSERT INTO Artist VALUES (DEFAULT, "${req.params.name}")`;
    database.query(query, (err, rows, fields) => {
      if (err) throw err;

      res.send('Artist added');
    });
  }
});

// Update table

app.get('/updateArtist/:name/:id', (req, res) => {
  const query = `UPDATE Artist SET name = "${req.params.name}" WHERE artist_id = ${req.params.id}`;
  database.query(query, (err, rows, fields) => {
    if (err) throw err;
    res.send(`Artist updated with new data: ${req.params.name}`);
  });
});

// Remove data from table

app.get('/deleteSong/:id', (req, res) => {
  const query = `DELETE FROM Song WHERE song_id = ${req.params.id}`;
  database.query(query, (err, rows, fields) => {
    if (err) throw err;
    res.send(`Song at id: ${req.params.id} has been deleted`);
  });
});
