const express = require('express');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM invoices`);
    return res.json({ invoices: results.rows });
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const results = await db.query(`SELECT * FROM invoices WHERE id=$1`, [id]);
    if (results.rows.length === 0) {
      throw new ExpressError(`Can't find an invoice with the id of ${id}`, 404);
    }
    return res.json({ invoice: results.rows });
  } catch (e) {
    return next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { comp_code, amt, paid, add_date, paid_date } = req.body;
    const results = await db.query(
      'INSERT INTO invoices (comp_code, amt, paid_date) VALUES ($1,$2, $3) RETURNING id, comp_code, amt',
      [comp_code, amt, null]
    );
    return res.status(201).json({ invoice: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { amt, paid } = req.body;
    const { id } = req.params;
    time = new Date(Date.now())
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '');

    const results = await db.query(
      `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=${id} RETURNING *`,
      [amt, paid, time]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(
        `Can't update a company with the code of ${code}`,
        404
      );
    }
    return res.json({ invoice: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const invoice = await db.query(`SELECT amt FROM invoices WHERE id=$1`, [
      id,
    ]);
    if (invoice.rows.length === 0) {
      throw new ExpressError(
        `Can't delete a company with the ID of ${id}`,
        404
      );
    }
    const results = await db.query(`DELETE FROM invoices where id=$1`, [id]);
    return res.json({ status: 'Deleted' });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
