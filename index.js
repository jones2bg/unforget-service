const express = require ('express');
const fs = require('fs');
const mysql = require('mysql');

const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));
const connection = mysql.createConnection(credentials);

const service = express();
service.use(express.json());

connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

function rowToMemory(row) {
  return {
    id: row.id,
    year: row.year,
    month: row.month,
    day: row.day,
    entry: row.entry,
  };
}

service.get('/memories/:month/:day', (request, response) => {
  const parameters = [
    parseInt(request.params.month),
    parseInt(request.params.day),
  ];

  const query = 'SELECT * FROM memory WHERE month = ? AND day = ? AND is_deleted = 0 ORDER BY year DESC';
  connection.query(query, parameters, (error, rows) => {
    if (error) {
      response.status(500);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      const memories = rows.map(rowToMemory);
      response.json({
        ok: true,
        results: memories,
      });
    }
  });
});

service.post('/memories', (request, response) => {
  if (request.body.hasOwnProperty('year') &&
      request.body.hasOwnProperty('month') &&
      request.body.hasOwnProperty('day') &&
      request.body.hasOwnProperty('year')) {

    const parameters = [
      request.body.year,
      request.body.month,
      request.body.day,
      request.body.entry,
    ];

    const query = 'INSERT INTO memory(year, month, day, entry) VALUES (?, ?, ?, ?)';
    connection.query(query, parameters, (error, result) => {
      if (error) {
        response.status(500);
        response.json({
          ok: false,
          results: error.message,
        });
      } else {
        response.json({
          ok: true,
          results: result.insertId,
        });
      }
    });

  } else {
    response.status(400);
    response.json({
      ok: false,
      results: 'Incomplete memory.',
    });
  }
});

service.patch('/memories/:id', (request, response) => {
  const parameters = [
    request.body.year,
    request.body.month,
    request.body.day,
    request.body.entry,
    parseInt(request.params.id),
  ];

  const query = 'UPDATE memory SET year = ?, month = ?, day = ?, entry = ? WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

service.delete('/memories/:id', (request, response) => {
  const parameters = [parseInt(request.params.id)];

  const query = 'UPDATE memory SET is_deleted = 1 WHERE id = ?';
  connection.query(query, parameters, (error, result) => {
    if (error) {
      response.status(404);
      response.json({
        ok: false,
        results: error.message,
      });
    } else {
      response.json({
        ok: true,
      });
    }
  });
});

const port = 5001;
service.listen(port, () => {
  console.log(`We're live in port ${port}!`);
});