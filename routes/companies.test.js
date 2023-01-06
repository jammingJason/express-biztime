process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany = [];
beforeEach(async () => {
  await db.query('DELETE FROM companies');
  const result = await db.query(
    `INSERT INTO companies (code, name, description) 
    VALUES ('sam', 'Samsung', 'Big Red') RETURNING (code, name, description)`
  );
  testCompany.push(result.rows[0]);
});

afterEach(async () => {
  await db.query('DELETE FROM companies');
});

afterAll(async () => {
  await db.query('DELETE FROM companies');
  db.end();
  console.log('This is working');
});

describe('GET /companies', () => {
  test('Get a list with one company.', async () => {
    const res = await request(app).get('/companies');
    expect(res.statusCode).toBe(200);
    // expect(res.body).toEqual({ company: [testCompany] });
  });
});

describe('GET /companies/:code', () => {
  test('Get a single company.', async () => {
    const res = await request(app).get(`/companies/sam`);
    expect(res.statusCode).toBe(200);
    // expect(res.body).toEqual({ user: testUser });
  });
  test('Responds with a 404 for invalid Code.', async () => {
    const res = await request(app).get('/companies/0');
    expect(res.statusCode).toBe(404);
    // expect(res.body).toEqual({ user: testUser });
  });
});

describe('POST /companies', () => {
  test('Creates a single company', async () => {
    const res = await request(app)
      .post('/companies')
      .send({ code: 'fb', name: 'Facebook', description: 'Runs the world.' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      company: { code: 'fb', name: 'Facebook', description: 'Runs the world.' },
    });
  });
});

describe('PATCH /companies/:code', () => {
  test('Updates a single company', async () => {
    const res = await request(app)
      .patch(`/companies/sam`)
      .send({ name: 'Twitter' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      company: { name: 'Twitter' },
    });
  });
  test('Responds with a 404 for invalid Code.', async () => {
    const res = await request(app).get('/companies/0');
    expect(res.statusCode).toBe(404);
    // expect(res.body).toEqual({ user: testUser });
  });
});

describe('DELETE /companies/:code', () => {
  test('Deletes a single company', async () => {
    const res = await request(app).delete(`/companies/sam`);
    //   .send({ name: 'BillyBob', type: 'admin' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'Deleted' });
  });
  test('Responds with a 404 for invalid Code.', async () => {
    const res = await request(app).get('/users/0');
    expect(res.statusCode).toBe(404);
    // expect(res.body).toEqual({ user: testUser });
  });
});
