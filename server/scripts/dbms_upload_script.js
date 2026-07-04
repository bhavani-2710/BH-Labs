require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { Types: { ObjectId } } = mongoose;
const Subject = require('../models/Subject');
const Experiment = require('../models/Experiment');

const subjects = [
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    name: "Database Management Systems",
    code: "CS201",
    semester: 3,
    description: "Understand database design, ER modeling, SQL DDL/DML, joins, complex queries, views, triggers, and transactions."
  }
];

const experiments = [
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b801"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 1,
    title: "Identify case study and design ER/EER Model",
    problemStatement: "Identify a suitable case study and analyze its requirements. Design an Entity-Relationship (ER) or Extended Entity-Relationship (EER) model by identifying entities, attributes, keys, and relationships for the specified system.",
    theory: "ER modeling is a conceptual database design tool. It represents data as entities, attributes, and relationships. EER adds subclass/superclass hierarchies and inheritance. ER/EER models are visualized as diagrams before mapping to relational tables.",
    algorithm: "1. Analyze requirements for a 'Company Management System'.\n2. Identify entities: Employee, Department, Project.\n3. Identify attributes and keys: Employee(ssn, name, salary), Department(dnumber, dname).\n4. Define relationships: Works_For (Employee and Department), Manages (Employee and Department).\n5. Document cardinality and participation constraints.",
    difficulty: "Easy",
    subExperiments: [
      {
        part: "a",
        title: "Identify case study and design ER/EER Model",
        problemStatement: "Identify a suitable case study and analyze its requirements. Design an Entity-Relationship (ER) or Extended Entity-Relationship (EER) model by identifying entities, attributes, keys, and relationships for the specified system.",
        theory: "ER modeling is a conceptual database design tool. It represents data as entities, attributes, and relationships. EER adds subclass/superclass hierarchies and inheritance. ER/EER models are visualized as diagrams before mapping to relational tables.",
        algorithm: "1. Analyze requirements for a 'Company Management System'.\n2. Identify entities: Employee, Department, Project.\n3. Identify attributes and keys: Employee(ssn, name, salary), Department(dnumber, dname).\n4. Define relationships: Works_For (Employee and Department), Manages (Employee and Department).\n5. Document cardinality and participation constraints.",
        difficulty: "Easy",
        hints: [
          "Identify all the nouns in the problem statement — these are usually your entities.",
          "Each entity should have a primary key that uniquely identifies a tuple.",
          "Relationships between entities should capture real-world associations (1:1, 1:N, M:N).",
          "Use EER when you need to model generalization/specialization (e.g., Employee is a Person).",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Read Case Study requirements" },
            { id: "3", type: "process", label: "Identify Entities & Attributes" },
            { id: "4", type: "process", label: "Establish Relationships between Entities" },
            { id: "5", type: "output", label: "Document ER Diagram mappings" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          sql: `-- Case Study: Company Database
-- Identify entities: Employee, Department, Project
-- Document keys and relationships in SQL comments:
-- Employee(ssn: PK, name, salary, dno: FK)
-- Department(dnumber: PK, dname, mgr_ssn: FK)

SELECT 'ER Model designed for Company Database' AS Result;`
        },
        samples: [
          {
            input: "",
            output: "ER Model designed for Company Database\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b802"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 2,
    title: "Mapping ER/EER to Relational schema model",
    problemStatement: "Convert the designed ER/EER model into a relational schema by mapping entities, relationships, attributes, and constraints into appropriate relational tables with suitable keys.",
    theory: "ER-to-Relational mapping rules: 1. Map strong entities to relation tables. 2. Map weak entities by including owner key. 3. Map 1:1, 1:N, M:N relationships using foreign keys or cross-reference tables. 4. Map multivalued attributes to separate tables.",
    algorithm: "1. Map entity Employee to table employee with primary key ssn.\n2. Map entity Department to table department with primary key dnumber.\n3. Create 1:N relationship Works_For by adding dno foreign key in employee referencing department(dnumber).\n4. Document integrity constraints (NOT NULL, UNIQUE, FOREIGN KEY).",
    difficulty: "Easy",
    subExperiments: [
      {
        part: "a",
        title: "Mapping ER/EER to Relational schema model",
        problemStatement: "Convert the designed ER/EER model into a relational schema by mapping entities, relationships, attributes, and constraints into appropriate relational tables with suitable keys.",
        theory: "ER-to-Relational mapping rules: 1. Map strong entities to relation tables. 2. Map weak entities by including owner key. 3. Map 1:1, 1:N, M:N relationships using foreign keys or cross-reference tables. 4. Map multivalued attributes to separate tables.",
        algorithm: "1. Map entity Employee to table employee with primary key ssn.\n2. Map entity Department to table department with primary key dnumber.\n3. Create 1:N relationship Works_For by adding dno foreign key in employee referencing department(dnumber).\n4. Document integrity constraints (NOT NULL, UNIQUE, FOREIGN KEY).",
        difficulty: "Easy",
        hints: [
          "Every strong entity in ER maps to exactly one relational table with its own primary key.",
          "A weak entity inherits the owner entity's primary key as part of its composite key.",
          "For M:N relationships, create a new cross-reference table with foreign keys from both entities.",
          "Multivalued attributes must be stored in separate tables to maintain 1NF.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Map Entities to Relational Tables" },
            { id: "3", type: "process", label: "Define PK and FK constraints" },
            { id: "4", type: "output", label: "Output schema constraints outline" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          sql: `-- Write SQL schema outline representing mapped tables
-- Define Primary Keys and Foreign Keys in comments or DDL

SELECT 'Relational Schema mapped successfully' AS Status;`
        },
        samples: [
          {
            input: "",
            output: "Relational Schema mapped successfully\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b803"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 3,
    title: "Create database using DDL and apply integrity constraints",
    problemStatement: "Create a database for the specified system using SQL Data Definition Language (DDL) commands and enforce integrity constraints such as domain, entity, referential, and key constraints.",
    theory: "DDL commands are CREATE, ALTER, and DROP. Integrity constraints ensure data correctness: PRIMARY KEY enforces entity integrity, FOREIGN KEY enforces referential integrity, NOT NULL and UNIQUE enforce domain/key constraints.",
    algorithm: "1. Create department table with columns dno (PRIMARY KEY) and dname (NOT NULL).\n2. Create employee table with columns ssn (PRIMARY KEY), name (NOT NULL), and dno referencing department(dno) (FOREIGN KEY).\n3. Enforce constraint checks where appropriate.",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "Create database using DDL and apply integrity constraints",
        problemStatement: "Create a database for the specified system using SQL Data Definition Language (DDL) commands and enforce integrity constraints such as domain, entity, referential, and key constraints.",
        theory: "DDL commands are CREATE, ALTER, and DROP. Integrity constraints ensure data correctness: PRIMARY KEY enforces entity integrity, FOREIGN KEY enforces referential integrity, NOT NULL and UNIQUE enforce domain/key constraints.",
        algorithm: "1. Create department table with columns dno (PRIMARY KEY) and dname (NOT NULL).\n2. Create employee table with columns ssn (PRIMARY KEY), name (NOT NULL), and dno referencing department(dno) (FOREIGN KEY).\n3. Enforce constraint checks where appropriate.",
        difficulty: "Medium",
        hints: [
          "Use CREATE TABLE to define a new table with column names and data types.",
          "Declare PRIMARY KEY on the column that uniquely identifies each row.",
          "Use FOREIGN KEY...REFERENCES to enforce referential integrity between tables.",
          "NOT NULL ensures a column must always have a value; UNIQUE ensures no two rows share the same value in that column.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Execute CREATE TABLE department" },
            { id: "3", type: "process", label: "Execute CREATE TABLE employee with FK dno" },
            { id: "4", type: "output", label: "Display confirmation message" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          sql: `-- Create tables and add integrity constraints
CREATE TABLE department (
    dno INTEGER PRIMARY KEY,
    dname TEXT NOT NULL
);

CREATE TABLE employee (
    ssn INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    dno INTEGER,
    FOREIGN KEY(dno) REFERENCES department(dno)
);

SELECT 'Tables created successfully' AS Message;`
        },
        samples: [
          {
            input: "",
            output: "Tables created successfully\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b804"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 4,
    title: "Apply DML Commands for the specified system",
    problemStatement: "Implement SQL Data Manipulation Language (DML) commands on the specified database system to insert, update, delete, and retrieve records from database tables.",
    theory: "DML commands include INSERT (add records), UPDATE (modify records), DELETE (remove records), and SELECT (retrieve records). These operations manipulate tuple states without altering table metadata definitions.",
    algorithm: "1. Insert data tuples into department and employee tables.\n2. Update employee salary or department assignment using UPDATE ... SET ... WHERE.\n3. Delete employee tuples using DELETE FROM ... WHERE.\n4. Query all tuples to verify mutations.",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "Apply DML Commands for the specified system",
        problemStatement: "Implement SQL Data Manipulation Language (DML) commands on the specified database system to insert, update, delete, and retrieve records from database tables.",
        theory: "DML commands include INSERT (add records), UPDATE (modify records), DELETE (remove records), and SELECT (retrieve records). These operations manipulate tuple states without altering table metadata definitions.",
        algorithm: "1. Insert data tuples into department and employee tables.\n2. Update employee salary or department assignment using UPDATE ... SET ... WHERE.\n3. Delete employee tuples using DELETE FROM ... WHERE.\n4. Query all tuples to verify mutations.",
        difficulty: "Medium",
        hints: [
          "Use INSERT INTO ... VALUES to add new rows to a table.",
          "Use UPDATE ... SET ... WHERE to modify specific rows — always include the WHERE clause to avoid updating all rows.",
          "Use DELETE FROM ... WHERE to remove specific rows — omitting WHERE will delete all rows.",
          "Use SELECT * FROM to view all current rows after each DML operation to verify your changes.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Execute INSERT INTO statements" },
            { id: "3", type: "process", label: "Execute UPDATE statement to change salary" },
            { id: "4", type: "process", label: "Execute DELETE statement" },
            { id: "5", type: "output", label: "SELECT * to display remaining tuples" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          sql: `-- Setup DDL first
CREATE TABLE employee (
    id INTEGER PRIMARY KEY,
    name TEXT,
    salary REAL
);

-- Write your DML statements here (INSERT, UPDATE, DELETE)
INSERT INTO employee VALUES (1, 'Alice', 60000);
INSERT INTO employee VALUES (2, 'Bob', 50000);

-- Write UPDATE to change Bob's salary to 55000
UPDATE employee SET salary = 55000 WHERE id = 2;

SELECT * FROM employee;`
        },
        samples: [
          {
            input: "",
            output: "1|Alice|60000.0\n2|Bob|55000.0\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b805"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 5,
    title: "Perform Simple queries, string manipulation operations and aggregate functions",
    problemStatement: "Write and execute SQL queries using selection and projection operations, perform string manipulation functions, and apply aggregate functions on the specified database system.",
    theory: "Selection filters rows (WHERE), Projection selects columns. String operations manipulate text (e.g. UPPER, LOWER, length). Aggregate functions compute values across rows: COUNT(), SUM(), AVG(), MIN(), MAX(), often paired with GROUP BY.",
    algorithm: "1. Retrieve specific columns from employee table.\n2. Convert names to uppercase.\n3. Calculate total employee salary count, sum, and average.\n4. Group results by department index.",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "Perform Simple queries, string manipulation and aggregate functions",
        problemStatement: "Write and execute SQL queries using selection and projection operations, perform string manipulation functions, and apply aggregate functions on the specified database system.",
        theory: "Selection filters rows (WHERE), Projection selects columns. String operations manipulate text (e.g. UPPER, LOWER, length). Aggregate functions compute values across rows: COUNT(), SUM(), AVG(), MIN(), MAX(), often paired with GROUP BY.",
        algorithm: "1. Retrieve specific columns from employee table.\n2. Convert names to uppercase.\n3. Calculate total employee salary count, sum, and average.\n4. Group results by department index.",
        difficulty: "Medium",
        hints: [
          "Use WHERE clause to filter rows based on conditions (selection), and list specific column names to restrict output columns (projection).",
          "UPPER(column) and LENGTH(column) are built-in string functions in SQLite to manipulate text values.",
          "Aggregate functions like AVG(), COUNT(), SUM() summarize all rows in a group.",
          "Combine GROUP BY with aggregate functions to compute summaries per category.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Insert sample employee tuples" },
            { id: "3", type: "process", label: "Apply Selection & Projection query" },
            { id: "4", type: "output", label: "Select dept, AVG(salary) grouped by dept" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          sql: `CREATE TABLE employee (
    id INTEGER PRIMARY KEY,
    name TEXT,
    salary REAL,
    dept TEXT
);
INSERT INTO employee VALUES (1, 'Alice', 60000, 'HR');
INSERT INTO employee VALUES (2, 'Bob', 80000, 'IT');
INSERT INTO employee VALUES (3, 'Charlie', 90000, 'IT');

-- Write query to select dept and AVG(salary) grouped by dept
SELECT dept, AVG(salary) FROM employee GROUP BY dept;`
        },
        samples: [
          {
            input: "",
            output: "HR|60000.0\nIT|85000.0\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b806"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 6,
    title: "Implement various Join operations",
    problemStatement: "Design and execute SQL queries to demonstrate various join operations including Inner Join, Left Outer Join, Right Outer Join, Full Outer Join, and Self Join on the specified database system.",
    theory: "Joins combine columns from multiple tables. INNER JOIN returns matching rows. LEFT JOIN returns all rows from left table. RIGHT JOIN and FULL JOIN include right/both outer records. SELF JOIN joins a table to itself (e.g. employee to manager).",
    algorithm: "1. Create tables employee and department.\n2. Populate tables (ensure some employees have no department, and some departments have no employees).\n3. Execute INNER JOIN on department keys.\n4. Execute LEFT OUTER JOIN to see unmatched employees.\n5. Execute Self Join using employee manager relation.",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "Implement various Join operations",
        problemStatement: "Design and execute SQL queries to demonstrate various join operations including Inner Join, Left Outer Join, Right Outer Join, Full Outer Join, and Self Join on the specified database system.",
        theory: "Joins combine columns from multiple tables. INNER JOIN returns matching rows. LEFT JOIN returns all rows from left table. RIGHT JOIN and FULL JOIN include right/both outer records. SELF JOIN joins a table to itself (e.g. employee to manager).",
        algorithm: "1. Create tables employee and department.\n2. Populate tables (ensure some employees have no department, and some departments have no employees).\n3. Execute INNER JOIN on department keys.\n4. Execute LEFT OUTER JOIN to see unmatched employees.\n5. Execute Self Join using employee manager relation.",
        difficulty: "Medium",
        hints: [
          "INNER JOIN returns only the rows where a matching value is found in both tables.",
          "LEFT JOIN returns all rows from the left table; rows with no match in the right table get NULL values.",
          "A SELF JOIN is done by aliasing the same table twice (e.g. FROM emp e1 JOIN emp e2 ON e1.mgr_id = e2.id).",
          "Ensure sample data includes some unmatched rows to see the difference between JOIN types.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Create and seed dept & emp tables" },
            { id: "3", type: "process", label: "Execute INNER JOIN query" },
            { id: "4", type: "output", label: "Display joined results" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          sql: `CREATE TABLE dept (dno INT, dname TEXT);
CREATE TABLE emp (id INT, name TEXT, dno INT);

INSERT INTO dept VALUES (10, 'IT'), (20, 'HR');
INSERT INTO emp VALUES (101, 'Alice', 10), (102, 'Bob', 30);

-- Inner Join query
SELECT emp.name, dept.dname FROM emp INNER JOIN dept ON emp.dno = dept.dno;`
        },
        samples: [
          {
            input: "",
            output: "Alice|IT\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b807"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 7,
    title: "Perform Nested and Complex queries",
    problemStatement: "Write and execute nested and complex SQL queries using subqueries, correlated subqueries, and set operations to retrieve meaningful information from the specified database.",
    theory: "A subquery is a query nested inside another SQL statement. Non-correlated subqueries execute independently once. Correlated subqueries refer to columns in parent scope and run per row. Set operations include UNION, INTERSECT, and EXCEPT.",
    algorithm: "1. Retrieve employees whose salary is greater than the average salary.\n2. Write a correlated query to find employees earning more than the average in their respective department.\n3. Perform set queries merging employee logs.",
    difficulty: "Hard",
    subExperiments: [
      {
        part: "a",
        title: "Perform Nested and Complex queries",
        problemStatement: "Write and execute nested and complex SQL queries using subqueries, correlated subqueries, and set operations to retrieve meaningful information from the specified database.",
        theory: "A subquery is a query nested inside another SQL statement. Non-correlated subqueries execute independently once. Correlated subqueries refer to columns in parent scope and run per row. Set operations include UNION, INTERSECT, and EXCEPT.",
        algorithm: "1. Retrieve employees whose salary is greater than the average salary.\n2. Write a correlated query to find employees earning more than the average in their respective department.\n3. Perform set queries merging employee logs.",
        difficulty: "Hard",
        hints: [
          "A subquery is a SELECT statement nested inside another SQL statement, enclosed in parentheses.",
          "Use WHERE salary > (SELECT AVG(salary) FROM emp) to compare each row against an aggregate result.",
          "Correlated subqueries reference a column from the outer query (e.g. WHERE salary > AVG(salary in same dept)) and are recalculated per row.",
          "UNION merges result sets from two queries (removing duplicates); UNION ALL keeps duplicates.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Create sample emp table with salaries" },
            { id: "3", type: "process", label: "Execute SELECT with nested subquery (AVG)" },
            { id: "4", type: "output", label: "Output list of qualifying names" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          sql: `CREATE TABLE emp (name TEXT, salary REAL, dept TEXT);
INSERT INTO emp VALUES ('Alice', 60000, 'HR'), ('Bob', 80000, 'IT'), ('Charlie', 90000, 'IT');

-- Select employees who earn more than average salary
SELECT name FROM emp WHERE salary > (SELECT AVG(salary) FROM emp);`
        },
        samples: [
          {
            input: "",
            output: "Charlie\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b808"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 8,
    title: "Perform DCL and TCL commands",
    problemStatement: "Implement Data Control Language (DCL) and Transaction Control Language (TCL) commands to manage database security, user privileges, and transaction processing in the specified database system.",
    theory: "DCL commands (GRANT, REVOKE) configure database access permissions. TCL commands (COMMIT, ROLLBACK, SAVEPOINT) control transaction integrity, ensuring that group operations execute atomically following ACID properties.",
    algorithm: "1. Begin a transaction block.\n2. Perform insert and update statements.\n3. Commit the transaction using COMMIT to persist writes.\n4. Create a savepoint, perform bad operations, and rollback using ROLLBACK.",
    difficulty: "Medium",
    subExperiments: [
      {
        part: "a",
        title: "Perform DCL and TCL commands",
        problemStatement: "Implement Data Control Language (DCL) and Transaction Control Language (TCL) commands to manage database security, user privileges, and transaction processing in the specified database system.",
        theory: "DCL commands (GRANT, REVOKE) configure database access permissions. TCL commands (COMMIT, ROLLBACK, SAVEPOINT) control transaction integrity, ensuring that group operations execute atomically following ACID properties.",
        algorithm: "1. Begin a transaction block.\n2. Perform insert and update statements.\n3. Commit the transaction using COMMIT to persist writes.\n4. Create a savepoint, perform bad operations, and rollback using ROLLBACK.",
        difficulty: "Medium",
        hints: [
          "Use BEGIN TRANSACTION to start an explicit transaction block in SQLite.",
          "COMMIT saves all changes made since BEGIN to the database permanently.",
          "ROLLBACK undoes all changes made since the last BEGIN or SAVEPOINT.",
          "SAVEPOINT name creates a named checkpoint within a transaction so you can rollback to just that point.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Execute BEGIN TRANSACTION" },
            { id: "3", type: "process", label: "Execute account balance updates" },
            { id: "4", type: "process", label: "Execute COMMIT" },
            { id: "5", type: "output", label: "Verify account values are correctly updated" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          sql: `CREATE TABLE accounts (acc_no INT, balance REAL);
INSERT INTO accounts VALUES (1, 1000.0), (2, 500.0);

-- Simulate Transaction
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE acc_no = 1;
UPDATE accounts SET balance = balance + 100 WHERE acc_no = 2;
COMMIT;

SELECT * FROM accounts;`
        },
        samples: [
          {
            input: "",
            output: "1|900.0\n2|600.0\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b809"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 9,
    title: "Implement procedure and functions",
    problemStatement: "Design and implement stored procedures and user-defined functions to perform specific database operations and automate repetitive tasks in the specified database system.",
    theory: "Stored Procedures are compiled, reusable code blocks stored inside the database engine. Functions return a single scalar value. They encapsulate business rules, minimize network overhead, and secure write access.",
    algorithm: "1. Write an SQL trigger or simulated function that increments employee salary.\n2. Run the procedural block.\n3. Verify database updates.",
    difficulty: "Hard",
    subExperiments: [
      {
        part: "a",
        title: "Implement procedure and functions",
        problemStatement: "Design and implement stored procedures and user-defined functions to perform specific database operations and automate repetitive tasks in the specified database system.",
        theory: "Stored Procedures are compiled, reusable code blocks stored inside the database engine. Functions return a single scalar value. They encapsulate business rules, minimize network overhead, and secure write access.",
        algorithm: "1. Write an SQL trigger or simulated function that increments employee salary.\n2. Run the procedural block.\n3. Verify database updates.",
        difficulty: "Hard",
        hints: [
          "SQLite does not support CREATE PROCEDURE natively — simulate procedures using a sequence of SQL statements.",
          "Use UPDATE ... SET ... WHERE to replicate what a stored procedure would typically do (e.g., increment salary).",
          "In full SQL databases (MySQL, PostgreSQL), use DELIMITER $$ and CREATE PROCEDURE name() BEGIN ... END$$ syntax.",
          "Always verify changes after running your procedure simulation using a SELECT query.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Insert initial Employee record" },
            { id: "3", type: "process", label: "Execute simulated procedural UPDATE script" },
            { id: "4", type: "output", label: "Verify product values are updated" },
            { id: "5", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" }
          ]
        },
        referenceSolution: {
          sql: `-- Note: SQLite does not support standard PL/SQL CREATE PROCEDURE syntax.
-- Instead, we demonstrate procedure automation using SQL mutations.

CREATE TABLE emp (name TEXT, salary REAL);
INSERT INTO emp VALUES ('Alice', 50000);

-- Write simulated procedure using standard SQL mutations
UPDATE emp SET salary = salary * 1.10 WHERE name = 'Alice';

SELECT * FROM emp;`
        },
        samples: [
          {
            input: "",
            output: "Alice|55000.0\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b80a"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 10,
    title: "Implementation of Views and Triggers",
    problemStatement: "Create and implement SQL views and database triggers to simplify data access, enforce business rules, and automatically perform actions in response to database events.",
    theory: "A view is a virtual table representing the output of an SQL statement. A trigger is a stored database routine that executes automatically when a specified modification (INSERT, UPDATE, DELETE) occurs on a target table.",
    algorithm: "1. Create a View high_salary_view filtering employees with salary > 70000.\n2. Create a log table salary_log.\n3. Define a trigger log_salary inserting details to salary_log when emp.salary changes.\n4. Update salary and verify trigger insertion.",
    difficulty: "Hard",
    subExperiments: [
      {
        part: "a",
        title: "Implementation of Views and Triggers",
        problemStatement: "Create and implement SQL views and database triggers to simplify data access, enforce business rules, and automatically perform actions in response to database events.",
        theory: "A view is a virtual table representing the output of an SQL statement. A trigger is a stored database routine that executes automatically when a specified modification (INSERT, UPDATE, DELETE) occurs on a target table.",
        algorithm: "1. Create a View high_salary_view filtering employees with salary > 70000.\n2. Create a log table salary_log.\n3. Define a trigger log_salary inserting details to salary_log when emp.salary changes.\n4. Update salary and verify trigger insertion.",
        difficulty: "Hard",
        hints: [
          "A VIEW is created with CREATE VIEW view_name AS SELECT ... and can be queried like a regular table.",
          "AFTER UPDATE triggers fire after a row has been modified — use NEW.column and OLD.column to access before/after values.",
          "A trigger is bound to a specific table and event (INSERT, UPDATE, DELETE).",
          "Always check the trigger log table with SELECT * after modifying data to confirm the trigger fired.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Execute CREATE VIEW high_salary" },
            { id: "3", type: "process", label: "Execute CREATE TRIGGER log_salary" },
            { id: "4", type: "process", label: "Mutate salary value on Employee" },
            { id: "5", type: "output", label: "SELECT * FROM salary_log to show log output" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          sql: `CREATE TABLE emp (id INT, name TEXT, salary REAL);
CREATE TABLE salary_log (emp_id INT, old_sal REAL, new_sal REAL);

-- Create View
CREATE VIEW high_salary AS SELECT * FROM emp WHERE salary > 70000;

-- Create Trigger
CREATE TRIGGER log_salary AFTER UPDATE OF salary ON emp
BEGIN
    INSERT INTO salary_log VALUES (new.id, old.salary, new.salary);
END;

INSERT INTO emp VALUES (1, 'Alice', 60000);
UPDATE emp SET salary = 75000 WHERE id = 1;

SELECT * FROM salary_log;`
        },
        samples: [
          {
            input: "",
            output: "1|60000.0|75000.0\n"
          }
        ]
      }
    ]
  },
  {
    _id: new ObjectId("685b2a1f3c4e8d0012a7b811"),
    subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005"),
    experimentNumber: 11,
    title: "Transaction and Concurrency control techniques using locks",
    problemStatement: "Implement and demonstrate transaction management and concurrency control techniques using locking mechanisms to ensure database consistency and maintain ACID properties in a multi-user environment.",
    theory: "Locks prevent concurrent transactions from creating data inconsistencies. Shared (S) locks allow concurrent reads. Exclusive (X) locks secure write access. Two-Phase Locking (2PL) preserves serializability.",
    algorithm: "1. Initiate transaction 1.\n2. Acquire exclusive lock on inventory table using BEGIN EXCLUSIVE.\n3. Decrement inventory stock value.\n4. Commit transaction 1 to release locks.",
    difficulty: "Hard",
    subExperiments: [
      {
        part: "a",
        title: "Transaction and Concurrency control techniques using locks",
        problemStatement: "Implement and demonstrate transaction management and concurrency control techniques using locking mechanisms to ensure database consistency and maintain ACID properties in a multi-user environment.",
        theory: "Locks prevent concurrent transactions from creating data inconsistencies. Shared (S) locks allow concurrent reads. Exclusive (X) locks secure write access. Two-Phase Locking (2PL) preserves serializability.",
        algorithm: "1. Initiate transaction 1.\n2. Acquire exclusive lock on inventory table using BEGIN EXCLUSIVE.\n3. Decrement inventory stock value.\n4. Commit transaction 1 to release locks.",
        difficulty: "Hard",
        hints: [
          "SQLite supports BEGIN EXCLUSIVE TRANSACTION to simulate exclusive locking on a database.",
          "An exclusive lock prevents any other transaction from reading or writing until the lock is released via COMMIT or ROLLBACK.",
          "Use SAVEPOINT inside a transaction to create checkpoints and demonstrate partial rollback.",
          "ACID properties stand for Atomicity, Consistency, Isolation, Durability — locks help maintain Isolation.",
        ],
        flowchart: {
          nodes: [
            { id: "1", type: "start", label: "Start" },
            { id: "2", type: "process", label: "Execute BEGIN EXCLUSIVE TRANSACTION" },
            { id: "3", type: "process", label: "Update stock values" },
            { id: "4", type: "process", label: "Execute COMMIT" },
            { id: "5", type: "output", label: "Output current stock value" },
            { id: "6", type: "end", label: "Stop" }
          ],
          edges: [
            { source: "1", target: "2" },
            { source: "2", target: "3" },
            { source: "3", target: "4" },
            { source: "4", target: "5" },
            { source: "5", target: "6" }
          ]
        },
        referenceSolution: {
          sql: `CREATE TABLE inventory (item TEXT, stock INT);
INSERT INTO inventory VALUES ('Item_A', 10);

-- Transaction 1 starts with lock simulation
BEGIN EXCLUSIVE TRANSACTION;
UPDATE inventory SET stock = stock - 1 WHERE item = 'Item_A';
COMMIT;

SELECT * FROM inventory;`
        },
        samples: [
          {
            input: "",
            output: "Item_A|9\n"
          }
        ]
      }
    ]
  }
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/bh_labs";
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB for DBMS seeding...");

    // Remove existing DBMS subject and experiments
    await Subject.deleteMany({ name: "Database Management Systems" });
    await Experiment.deleteMany({ subjectId: new ObjectId("685b2a1f3c4e8d0012a7b005") });
    console.log("Cleared existing DBMS data.");

    await Subject.insertMany(subjects);
    console.log(`Seeded ${subjects.length} subject(s).`);

    await Experiment.insertMany(experiments);
    console.log(`Seeded ${experiments.length} DBMS experiment(s).`);

    console.log("DBMS seed completed successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
};

seedDB();
