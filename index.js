const fs = require('fs');
const mysql = require('mysql');

const json = fs.readFileSync('credentials.json', 'utf8');
const credentials = JSON.parse(json);

const connection = mysql.createConnection(credentials);
connection.connect(error => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
});

const insertQuery = 'INSERT INTO memory(year, month, day, entry) VALUES (?, ?, ?, ?)';
const parameters = [2019, 3, 19, 'I was born.'];
connection.query(insertQuery, parameters, (error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
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

const selectQuery = 'SELECT * FROM memory';
connection.query(selectQuery, (error, rows) => {
  if (error) {
    console.error(error);
  } else {
    const memories = rows.map(rowToMemory);
    console.log(rows);
  }
});


connection.end();