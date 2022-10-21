var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const sequelize = require('./models').sequelize;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const authenticate = async () => {
  try {
    await sequelize.authenticate();
    console.log('A connection has been established!');
  } catch (error) {
    console.error('A connection has not been established...');
  }
}
authenticate();
sequelize.sync();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = 'Sorry page not found.';
  message = "could not find the page youre looking for."
  console.log(err.message);
  res.render('pag-not-found', {err, title: 'Page not found'});
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.status = 404) {
    console.log('Global error handler', err)
    message = "sorry we cant find the page youre looking for."
    res.render('page-not-found', {err, message, title: 'page not found'});
  } else {
    err.message = err.message || `something on the server-side has gone wrong.`;
    res.status(err.status || 500)
  } 
});


module.exports = app;
