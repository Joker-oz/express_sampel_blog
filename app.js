var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// connect to mongoose



// view engine setup
app.engine('handlebars', exphbs({
  defaultLayout: 'layout'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// body-parser middleware
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.get('/', function (req, res) {
  const title = "Joker"
  res.render('index', {
    title: title
  });
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('/ideas/add', function (req, res) {
  res.render('ideas/add');
});

app.post('/ideas', urlencodedParser, function (req, res) {
  let errors = [];
  if (!req.body.title) {
    errors.push({text: "请输入标题"})
  }
  if (!req.body.details) {
    errors.push({text: "请输入详情"})
  }
  if(errors.length > 0) {
    res.render("ideas/add", {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    res.send('ok');
  }
  // res.render('ideas/add');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
