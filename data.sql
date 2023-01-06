\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);
CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL 
);

CREATE TABLE industries_companies (
  comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
  ind_code text NOT NULL REFERENCES industries ON DELETE CASCADE
);


CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO industries
  VALUES ('acct', 'Accounting'),
         ('it', 'Information Technology');

INSERT INTO industries_companies
  VALUES ('apple', 'it'),
          ('apple', 'acct'),
          ('ibm', 'acct')

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

-- SELECT i.code, i.industry, c.name FROM industries as i 
-- LEFT JOIN industries_companies as ic on i.code = ic.ind_code 
-- LEFT JOIN companies as c on ic.comp_code = c.code
-- GROUP BY c.name,i.code

-- SELECT c.name
-- FROM companies as c
-- LEFT JOIN industries_companies as ic on c.code = ic.comp_code 
-- LEFT JOIN industries as i on ic.ind_code = i.code 
-- WHERE i.code = 'acct'