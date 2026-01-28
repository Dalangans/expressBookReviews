const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Tambahkan ini

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    // Mensimulasikan pengambilan data secara asinkronus
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    const allBooks = await getBooks;
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).send("Error retrieving books");
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBook
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});
  
// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const getFilteredBooks = new Promise((resolve) => {
      const filtered = Object.values(books).filter(book => book.author === author);
      resolve(filtered);
    });
    const result = await getFilteredBooks;
    res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).send("Error retrieving books by author");
  }
});

// Task 13: Get all books based on title using Async/Await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const getFilteredBooks = new Promise((resolve) => {
      const filtered = Object.values(books).filter(book => book.title === title);
      resolve(filtered);
    });
    const result = await getFilteredBooks;
    res.status(200).send(JSON.stringify(result, null, 4));
  } catch (error) {
    res.status(500).send("Error retrieving books by title");
  }
});

// Get book review (Tetap sama karena tidak diminta asinkronus khusus)
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;