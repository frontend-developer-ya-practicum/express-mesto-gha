const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/not-found');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('', require('./routes/auth'));

app.use(require('./middlewares/auth'));

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// handle unmatched routes
app.use(() => {
  throw new NotFoundError('Page not found');
});

app.use(errors());
app.use(require('./middlewares/error-handling'));

app.listen(PORT);
