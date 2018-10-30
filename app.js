var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const exphbs  = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('passport');
var app = express()


const ideas = require('./routes/ideas')
const users = require('./routes/users')

require('./config/passport')(passport)

// connect to mongoose
mongoose.connect('mongodb://localhost/sampel1')
        .then(() => {
          console.log('mongoDB connected')
        })
        .catch(err => {
          console.log(err)
        })

// 引入模型
require('./models/Idea')
const Idea = mongoose.model('ideas')

// view engine setup
app.engine('handlebars', exphbs({
  defaultLayout: 'layout'
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

// body-parser middleware
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

// session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

// 配置全局变量
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', ideas)
app.use('/users', users)
app.get('/', function (req, res) {
  const title = "Joker"
  res.render('index', {
    title: title
  })
})

app.get('/about', function (req, res) {
  res.render('about')
})





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
