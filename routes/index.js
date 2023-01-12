var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

/* GET home page. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect('books');
}));

router.get('/books', asyncHandler (async (req, res) => {
  res.render('index', {title: 'Books'})
}));

router.get('/books/new', asyncHandler(async(req, res) => {
  res.render('new-book', {title: 'New Book'})
}));

router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('new-book', {book, errors: error.errors, title: "New Book"})
    } else {
      throw error;
    }
  }
}));

router.get('/books/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", {book, title: book.title});
  } else {
    throw error;
  }
}));

router.post('/books/:id/update', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/"); 
    } else {
      throw error;
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("update-book", { book, title: book.title })
    } else {
      throw error;
    }
  }
}));

router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    throw error
  }
}));

module.exports = router;
