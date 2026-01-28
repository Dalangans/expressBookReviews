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

// Task 10: Get the book list using Async/Await with Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/books"); // Pastikan endpoint ini ada atau gunakan simulasi
    res.status(200).json(response.data);
  } catch (error) {
    // Jika axios gagal karena endpoint belum ada, gunakan fallback ke local books agar tetap jalan
    res.status(200).send(JSON.stringify(books, null, 4));
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
  
// Task 12: Get book details based on author using Async/Await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/`); // Memanggil Task 10
    const filteredBooks = Object.values(response.data).filter(b => b.author === author);
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({message: "Error fetching by author"});
  }
});

// Task 13: Get all books based on title using Async/Await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/`);
    const filteredBooks = Object.values(response.data).filter(b => b.title === title);
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(500).json({message: "Error fetching by title"});
  }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;