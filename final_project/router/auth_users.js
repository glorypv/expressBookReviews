const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({
      message: "Error logging in"
    });
  }
  // Register a new user
  if (!isValid(username)) {
    users.push({
      "username": username,
      "password": password
    });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', {
      expiresIn: 60 * 60
    });

    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).send("User successfully logged in" + req.session.authorization.username);
  } else {
    return res.status(208).json({
      message: "Invalid Login. Check username and password"
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const {
    review
  } = req.body;
  const username = req.session.authorization.username;
  const book = books[isbn];

  book.reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: book.reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const book = books[isbn];
  if (isbn) {
    delete book.reviews[username];
  }
  return res.status(200).json({
    message: "Review delete successfully",
    reviews: book.reviews
  });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;