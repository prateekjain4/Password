const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {isLoggedIn} = require('./middleware.js');
const flash = require('flash')

mongoose.connect('mongodb://localhost:27017/authoDemo')
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const userRoutes = require('./routes/users');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'notagoodsecret' }))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.send('THIS IS THE HOME PAGE')
})

app.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret')
})

app.listen(3000, () => {
    console.log("SERVING YOUR APP!")
})
