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

async function checkUsers() {
  const valuesFromDb = await db.query(
    'SELECT id, email, password FROM users ORDER BY id ASC;'
  );

  let users = valuesFromDb.rows;
  // console.log(users);
  return users;
}

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  if (email.length < 1 && password.length < 1) {
    error = 'Try to type something into the inputs.';
    console.log(error);
    res.redirect('/');
  } else {
    if (checkUsers().length > 0) {
      res.send('Email alredy exist. Try again.');
    } else {
      try {
        const valuesFromDb = await db.query(
          'INSERT INTO users (email, password) VALUES ($1, $2)',
          [email, password]
        );
        console.log(valuesFromDb);
        res.render('secrets.ejs');
      } catch (err) {
        console.log(err);
        res.send('Email alredy exist. Try again.');
      }
    }
  }
});

app.post('/login', async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  if (email < 1 && password < 1) {
    res.send('Try to type something into the inputs.');
  } else {
    try {
      const login = await db.query(
        'SELECT email, password FROM users WHERE email = $1',
        [email]
      );

      if (login.rows.length > 0) {
        const user = login.rows[0];
        const storedPassword = user.password;

        if (password === storedPassword) {
          res.render('secrets.ejs');
        } else {
          res.send('Incorrect Password');
        }
      } else {
        res.send('User not found');
      }
    } catch (err) {
      console.log(err);
      res.send('Something went wrong. Tyr again.');
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
