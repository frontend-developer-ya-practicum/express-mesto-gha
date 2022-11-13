const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/not-found');
const { errorHandler } = require('./middlewares/error-handling');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

const { PORT = 3000 } = process.env;

const app = express();

const { register, login } = require('./controllers/auth');
const auth = require('./middlewares/auth');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/signup', register);
app.post('/signin', login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// handle unmatched routes
app.use(() => {
  throw new NotFoundError('Page not found');
});

app.use(errorHandler);

app.listen(PORT);
