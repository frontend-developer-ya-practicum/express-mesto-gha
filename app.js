const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/not-found');
const { errorHandler } = require('./middlewares/error-handling');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '6354b9d2171eeaa9b2157287',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// handle unmatched routes
app.use(() => {
  throw new NotFoundError('Page not found');
});

app.use(errorHandler);

app.listen(PORT);
