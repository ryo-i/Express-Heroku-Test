const express = require('express');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const app = express();

// CORS設定
const corsOptions = {
  origin: 'https://ryo-i.github.io'
}

// Fetch API設定
const jsonParser = bodyParser.json();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: true,
  ssl: { 
    sslmode: 'require',
    rejectUnauthorized: false
  }
});

app.use(express.static(path.join(__dirname, 'public')),cors(corsOptions))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM member');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/dbTest', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM member');
      const name = result.rows[0].name;
      console.log('name->' + name);
      res.send(name);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .get('/times', (req, res) => res.send(countHitsuji()))
  // .get('/env', (req, res) => res.send(process.env.TIMES))
  .get('/env', (req, res) => res.send(process.env.NAME));

  const countHitsuji = () => {
    let result = ''
    const times = process.env.TIMES || 5
    for (i = 0; i < times; i++) {
      // result += i + ' '
      result += '羊が' + i + '匹 '
    }
    return result;
  };


// Create
app.post('/fetch', jsonParser, (req, res) => {
  const ikku = req.body.ikku;

  const insertSql = "INSERT INTO ikkulist(ikku) VALUES ($1)"
  const selectSql = 'SELECT * FROM ikkulist WHERE ikku = $1';

  pool.query(insertSql, [ikku], (err, result) => {
      if (err) throw err;
      pool.query(selectSql, [ikku], (err, result) => {
          if (err) throw err;
          console.log(result.rows[0]);
          res.send(result.rows[0]);
      });
  });
});


// Read
app.get('/fetch', jsonParser, (req, res) => {
  const deleteSql = "DELETE FROM ikkulist WHERE createday < now() - interval '1 day'";
  const selectSql = "SELECT * FROM ikkulist";
  
  pool.query(deleteSql, (err, result) => {
    if (err) throw err;
    console.log(result);
    pool.query(selectSql, (err, result) => {  
      if (err) throw err;
  
      console.log(result.rows);
      res.send(result.rows);
    });
  });
});


// Update
app.put('/fetch', jsonParser, (req, res) => {
  const id = req.body.id;
  const ikku = req.body.ikku;

  const updateSql = 'UPDATE ikkulist SET ikku = $1 WHERE id = $2';
  const selectSql = 'SELECT * FROM ikkulist WHERE id = $1';

  pool.query(updateSql, [ikku, id], (err, result) => {
      if (err) throw err;
      console.log(result.row);
      pool.query(selectSql, [id], (err, result) => {
          if (err) throw err;
          console.log(result.rows[0]);
          res.send(result.rows[0]);
      });
  });
});


// delete
app.delete('/fetch', jsonParser, (req, res) => {
  const id = req.body.id;

  const deleteSql = 'DELETE FROM ikkulist WHERE id = $1';

  pool.query(deleteSql, [id], (err, result) => {
      if (err) throw err;
      res.json({
          "id": Number(id),
          "ikku": "deleted"
      });
  });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
