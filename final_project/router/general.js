const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); 

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

// Task 10: Get the book list using Async/Await
public_users.get('/', async function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    resolve(books);
  });
  
  try {
    const bookList = await getBooks;
    res.status(200).json(bookList);
  } catch (err) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // Menggunakan Promise manual yang membungkus logika atau Axios
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject("Book not found");
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({message: err}));
});
  
// Task 12: Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(b => b.author === author);
    resolve(filteredBooks);
  });

  try {
    const result = await getBooksByAuthor;
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({message: "Error"});
  }
});

// Task 13: Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  const getBooksByTitle = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(b => b.title === title);
    resolve(filteredBooks);
  });

  try {
    const result = await getBooksByTitle;
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({message: "Error"});
  }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;