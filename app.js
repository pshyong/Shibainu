const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
const favicon = require('serve-favicon');
const flash = require('connect-flash');

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const db = require('./config');
require('dotenv').config();

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/API/api');
const userRouter = require('./routes/users');
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

// Connect Flash
app.use(flash());

// Express Session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true
  })
);

// Passport
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
      // Find user first
      try {
        const user = await db.one(
          'SELECT * FROM User_account WHERE username=$1;',
          username
        );

        if (user) {
          const match = await bcrypt.compare(password, user.hashed_password);
          if (match)
            return done(null, {
              id: user.user_account_id,
              username: user.username
            });
          else return done(null, false);
        }
        return done(null, false, {
          message: 'Wrong username or password'
        });
      } catch (err) {
        console.error('/login: ' + err);
        return done(null, false, { message: 'Wrong username or password' });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Find user first
  db.one('SELECT * FROM User_account WHERE user_account_id = $1;', id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(new Error(`User with the id ${id} does not exist`));
    });
});

app.use(passport.initialize());
app.use(passport.session());

// Global var for current user session id
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.sessionId = req.session.id;
  res.locals.success_messages = req.flash('success');
  res.locals.warning_messages = req.flash('warn');
  res.locals.error_messages = req.flash('error');
  return next();
});

// Main paths
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/', userRouter);

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
  res.render('pages/error');
});

module.exports = app;
