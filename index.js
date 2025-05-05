
const express=require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('dotenv').config();
const ejs=require('ejs');

const app = express();

//connecting to db
const dbCon=require('./app/config/db')
dbCon()

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use('/',express.static('./public/'))
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.set('view engine', 'ejs');
//app.set('views','views')
app.set('views', path.join(__dirname, 'views'));

// Flash messages
app.use(session({ secret: 'aman', resave: false, saveUninitialized: false }));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
  next();
});

const routes=require('./app/routes/router')
app.use(routes)

const adminRoute=require('./app/routes/adminRoute')
app.use(adminRoute)

const customerRoute=require('./app/routes/customerRoute')
app.use(customerRoute)





const PORT = process.env.PORT || 4007;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});

