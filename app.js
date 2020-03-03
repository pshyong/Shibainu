const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const favicon = require('serve-favicon');
require('dotenv').config();

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/API/api');
const app = express();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
var options = {
  swaggerDefinition: {
    host: 'localhost:3000',
    basePath: '/api/v1',
    info: {
      title: 'shibainu API',
      version: '0.0.1',
      description: 'API for all api calls to shibainu server'
    }
  },
  apis: ['./routes/API/*']
};
const swaggerSpec = swaggerJSDoc(options);

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// Custom sources
app.use(
  '/assets/css/tailwindcss/',
  express.static(__dirname + '/node_modules/tailwindcss/dist')
);
app.use('/assets/js/', express.static(__dirname + '/node_modules/jquery/dist'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, '/public'),
    dest: path.join(__dirname, '/public'),
    debug: true,
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
  })
);

// API-docs
app.use('/api/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
  })
);

// Main paths
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('pages/404');
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
