const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require("./routes/authRoutes")
const app = express();
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddlevare');

// Middleware
app.use(express.static('public'));
app.use(express.json())
// View engine
app.set('view engine', 'ejs');
// Cookie Parser
app.use(cookieParser())

// database connection
const dbURI = 'mongodb://localhost:27017/user';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get("*",checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
//app.get('*', (req, res) => res.render('404'));
app.use(authRoutes)
app.get('/set-cookies',(req,res) => {

//res.setHeader('set-Cookie', 'newUser=true');


res.cookie('New User',false)
//max age 1 day 
//? secure:true HTTPS ALLOWS otherwise will not shown
//? httpOnly:true HTTP ALLOWS 
res.cookie('isEmployee',true ,{maxAge: 1000*60*60*24, httpOnly:true /*secure: true*/})
res.send('you got the cookies')
})

app.get('/get-cookies',(req,res) => {
  const cookies = req.cookies;
  console.log(cookies);

  res.json(cookies)
})