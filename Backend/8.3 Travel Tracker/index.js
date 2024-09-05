import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import env from 'dotenv';

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

async function checkVisisted() {
  const result = await db.query('SELECT country_code FROM visited_countries');

  let countries = [];

  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });

  return countries;
}

// Home page
app.get('/', async (req, res) => {
  //Write your code here.
  const valuesFromDb = await checkVisisted();

  // console.log(valuesFromDb.rows);

  res.render('index.ejs', {
    countries: valuesFromDb,
    total: valuesFromDb.length,
  });

  // db.end();
});

// Insert Data:
app.post('/add', async (req, res) => {
  //Write your code here.
  const countryFromInput = req.body['country'];

  try {
    const country_codeDB = await db.query(
      // "SELECT country_code FROM countries WHERE country_name = $1", [countryFromInput]
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [countryFromInput.toLowerCase()]
    );

    const data = country_codeDB.rows[0];
    const country_code = data.country_code;

    try {
      await db.query(
        'INSERT INTO visited_countries (country_code) VALUES ($1)',
        [country_code]
      );

      res.redirect('/');
    } catch (err) {
      const countries = await checkVisisted();

      res.render('index.ejs', {
        countries: countries,
        total: countries.length,
        error: 'Country has already been added, try again.',
      });
    }
  } catch (err) {
    const countries = await checkVisisted();

    res.render('index.ejs', {
      countries: countries,
      total: countries.length,
      error: 'Country name does not exist, try again.',
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
