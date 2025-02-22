// Add packages  and dependecies to the program
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const logger = require('morgan');
const connectDB = require('./config/database');
const mainRoutes = require('./routes/main');
const recipesRoutes = require('./routes/recipes');

// set app use the env file
require('dotenv').config({ path: './config/.env' });

// Passport config
require('./config/passport')(passport);

connectDB();

// setting the view to ejs
app.set('view engine', 'ejs');
// acess static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger('dev'));

// keep you logged in until you click logout
// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// display flash messages
app.use(flash());

// redirect routes to defined routes
app.use('/', mainRoutes);
app.use('/recipes', recipesRoutes);

// set up app to listen for request on given port
app.listen(process.env.PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}, you better catch it!`);
});
