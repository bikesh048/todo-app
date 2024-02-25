require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes/TodoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Specify the extended option
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB.'))
  .catch((err) => console.log(`Error connecting to MongoDB: ${err}`));

app.use(routes);

// Error handling middleware should be placed after routes
app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  // Render a custom error page using EJS
  res.status(500).render('error', { error: err.message });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
