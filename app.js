const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { init } = require('./models/blog');
const aws = require('aws-sdk');
let s3 = new aws.S3({
  dbURI: process.env.dbURI
});
require("dotenv").config();
// express app
const app = express();

// connect to mongodb & listen for requests
dbURI = process.env.dbURI;
console.log(dbURI);
mongoose.connect(dbURI,
  { useNewUrlParser: true, useUnifiedTopology: true })
   .then((result) => app.listen(process.env.PORT || 3000)).catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
//API
var axios = require("axios").default;

var options = {
  method: 'GET',
  url: 'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/total',
  params: {country: 'Canada'},
  headers: {
    'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
    'x-rapidapi-key': '76cecf7d17msha3c3dc7ff3f8df6p115d0cjsn5de958d6c2e1'
  }
};
let CT;
axios.request(options).then(function (response) {
	CT = response.data;
}).catch(function (error) {
	console.error(error);
});
// mongoose & mongo tests
app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'new blog',
    snippet: 'about my new blog',
    body: 'more about my new blog'
  })

  blog.save()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/single-blog', (req, res) => {
  Blog.findById('5ea99b49b8531f40c0fde689')
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.get('/APi', (req, res) => {
  res.render('APi', { title: 'APi' , CT : CT });
});

app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});