import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(express.static('./public'));
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.blockchain.com/v3/exchange/tickers'
    );
    // console.log(response.data);
    const result = response.data;
    res.render('index.ejs', { data: result });
  } catch (error) {
    console.log('Failed to make request:', error.message);
    res.render('index.ejs', {
      error: error.message,
    });
  }
});

app.get('/about', (req, res) => {
  res.render('./about.ejs');
});

app.get('/contact', (req, res) => {
  res.render('./contact.ejs');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
