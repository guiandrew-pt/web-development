import express from 'express';
import env from 'dotenv';
import pg from 'pg';

// Inititalize express:
const app = express();
const port = 3000;
env.config();

// Will create a new PostgreSQL client(initialize PostgreSQL), using the info details from .env:
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Connect to the database:
db.connect();

// Middleware setup
app.use(express.static('./public'));
app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Funtions
 */

// Will mount the url to the cover image in the API(Open Library Covers API):
function fetchCover(isbn) {
  // This will be the URL for the book cover with the specific isbn and with the size (M) as parameter:
  return `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`;
}

// Will fetch the book for the related id:
async function fecthABook(bookId) {
  try {
    return await db.query(
      'SELECT id, title, author, description, rating, isbn, imagepath, date_when_read FROM books WHERE id = $1',
      [bookId]
    );
  } catch (error) {
    console.log(`Error fetching the specific book: ${error}`);
  }
}

// Will fetch all books:
async function fecthAllBooks(sortOption) {
  let result;

  try {
    // for sort 'title' or undefined:
    result = await db.query(
      'SELECT id, title, author, description, rating, isbn, imagepath, date_when_read FROM books ORDER BY title ASC'
    );

    // It the choice of the user, we
    switch (sortOption) {
      case 'date':
        result = await db.query(
          'SELECT id, title, author, description, rating, isbn, imagepath, date_when_read FROM books ORDER BY date_when_read DESC'
        );
        break;

      case 'rating':
        result = await db.query(
          'SELECT id, title, author, description, rating, isbn, imagepath, date_when_read FROM books ORDER BY rating DESC'
        );
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(`Error fetching the books: ${error}`);
  }

  return result;
}

// Will save the book in the DB:
async function addBook(newBookData) {
  // Create timestamp for the date_when_read:
  const timestampDateRead = new Date();

  try {
    const imageCoverPath = fetchCover(newBookData.isbn);

    // Will save the the data in the database:
    await db.query(
      'INSERT INTO books (title, author, description, rating, isbn, imagepath, date_when_read) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [
        newBookData.title,
        newBookData.author,
        newBookData.description,
        newBookData.rating,
        newBookData.isbn,
        imageCoverPath,
        timestampDateRead,
      ]
    );
  } catch (error) {
    console.log(`Error adding the book: ${error}`);
  }
}

// Will save the note in the DB:
async function addNote(note, bookId) {
  try {
    // Will save the data into the DB:
    await db.query('INSERT INTO notes (note, book_id) VALUES ($1, $2)', [
      note,
      bookId,
    ]);
  } catch (error) {
    console.log(`Error adding the note: ${error}`);
  }
}

// Will save the update note data into the DB:
async function updateNote(updateThisNote, updateThisNoteId) {
  try {
    // Will save the data into the DB:
    await db.query('UPDATE notes SET note = ($1) WHERE id = $2', [
      updateThisNote,
      updateThisNoteId,
    ]);
  } catch (error) {
    console.log(`Error update the note: ${error}`);
  }
}

// Will save the update book data into the DB:
async function updateBook(newBookData, bookId, reqBody) {
  try {
    const imageCoverPath = fetchCover(newBookData.isbn || reqBody.isbn);

    // Will save the data into the DB:
    await db.query(
      'UPDATE books SET title = ($1), author = ($2), description = ($3), rating = ($4), isbn = ($5), imagepath = ($6) WHERE id = $7',
      [
        newBookData.title || reqBody.title,
        newBookData.author || reqBody.author,
        newBookData.description || reqBody.description,
        newBookData.rating || reqBody.rating,
        newBookData.isbn || reqBody.isbn,
        imageCoverPath,
        bookId,
      ]
    );
  } catch (error) {
    console.log(`Error update the book: ${error}`);
  }
}

// Will fetch the notes and the books with the related id:
async function fecthTheNotes(bookId) {
  try {
    const result = await db.query(
      'SELECT notes.id, notes.book_id, title, author, imagepath, date_when_read, notes.note FROM books LEFT JOIN notes ON books.id = notes.book_id WHERE books.id = $1 ORDER BY id DESC',
      [bookId]
    );

    return result.rows;
  } catch (error) {
    console.log(`Error fetching notes from the database: ${error}`);
  }
}

// Will delete the note for the corresponding id from DB:
async function deleteNote(deleteNoteId) {
  try {
    await db.query('DELETE FROM notes WHERE id = $1', [deleteNoteId]);
  } catch (error) {
    console.log(`Error delete the note: ${error}`);
  }
}

// Will delete the book for the corresponding id from DB:
async function deleteBook(deleteBookId) {
  try {
    await db.query('DELETE FROM notes WHERE book_id = $1', [deleteBookId]);
    await db.query('DELETE FROM books WHERE id = $1', [deleteBookId]);
  } catch (error) {
    console.log(`Error delete the book: ${error}`);
  }
}

