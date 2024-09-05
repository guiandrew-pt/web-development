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

let items = [
  { id: 1, title: 'Buy milk' },
  { id: 2, title: 'Finish homework' },
];
let error = '';

async function checkList() {
  const valuesFromDb = await db.query(
    'SELECT id, title FROM items ORDER BY id ASC;'
  );

  items = valuesFromDb.rows;
  // console.log(items);
  return items;
}

app.get('/', async (req, res) => {
  try {
    const listOfItemsFromDb = await checkList();

    res.render('index.ejs', {
      listTitle: 'Today',
      listItems: listOfItemsFromDb,
    });
  } catch (err) {
    console.log(err);
    error = 'Something went wrong, please try again.';
    res.redirect('/');
  }
});

app.post('/add', async (req, res) => {
  const item = req.body.newItem;

  if (item.length === 0) {
    error = 'You have to type a item to put in the To Do List.';
    res.redirect('/');
  } else {
    try {
      await db.query('INSERT INTO items (title) VALUES ($1)', [item]);

      error = 'New Item';
      // items.push({ title: item });

      res.redirect('/');
    } catch (err) {
      console.log(err);
      error = 'Something went wrong, please try again.';
      res.redirect('/');
    }
  }
});

app.post('/edit', async (req, res) => {
  const id = parseInt(req.body.updatedItemId);
  const titleFormUser = req.body.updatedItemTitle;

  if (id < 1) {
    error = 'Something went wrong, please try again.';
    res.redirect('/');
  } else {
    try {
      await db.query('UPDATE items SET title = $1 WHERE id = $2', [
        titleFormUser,
        id,
      ]);

      error = 'New Item';

      /* const correctItem = {
        id: id,
        title: titleFormUser
      };

      const itemToReplaceid = items.findIndex((item) => item.id === id);
      items[itemToReplaceid] = correctItem; */

      res.redirect('/');
    } catch (err) {
      console.log(err);
      error = 'Something went wrong, please try again.';
      res.redirect('/');
    }
  }
});

app.post('/delete', async (req, res) => {
  const id = parseInt(req.body.deleteItemId);

  if (id < 1) {
    error = 'Something went wrong, please try again.';
    res.redirect('/');
  } else {
    try {
      await db.query('DELETE FROM items WHERE id = $1', [id]);

      error = 'New Item';

      /* const itemToDeleteId = items.findIndex((item) => item.id === id);
      items.splice(itemToDeleteId, 1); */

      res.redirect('/');
    } catch (err) {
      console.log(err);
      error = 'Something went wrong, please try again.';
      res.redirect('/');
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
