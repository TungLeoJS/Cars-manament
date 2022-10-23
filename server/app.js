const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('DB Connected');
  })
  .catch((err) => {
    console.log(err);
  })

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', require('./v1/routes/index'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.PORT || 5000}!`);
});

module.exports = app;