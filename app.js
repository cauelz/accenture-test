const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./api/routes/user');

mongoose.connect(
    'mongodb+srv://caue:calaza120045021511@cluster0.9xgbd.mongodb.net/Cluster0?retryWrites=true&w=majority'
  );
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use('/user', userRoutes);

app.use((req, resp, next) => {
    const error = new Error("mensagem de erro");
    error.status = 404;
    next(error);
})

app.use((error, req, resp, next) => {
    resp.status(error.status || 500);
    resp.json({
        error: {
            message: error.message,
        }
    });
});

module.exports = app;