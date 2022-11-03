const express = require('express');
const path = require('path');
const cors = require('cors');
const logger = require('morgan');
const dotenv = require('dotenv');
const { default: mongoose } = require('mongoose');

dotenv.config();

const { 
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  NODE_DOCKER_PORT
} = process.env;

const MONGO_URL = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
console.log(MONGO_URL)
mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log('DB Connected');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', require('./v1/routes/index'));

app.listen(NODE_DOCKER_PORT, () => {
    console.log(`Server is running on ${NODE_DOCKER_PORT || 5000}!`);
});

module.exports = app;
