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
// Renders the list of books from the current database
router.get('/books', asyncHandler (async (req, res) => {
  const books = await Book.findAll();
  res.render('index', { books, title: 'Books' })
}));
// Renders a page to create and add a new book to the list
router.get('/books/new', asyncHandler(async(req, res) => {
  res.render('new-book', { title: 'New Book' })
}));
// Posts the new book onto the page
router.post('/books/new', asyncHandler(async(req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books');
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render('new-book', {book, errors: error.errors, title: "New Book"})
    } else {
      throw error;
    }
  }
}));
// Renders a detail of a book to either update or delete it from the database  (NOT WORKING YET)
router.get('/books/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", {book, title: "Update Book"});
  } else {
    throw error;
  }
}));
// Posts the updated book back onto the current list of books
router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/books'); 
    } else {
      throw error;
    } // make sure correct book gets updated
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, title: book.title })
    } else {
      throw error;
    }
  }
}));
// Destroys a book from the list permanently
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
