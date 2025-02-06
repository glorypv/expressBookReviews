const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({
        "username": username,
        "password": password
      });
      return res.status(200).json({
        message: "User successfully registered. Now you can login"
      });
    } else {
      return res.status(404).json({
        message: "User already exists!"
      });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({
    message: "Unable to register user."
  });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  // return res.send(JSON.stringify(books, null, 3));
  let bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books); // Resuelve la promesa con la lista de libros
    }, 3000); // Simula un retraso de 3 segundos
  });

  bookPromise
    .then((bookList) => {
      res.status(200).json(bookList); // Envía la lista de libros en formato JSON
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error fetching books",
        error: error.message
      });
    });

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  // res.send(books[isbn]);
  let bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let book = books[isbn]; // Buscar el libro por ISBN

      if (book) {
        resolve(book); // Resuelve la promesa con el libro encontrado
      } else {
        reject(new Error("Book not found")); // Rechaza la promesa si el libro no existe
      }
    }, 3000); // Simula un retraso de 3 segundos
  });

  bookPromise
    .then((book) => {
      res.status(200).json(book); // Devuelve el libro encontrado en formato JSON
    })
    .catch((error) => {
      res.status(404).json({
        message: error.message
      }); // Maneja el error si el libro no existe
    });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);

      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor); // Resuelve la promesa con el libro encontrado
      } else {
        reject(new Error("Book not found")); // Rechaza la promesa si el libro no existe
      }
    }, 3000); // Simula un retraso de 3 segundos
  });

  bookPromise
    .then((book) => {
      res.status(200).json(book); // Devuelve el libro encontrado en formato JSON
    })
    .catch((error) => {
      res.status(404).json({
        message: error.message
      }); // Maneja el error si el libro no existe
    });


});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;


  let bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByTitle = Object.values(books).filter(book => book.title === title);

      if (booksByTitle.length > 0) {
        resolve(booksByTitle); // Resuelve la promesa con el libro encontrado
      } else {
        reject(new Error("Book not found")); // Rechaza la promesa si el libro no existe
      }
    }, 3000); // Simula un retraso de 3 segundos
  });

  bookPromise
    .then((book) => {
      res.status(200).json(book); // Devuelve el libro encontrado en formato JSON
    })
    .catch((error) => {
      res.status(404).json({
        message: error.message
      }); // Maneja el error si el libro no existe
    });

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  //res.send(books[isbn].reviews);
  let bookPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let book = books[isbn].reviews; // Buscar el libro por ISBN

      if (book) {
        resolve(book); // Resuelve la promesa con el libro encontrado
      } else {
        reject(new Error("Book not found")); // Rechaza la promesa si el libro no existe
      }
    }, 3000); // Simula un retraso de 3 segundos
  });

  bookPromise
    .then((book) => {
      res.status(200).json(book); // Devuelve el libro encontrado en formato JSON
    })
    .catch((error) => {
      res.status(404).json({
        message: error.message
      }); // Maneja el error si el libro no existe
    });

});



module.exports.general = public_users;