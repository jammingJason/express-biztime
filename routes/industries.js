const express = require('express');
const slugify = require('slugify');
const ExpressError = require('../expressError');
const router = express.Router();
const db = require('../db');
let industryArray = [];
router.get('/', async (req, res, next) => {
  try {
    const results =
      await db.query(`SELECT i.code, i.industry, c.code as company FROM industries as i 
    LEFT JOIN industries_companies as ic on i.code = ic.ind_code 
    LEFT JOIN companies as c on ic.comp_code = c.code
    GROUP BY i.code 
    ORDER BY i.code`);

    return res.json(results.rows);
  } catch (e) {
    return next(e);
  }
});

async function arrayBuilder(industry) {
  const results = await db.query(
    `SELECT c.name
  FROM companies as c
  LEFT JOIN industries_companies as ic on c.code = ic.comp_code
  LEFT JOIN industries as i on ic.ind_code = i.code
  WHERE i.code=$1`,
    [industry.code]
  );
  industry['companies'] = results.rows;
  industryArray.push({ industry });
  return industryArray;
}

router.post('/', async (req, res, next) => {
  try {
    const { code, industry } = req.body;
    const results = await db.query(
      `INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry`,
      [code, industry]
    );

    return res.status(201).json(results.rows[0]);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
