const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 80;

mongoose.connect('mongodb+srv://vova:1q2w3e@cluster0-pkydx.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
try
{
  db.once('open', () => {
    console.log('connected to Mongodb');
  });
}
catch
{
  db.on('error', (err) => {
    console.log(err);
  });
}

const ap = express();

const Art = require('./models/art');

ap.set('views', path.join(__dirname, 'public'));
ap.set('view engine', 'pug');

// parse application/x-www-form-urlencoded
ap.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
ap.use(bodyParser.json());

ap.use(express.static(path.join(__dirname, 'pub')));


ap.get('/', (request, response) => {

  Art.find({}, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      response.render('index', {
        title: 'Articles',
        articles: res,
      });
    }
  });
});

const articles = require('./routes/articles');

ap.use('/articles', articles);


ap.listen(PORT);
