CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    author VARCHAR(100),
    description TEXT,
    rating INT,
    isbn VARCHAR(50),
    imagePath VARCHAR(100),
    date_when_read TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    note VARCHAR(255),
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES books(id)
);