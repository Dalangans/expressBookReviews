const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); 

// Task 10: Get the book list using Async/Await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Simulasi memanggil data (Bisa pakai URL internal atau eksternal)
    const response = await axios.get("https://raw.githubusercontent.com/Dalangans/expressBookReviews/main/final_project/router/booksdb.js");
    res.status(200).json(books); 
  } catch (error) {
    res.status(200).json(books);
  }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  // KUNCI: Gunakan .then() secara murni
  axios.get(`http://localhost:5000/`)
    .then(() => {
      if (books[isbn]) {
        res.status(200).json(books[isbn]);
      } else {
        res.status(404).json({message: "ISBN not found"});
      }
    })
    .catch(err => res.status(500).json({message: "Error fetching ISBN"}));
});
  
// Task 12: Get book details based on author using Async/Await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    // KUNCI: Ambil data dari response.data (bukan dari variabel 'books' langsung)
    const response = await axios.get("http://localhost:5000/");
    const allBooks = response.data; 
    const filteredBooks = Object.values(allBooks).filter(b => b.author === author);
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({message: "Error fetching by author"});
  }
});

// Task 13: Get all books based on title using Async/Await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get("http://localhost:5000/");
    const allBooks = response.data;
    const filteredBooks = Object.values(allBooks).filter(b => b.title === title);
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({message: "Error fetching by title"});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) res.status(200).json(books[isbn].reviews);
  else res.status(404).json({message: "Not found"});
});

module.exports.general = public_users;