/**
 * API
 */

// This is the route to render the home page(will show all books that has been read):
app.get('/', async (req, res) => {
  // Will store the sort that was chosen by the user:
  const sortOption = req.query.sort;

  try {
    let result = await fecthAllBooks(sortOption);

    // Will render the index.ejs page, and send the data:
    res.render('index.ejs', { data: result.rows, sortOption: sortOption });
  } catch (error) {
    console.log(error);
  }
});

// Will make the GET request, to show the notes for the book for the corresponding id:
app.get('/notes/:bookId', async (req, res) => {
  // Will assign the book id from URL parameters into the variable:
  const bookId = req.params.bookId;

  try {
    // Will fetch the notes for the book for the corresponding id:
    const notes = await fecthTheNotes(bookId);

    // Will render the notes.ejs page, and show the data:
    res.render('notes.ejs', { data: notes, bookId: bookId });
  } catch (error) {
    console.log(error);
  }
});

// Will render the about page:
app.get('/about', (req, res) => {
  res.render('./about.ejs');
});

// Will request the page new-book.ejs. GET:
app.get('/new-book', (req, res) => {
  res.render('new-book.ejs', { bookToEdit: {} });
});

// Will save the data in the database. POST request(books):
app.post('/new-book/add', async (req, res) => {
  // Will assign the new data sent in the post request:
  const newBookData = req.body;

  try {
    // Will save the the data in the database:
    await addBook(newBookData);

    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

// Will save the data in the database. POST request(notes):
app.post('/notes/:bookId/add', async (req, res) => {
  // Will assign the book id from URL parameters into the variable:
  const bookId = req.params.bookId;
  // Will assign the note from the form into the variable:
  const note = req.body.newNoteData;

  if (note.length > 0) {
    try {
      // Will save the note in the DB:
      await addNote(note, bookId);

      // Will redirect the page. Reload and do the GET request:
      res.redirect(`/notes/${bookId}`);
    } catch (error) {
      console.log(error);
    }
  }
});

// Will fetch the edit page
app.get('/book/:bookId/edit', async (req, res) => {
  try {
    // Check if the book is undefined or a id word:
    if (req.params.bookId === undefined || req.params.bookId === 'id') {
      new Error('Something went wrong, fetching the book with that id!');
      return;
    }

    // Will assign the book id from the URL params into the variable:
    const bookId = parseInt(
      req.params.bookId.substring(1, req.params.bookId.length)
    );

    const result = await fecthABook(bookId);
    const bookToEdit = result.rows[0];

    res.render('edit-book.ejs', { bookToEdit });
  } catch (error) {
    console.log(error);
  }
});

// Will save the update data into the database. POST request(books):
app.post('/book/:bookId/update', async (req, res) => {
  try {
    // Will assign the book id from the URL params into the variable:
    if (req.params.bookId === undefined || req.params.bookId === 'id') {
      new Error('Something went wrong, fetching the book with that id!');
      return;
    }

    // Will assign the book id from the URL params into the variable:
    const bookId = parseInt(
      req.params.bookId.substring(1, req.params.bookId.length)
    );

    // Will assign the values from the DB with book id:
    const newBookData = await fecthABook(bookId);

    await updateBook(newBookData, bookId, req.body);

    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

// Will save the update data into the database. POST request(notes):
app.post('/notes/:noteId/update', async (req, res) => {
  // Will assign the note from the form into the variable:
  const updateThisNote = req.body.noteToUpdate;
  // Will assign the note id from the URL params into the variable:
  const updateThisNoteId = req.params.noteId;
  // Will assign the book id from the form into the variable:
  const bookId = req.body.bookId;

  try {
    // Will save the update note data into the DB:
    await updateNote(updateThisNote, updateThisNoteId);

    // Will redirect the page. Reload and do the GET request:
    res.redirect(`/notes/${bookId}`);
  } catch (error) {
    console.log(error);
  }
});

// Will delete the book for the corresponding id(delete book):
app.post('/book/:bookId/delete', async (req, res) => {
  // Will assign the book id from the URL params into the variable:
  const deleteBookId = req.params.bookId;

  try {
    // Will delete the book and the note associated with the that book for the corresponding id from DB:
    await deleteBook(deleteBookId);

    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

// Will delete the note for the corresponding id(delete note):
app.post('/notes/:noteId/delete', async (req, res) => {
  // Will assign the note id from the URL params into the variable:
  const deleteNoteId = req.params.noteId;
  // Will assign the book id from the form into the variable:
  const bookId = req.body.bookId;

  try {
    // Will delete the note for the corresponding id from DB:
    await deleteNote(deleteNoteId);

    // Will redirect the page. Reload and do the GET request:
    res.redirect(`/notes/${bookId}`);
  } catch (error) {
    console.log(error);
  }
});

// Will start the server and will listen on port 3000:
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
