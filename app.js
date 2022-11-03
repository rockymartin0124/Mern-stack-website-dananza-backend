var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// blog api
app.use('/api/blog', require('./routes/api_blog'));

// account api
app.use('/api/user', require('./routes/api_user'));

// buyer api
app.use('/api/buyer', require('./routes/api_buyer'));

// Campaign api
app.use('/api/campaign', require('./routes/api_campaign'));

// Adza api
app.use('/api/adza', require('./routes/api_adza'));

// channel api
app.use('/api/channel', require('./routes/api_channel'));

// listing api
app.use('/api/listing', require('./routes/api_listing'));

// review api
app.use('/api/review', require('./routes/api_review'));

// message api
app.use('/api/message', require('./routes/api_message'));

// cart api
app.use('/api/cart', require('./routes/api_cart'));

// order api
app.use('/api/order', require('./routes/api_order'));

// search api
app.use('/api/search', require('./routes/api_search'));

// stats api
app.use('/api/stats', require('./routes/api_stats'));

// notification api
app.use('/api/notification', require('./routes/api_notification'));

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
