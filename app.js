/** BizTime express application. */
const express = require('express');
const app = express();
const db = require('./db');

const ExpressError = require('./expressError');

// Parse request bodies for JSON
app.use(express.json());

const cRoutes = require('./routes/companies');
app.use('/companies', cRoutes);
const iRoutes = require('./routes/invoices');
app.use('/invoices', iRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError(
    'That bunny must haved hopped away!  Sorry....try another page!',
    404
  );
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message,
  });
});

module.exports = app;
