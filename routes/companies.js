const express = require('express');
const slugify = require('slugify');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
  try {
    const results = await db.query(`SELECT * FROM companies`);
    return res.json({ companies: results.rows });
  } catch (e) {
    return next(e);
  }
});

router.get('/:code', async (req, res, next) => {
  try {
    const code = req.params.code;
    const results = await db.query(
      `SELECT * FROM companies 
    WHERE code=$1`,
      [code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(
        `Can't find a company with the code of ${code}`,
        404
      );
    }
    const ind = await db.query(
      `SELECT i.industry
    FROM industries as i
    LEFT JOIN industries_companies as ic on i.code = ic.ind_code 
    LEFT JOIN companies as c on ic.comp_code = c.code 
    WHERE c.code=$1`,
      [code]
    );
    const inv = await db.query(`SELECT * FROM invoices WHERE comp_code=$1`, [
      code,
    ]);
    newObj = results.rows[0];
    newObj['industries'] = ind.rows;
    newObj['invoice'] = inv.rows;
    return res.json({ company: newObj });
  } catch (e) {
    return next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const code = slugify(name, {
      lower: true,
    });
    const results = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1,$2, $3) RETURNING code, name, description`,
      [code, name, description]
    );
    return res.status(201).json({ company: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

router.put('/:code', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const { code } = req.params;
    const results = await db.query(
      `UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`,
      [name, description, code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(
        `Can't update a company with the code of ${code}`,
        404
      );
    }
    return res.json({ company: results.rows[0] });
  } catch (e) {
    return next(e);
  }
});

router.delete('/:code', async (req, res, next) => {
  try {
    const code = req.params.code;
    const company = await db.query(`SELECT code FROM companies WHERE code=$1`, [
      code,
    ]);
    if (company.rows.length === 0) {
      throw new ExpressError(
        `Can't delete a company with the code of ${code}`,
        404
      );
    }
    const results = await db.query(`DELETE FROM companies where code=$1`, [
      code,
    ]);
    return res.json({ status: 'Deleted' });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;

// `SELECT c.code, c.name, c.description, i.industry
// FROM companies as c
// LEFT JOIN industries_companies as ic on c.code = ic.comp_code
// LEFT JOIN industries as i on ic.ind_code = i.code
// WHERE c.code=$1`,
