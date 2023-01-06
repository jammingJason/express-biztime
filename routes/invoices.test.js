process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');
db.query('DELETE FROM companies');
let testInvoice = [];
beforeEach(async () => {
  await db.query(
    `INSERT INTO companies (code, name, description) 
        VALUES ('sam', 'Samsung', 'Big Red') RETURNING code, name, description`
  );
  const result = await db.query(
    `INSERT INTO invoices (comp_Code, amt, paid, paid_date)
    VALUES ('sam', 1234.56, false, null) RETURNING id, comp_code, amt`
  );

  testInvoice.push(result.rows[0]);

  // console.log(testInvoice);
});

afterEach(async () => {
  await db.query('DELETE FROM invoices');
  await db.query('DELETE FROM companies');

  testInvoice.length = 0;
});

afterAll(() => {
  db.end();
  // console.log('This is working');
});

describe('GET /invoices', () => {
  test('Get a list with one invoice.', async () => {
    const res = await request(app).get('/invoices');
    expect(res.statusCode).toBe(200);
    // expect(res.body).toEqual({ invoice: [testinvoice] });
  });
});

describe('GET /invoices/:id', () => {
  test('Get a single invoice.', async () => {
    const res = await request(app).get(`/invoices/${testInvoice.id}`);
    expect(res.statusCode).toBe(200);
    // expect(res.body).toEqual({ user: testUser });
  });
  test('Responds with a 404 for invalid ID.', async () => {
    const res = await request(app).get('/invoices/0');
    expect(res.statusCode).toBe(404);
    // expect(res.body).toEqual({ user: testUser });
  });
});

describe('POST /invoices', () => {
  test('Creates a single invoice', async () => {
    const res = await request(app)
      .post('/invoices')
      .send({ comp_code: 'sam', amt: 1200.99, paid: false, paid_date: null });
    expect(res.statusCode).toBe(201);
    // expect(res.body).toEqual({
    //   invoice: { comp_code: 'sam', amt: 1200.99, description: 'Runs the world.' },
    // });
  });
});

describe('PATCH /invoices/:id', () => {
  test('Updates a single invoice', async () => {
    const res = await request(app)
      .patch(`/invoices/${testInvoice.id}`)
      .send({ amt: 1 });
    expect(res.statusCode).toBe(200);
    // expect(res.body).toEqual({
    //   user: { id: testUser.id, name: 'Twitter', description: 'Takeover!' },
    // });
  });
  test('Responds with a 404 for invalid ID.', async () => {
    const res = await request(app).get('/invoices/0');
    expect(res.statusCode).toBe(404);
    // expect(res.body).toEqual({ user: testUser });
  });
});

describe('DELETE /invoices/:id', () => {
  test('Deletes a single invoice', async () => {
    const res = await request(app).delete(`/invoices/${testInvoice.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'Deleted' });
  });
  test('Responds with a 404 for invalid ID.', async () => {
    const res = await request(app).get('/users/0');
    expect(res.statusCode).toBe(404);
  });
});
