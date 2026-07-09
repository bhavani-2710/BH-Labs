const mongoose = require('mongoose');
const Experiment = require('./models/Experiment');

// ==================== YOUR DATA ====================
const rawData = [
 [
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 2,
    "problemStatement": "Demonstrate use of GRANT and REVOKE access control statements.",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "Create a PostgreSQL role, grant it SELECT and INSERT privileges on a sample table, verify the granted access, then revoke those privileges and verify that access is denied.",
        "type": "sql",
        "isExecutable": false,
        "title": "Grant and Revoke Privileges on a Sample Table",
        "theory": "In PostgreSQL, privileges on database objects are controlled through the GRANT and REVOKE commands. A role can be granted specific rights such as SELECT, INSERT, UPDATE, or DELETE on tables. The GRANT command assigns privileges, while REVOKE removes them. Privileges are checked at execution time, so a role without the required permission will receive an error. Using SET ROLE allows a session to assume another role to test its permissions.",
        "algorithm": "1. Connect to the PostgreSQL server as a superuser.\n2. Create a new role with LOGIN capability.\n3. Create a sample table with a SERIAL primary key and some data column.\n4. Insert initial rows into the table.\n5. Grant SELECT and INSERT privileges on the table to the new role.\n6. Switch to the new role (SET ROLE) and perform a SELECT and an INSERT to confirm access.\n7. Revoke the previously granted SELECT and INSERT privileges from the role.\n8. Switch to the role again and attempt SELECT/INSERT to confirm that access is denied.\n9. Clean up: drop the role and the table (optional).",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Create role"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Create table & seed data"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Grant SELECT, INSERT"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Test access (SET ROLE)"
            },
            {
              "id": "6",
              "type": "process",
              "label": "Revoke privileges"
            },
            {
              "id": "7",
              "type": "process",
              "label": "Test denied access"
            },
            {
              "id": "8",
              "type": "end",
              "label": "End"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "setup": {
          "type": "sql",
          "commands": "-- 1. Connect as superuser (already assumed)\n-- 2. Create a role for the experiment\nCREATE ROLE lab_user WITH LOGIN PASSWORD 'lab_pass';\n\n-- 3. Create a sample table with a SERIAL primary key\nCREATE TABLE sample_data (\n    id SERIAL PRIMARY KEY,\n    info TEXT NOT NULL\n);\n-- Grant usage on the underlying sequence to the owner (superuser already has it)\nGRANT USAGE, SELECT ON SEQUENCE sample_data_id_seq TO PUBLIC;\n\n-- 4. Insert seed rows\nINSERT INTO sample_data (info) VALUES ('Row 1'), ('Row 2');\n\n-- 5. Grant SELECT and INSERT privileges to the new role\nGRANT SELECT, INSERT ON TABLE sample_data TO lab_user;\n\n-- 6. Verify granted access (run as lab_user)\nSET ROLE lab_user;\n-- Should succeed\nSELECT * FROM sample_data LIMIT 1;\nINSERT INTO sample_data (info) VALUES ('Lab user insert');\nRESET ROLE;\n\n-- 7. Revoke the privileges\nREVOKE SELECT, INSERT ON TABLE sample_data FROM lab_user;\n\n-- 8. Verify that access is now denied (run as lab_user)\nSET ROLE lab_user;\n-- The following statements will raise permission errors\n-- SELECT * FROM sample_data;\n-- INSERT INTO sample_data (info) VALUES ('Should fail');\nRESET ROLE;\n\n-- Optional cleanup (comment out if you want to keep objects)\n-- DROP TABLE sample_data;\n-- DROP ROLE lab_user;"
        },
        "hints": [
          "Use CREATE ROLE with LOGIN to allow the user to connect.",
          "Remember to GRANT USAGE on the sequence when using SERIAL columns.",
          "SET ROLE switches the current session to the test role for permission checks."
        ],
        "concepts": [
          "GRANT statement",
          "REVOKE statement",
          "PostgreSQL roles and privileges",
          "SET ROLE for testing permissions"
        ],
        "difficulty": "Easy",
        "referenceSolution": {
          "sql": "-- 1. Connect as superuser (already assumed)\n-- 2. Create a role for the experiment\nCREATE ROLE lab_user WITH LOGIN PASSWORD 'lab_pass';\n\n-- 3. Create a sample table with a SERIAL primary key\nCREATE TABLE sample_data (\n    id SERIAL PRIMARY KEY,\n    info TEXT NOT NULL\n);\n-- Grant usage on the underlying sequence to the owner (superuser already has it)\nGRANT USAGE, SELECT ON SEQUENCE sample_data_id_seq TO PUBLIC;\n\n-- 4. Insert seed rows\nINSERT INTO sample_data (info) VALUES ('Row 1'), ('Row 2');\n\n-- 5. Grant SELECT and INSERT privileges to the new role\nGRANT SELECT, INSERT ON TABLE sample_data TO lab_user;\n\n-- 6. Verify granted access (run as lab_user)\nSET ROLE lab_user;\n-- Should succeed\nSELECT * FROM sample_data LIMIT 1;\nINSERT INTO sample_data (info) VALUES ('Lab user insert');\nRESET ROLE;\n\n-- 7. Revoke the privileges\nREVOKE SELECT, INSERT ON TABLE sample_data FROM lab_user;\n\n-- 8. Verify that access is now denied (run as lab_user)\nSET ROLE lab_user;\n-- The following statements will raise permission errors\n-- SELECT * FROM sample_data;\n-- INSERT INTO sample_data (info) VALUES ('Should fail');\nRESET ROLE;\n\n-- Optional cleanup (comment out if you want to keep objects)\n-- DROP TABLE sample_data;\n-- DROP ROLE lab_user;"
        },
        "samples": [
          {
            "input": "",
            "output": "CREATE ROLE\nCREATE TABLE\nGRANT\nINSERT 0 2\nGRANT\nSET\n id | info  \n----+-------\n  1 | Row 1\n(1 row)\n\nINSERT 0 1\nRESET\nREVOKE\nSET\nRESET"
          }
        ]
      }
    ]
  },
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 3,
    "problemStatement": "Find the cost of queries using DBMS tools (PostgreSQL, MySQL, Oracle etc).",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "Using EXPLAIN / EXPLAIN ANALYZE, determine and interpret both the estimated and actual execution costs of a representative query on seeded sample data.",
        "type": "sql",
        "isExecutable": false,
        "title": "Analyzing Query Costs with EXPLAIN and EXPLAIN ANALYZE in PostgreSQL",
        "theory": "PostgreSQL's query planner generates an execution plan that includes estimated startup and total costs based on statistics. EXPLAIN shows these estimates without running the query, while EXPLAIN ANALYZE executes the query and reports actual runtime metrics. Comparing the two helps identify mismatches caused by stale statistics, missing indexes, or suboptimal query formulation. Cost units are abstract and represent the planner's estimate of disk I/O and CPU usage. Accurate statistics collected via ANALYZE are essential for reliable cost estimation.",
        "algorithm": "1. Connect as superuser and create a dedicated role for the lab.\n2. Create sample tables (customers, orders) with appropriate columns and primary keys.\n3. Grant the lab role SELECT privileges and USAGE on identity sequences.\n4. Insert a modest amount of seed data into both tables.\n5. Create an index on the orders.order_date column to influence the planner.\n6. Run ANALYZE to collect table statistics.\n7. Execute EXPLAIN on the representative query and note the estimated costs.\n8. Execute EXPLAIN ANALYZE on the same query and capture the actual execution times.\n9. Compare estimated vs. actual costs and discuss any discrepancies.\n10. Clean up objects (optional).",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start Lab"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Create role & tables"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Insert seed data & indexes"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Run ANALYZE"
            },
            {
              "id": "5",
              "type": "process",
              "label": "EXPLAIN query"
            },
            {
              "id": "6",
              "type": "process",
              "label": "EXPLAIN ANALYZE query"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Interpret costs"
            },
            {
              "id": "8",
              "type": "end",
              "label": "End Lab"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "setup": {
          "type": "sql",
          "commands": "-- 1. Create a dedicated lab role\nCREATE ROLE lab_user LOGIN PASSWORD 'lab_pass';\nGRANT CONNECT ON DATABASE postgres TO lab_user;\n\n-- 2. Create sample tables\nCREATE TABLE customers (\n    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    name TEXT NOT NULL\n);\n\nCREATE TABLE orders (\n    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    customer_id BIGINT NOT NULL REFERENCES customers(id),\n    order_date DATE NOT NULL,\n    amount NUMERIC(10,2) NOT NULL\n);\n\n-- Grant privileges to lab_user\nGRANT USAGE ON SEQUENCE customers_id_seq TO lab_user;\nGRANT USAGE ON SEQUENCE orders_id_seq TO lab_user;\nGRANT SELECT ON customers, orders TO lab_user;\n\n-- 3. Insert seed data\nINSERT INTO customers (name) VALUES\n    ('Alice'), ('Bob'), ('Charlie'), ('Diana'), ('Eve');\n\nINSERT INTO orders (customer_id, order_date, amount)\nSELECT\n    (1 + floor(random()*5))::int,               -- random customer_id 1-5\n    CURRENT_DATE - (floor(random()*60))::int,  -- dates within last 60 days\n    (random()*500)::numeric(10,2)               -- random amount up to 500\nFROM generate_series(1, 500) g;  -- 500 orders\n\n-- 4. Create index to help the planner\nCREATE INDEX idx_orders_order_date ON orders(order_date);\n\n-- 5. Collect statistics\nANALYZE customers;\nANALYZE orders;\n\n-- 6. Representative query (grouped count of recent orders per customer)\n-- a) Estimated plan only\nEXPLAIN SELECT c.name, COUNT(o.id) AS order_cnt\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.order_date > CURRENT_DATE - INTERVAL '30 days'\nGROUP BY c.name\nORDER BY order_cnt DESC;\n\n-- b) Actual execution plan with timing\nEXPLAIN ANALYZE SELECT c.name, COUNT(o.id) AS order_cnt\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.order_date > CURRENT_DATE - INTERVAL '30 days'\nGROUP BY c.name\nORDER BY order_cnt DESC;\n"
        },
        "hints": [
          "Run ANALYZE after inserting data so the planner has up‑to‑date statistics.",
          "Observe the difference between \"cost=...\" in EXPLAIN and \"actual time=...\" in EXPLAIN ANALYZE.",
          "If the estimated rows are far off, consider adding or adjusting indexes."
        ],
        "concepts": [
          "Cost estimation and planner statistics",
          "EXPLAIN vs. EXPLAIN ANALYZE output",
          "Impact of indexes on query plans"
        ],
        "difficulty": "Medium",
        "referenceSolution": {
          "sql": "-- 1. Create a dedicated lab role\nCREATE ROLE lab_user LOGIN PASSWORD 'lab_pass';\nGRANT CONNECT ON DATABASE postgres TO lab_user;\n\n-- 2. Create sample tables\nCREATE TABLE customers (\n    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    name TEXT NOT NULL\n);\n\nCREATE TABLE orders (\n    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    customer_id BIGINT NOT NULL REFERENCES customers(id),\n    order_date DATE NOT NULL,\n    amount NUMERIC(10,2) NOT NULL\n);\n\n-- Grant privileges to lab_user\nGRANT USAGE ON SEQUENCE customers_id_seq TO lab_user;\nGRANT USAGE ON SEQUENCE orders_id_seq TO lab_user;\nGRANT SELECT ON customers, orders TO lab_user;\n\n-- 3. Insert seed data\nINSERT INTO customers (name) VALUES\n    ('Alice'), ('Bob'), ('Charlie'), ('Diana'), ('Eve');\n\nINSERT INTO orders (customer_id, order_date, amount)\nSELECT\n    (1 + floor(random()*5))::int,               -- random customer_id 1-5\n    CURRENT_DATE - (floor(random()*60))::int,  -- dates within last 60 days\n    (random()*500)::numeric(10,2)               -- random amount up to 500\nFROM generate_series(1, 500) g;  -- 500 orders\n\n-- 4. Create index to help the planner\nCREATE INDEX idx_orders_order_date ON orders(order_date);\n\n-- 5. Collect statistics\nANALYZE customers;\nANALYZE orders;\n\n-- 6. Representative query (grouped count of recent orders per customer)\n-- a) Estimated plan only\nEXPLAIN SELECT c.name, COUNT(o.id) AS order_cnt\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.order_date > CURRENT_DATE - INTERVAL '30 days'\nGROUP BY c.name\nORDER BY order_cnt DESC;\n\n-- b) Actual execution plan with timing\nEXPLAIN ANALYZE SELECT c.name, COUNT(o.id) AS order_cnt\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nWHERE o.order_date > CURRENT_DATE - INTERVAL '30 days'\nGROUP BY c.name\nORDER BY order_cnt DESC;\n"
        },
        "samples": [
          {
            "input": "",
            "output": "CREATE ROLE\nGRANT\nCREATE TABLE\nCREATE TABLE\nGRANT\nGRANT\nGRANT\nINSERT 0 5\nINSERT 0 500\nCREATE INDEX\nANALYZE\nANALYZE\n                                                 QUERY PLAN                                                 \n------------------------------------------------------------------------------------------------------------\n Sort  (cost=14.85..14.86 rows=5 width=13)\n   Sort Key: (count(o.id)) DESC\n   ->  HashAggregate  (cost=14.74..14.79 rows=5 width=13)\n         Group Key: c.name\n         ->  Hash Join  (cost=1.27..13.48 rows=252 width=13)\n               Hash Cond: (o.customer_id = c.id)\n               ->  Index Scan using idx_orders_order_date on orders o  (cost=0.15..11.15 rows=252 width=16)\n                     Index Cond: (order_date > (CURRENT_DATE - '30 days'::interval))\n               ->  Hash  (cost=1.05..1.05 rows=5 width=13)\n                     ->  Seq Scan on customers c  (cost=0.00..1.05 rows=5 width=13)\n(10 rows)\n\n                                                                       QUERY PLAN                                                                       \n--------------------------------------------------------------------------------------------------------------------------------------------------------\n Sort  (cost=14.85..14.86 rows=5 width=13) (actual time=0.347..0.349 rows=5 loops=1)\n   Sort Key: (count(o.id)) DESC\n   Sort Method: quicksort  Memory: 25kB\n   ->  HashAggregate  (cost=14.74..14.79 rows=5 width=13) (actual time=0.272..0.274 rows=5 loops=1)\n         Group Key: c.name\n         Batches: 1  Memory Usage: 24kB\n         ->  Hash Join  (cost=1.27..13.48 rows=252 width=13) (actual time=0.144..0.228 rows=252 loops=1)\n               Hash Cond: (o.customer_id = c.id)\n               ->  Index Scan using idx_orders_order_date on orders o  (cost=0.15..11.15 rows=252 width=16) (actual time=0.053..0.100 rows=252 loops=1)\n                     Index Cond: (order_date > (CURRENT_DATE - '30 days'::interval))\n               ->  Hash  (cost=1.05..1.05 rows=5 width=13) (actual time=0.014..0.014 rows=5 loops=1)\n                     Buckets: 1024  Batches: 1  Memory Usage: 9kB\n                     ->  Seq Scan on customers c  (cost=0.00..1.05 rows=5 width=13) (actual time=0.005..0.006 rows=5 loops=1)\n Planning Time: 0.217 ms\n Execution Time: 0.403 ms\n(15 rows)"
          }
        ]
      }
    ]
  },
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 4,
    "problemStatement": "Demonstrate distributed SQL querying using an in-memory data grid (Apache Ignite).",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "Create a partitioned table in Apache Ignite, load sample records, and execute a distributed SQL query to observe how Ignite processes the query across the in‑memory data grid instead of a single‑node disk store.",
        "type": "ignite",
        "isExecutable": false,
        "_note": "Placeholder problem statement - please confirm the real wording for experiment 4 before generating content.",
        "title": "Partitioned Table and Distributed SQL Query in Apache Ignite",
        "theory": "Apache Ignite stores data in memory across a cluster of nodes. A partitioned table distributes its rows evenly among all nodes, providing scalability and fault tolerance. Queries are executed in a distributed fashion: each node processes the portion of data it owns and then aggregates the partial results. Collocation of related data (e.g., primary key and indexed columns) reduces network traffic during joins. Ignite’s thin client can run standard ANSI‑SQL statements against the cluster without needing a full server node.",
        "algorithm": "1. Start an Ignite cluster (at least two nodes).\n2. Connect to the cluster using the thin client.\n3. Create a partitioned table with a primary key.\n4. Insert several sample rows into the table.\n5. Run a SELECT query with a filter and ordering.\n6. Observe the result set returned by the thin client.\n7. Stop the cluster.",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Create Partitioned Table"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Insert Sample Data"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Execute Distributed Query"
            },
            {
              "id": "5",
              "type": "output",
              "label": "View Result Set"
            },
            {
              "id": "6",
              "type": "end",
              "label": "End"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            }
          ]
        },
        "setup": {
          "type": "ignite",
          "commands": "-- Create a partitioned table with one backup\nCREATE TABLE Person (\n    id LONG PRIMARY KEY,\n    name VARCHAR,\n    age INT\n) WITH \"template=partitioned,backups=1\";\n\n-- Insert sample records\nINSERT INTO Person (id, name, age) VALUES\n    (1, 'Alice', 30),\n    (2, 'Bob', 25),\n    (3, 'Charlie', 35),\n    (4, 'Diana', 28);\n\n-- Distributed query: select people older than 27, ordered by age descending\nSELECT name, age FROM Person WHERE age > 27 ORDER BY age DESC;"
        },
        "hints": [
          "Use the thin client URL (e.g., jdbc:ignite:thin://127.0.0.1/) to connect.",
          "The table is partitioned, so each node holds a subset of rows.",
          "Observe the query plan in the Ignite Web Console for deeper insight."
        ],
        "concepts": [
          "Partitioned tables",
          "Distributed SQL execution",
          "In‑memory data grid",
          "Thin client connectivity"
        ],
        "difficulty": "Medium",
        "referenceSolution": {
          "ignite_sql": "-- Create a partitioned table with one backup\nCREATE TABLE Person (\n    id LONG PRIMARY KEY,\n    name VARCHAR,\n    age INT\n) WITH \"template=partitioned,backups=1\";\n\n-- Insert sample records\nINSERT INTO Person (id, name, age) VALUES\n    (1, 'Alice', 30),\n    (2, 'Bob', 25),\n    (3, 'Charlie', 35),\n    (4, 'Diana', 28);\n\n-- Distributed query: select people older than 27, ordered by age descending\nSELECT name, age FROM Person WHERE age > 27 ORDER BY age DESC;"
        },
        "samples": [
          {
            "input": "",
            "output": "-- -- Create a partitioned table with one backup\nCREATE TABLE Person (\n    id LONG PRIMARY KEY,\n    name VARCHAR,\n    age INT\n) WITH \"template=partitioned,backups=1\"\nUPDATED\n0\n-- -- Insert sample records\nINSERT INTO Person (id, name, age) VALUES\n    (1, 'Alice', 30),\n    (2, 'Bob', 25),\n    (3, 'Charlie', 35),\n    (4, 'Diana', 28)\nUPDATED\n4\n-- -- Distributed query: select people older than 27, ordered by age descending\nSELECT name, age FROM Person WHERE age > 27 ORDER BY age DESC\nNAME | AGE\nCharlie | 35\nAlice | 30\nDiana | 28"
          }
        ]
      }
    ]
  },
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 5,
    "problemStatement": "Demonstrate in-memory caching and data replication/partitioning strategies using Apache Ignite.",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "Create Apache Ignite tables using different WITH \"template=...,backups=...\" configurations (partitioned with backups vs replicated without backups), load identical data, and query them to observe how each caching/replication strategy affects data distribution and fault tolerance.",
        "type": "ignite",
        "isExecutable": false,
        "_note": "Placeholder problem statement - please confirm the real wording for experiment 5 before generating content.",
        "title": "Demonstrate Ignite Table Templates and Backups",
        "theory": "Apache Ignite stores data in distributed caches that can be materialized as SQL tables. The WITH \"template\" option defines how a table is partitioned: 'partitioned' spreads rows across cluster nodes, while 'replicated' keeps a full copy on every node. The 'backups' parameter specifies the number of additional node copies for partitioned tables, providing resilience against node failures. Replicated tables do not use the backups attribute because each node already holds a full copy. Understanding these settings helps tune performance, scalability, and reliability of Ignite clusters.",
        "algorithm": "1. Start Ignite cluster with at least two server nodes.\n2. Connect via thin client and execute SQL to create a partitioned table with backups=1.\n3. Execute SQL to create a replicated table without specifying backups.\n4. Insert the same set of rows into both tables.\n5. Run SELECT COUNT(*) on each table to verify data presence.\n6. Optionally query SYS.CACHES to view cache configuration.\n7. Compare results and note differences in data distribution and fault tolerance.\n8. End the lab.",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start Lab"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Create Tables with Templates"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Insert Seed Data"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Run SELECT Queries"
            },
            {
              "id": "5",
              "type": "decision",
              "label": "Compare Row Counts"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Display Results"
            },
            {
              "id": "7",
              "type": "end",
              "label": "End Lab"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "setup": {
          "type": "ignite",
          "commands": "-- Create partitioned table with one backup\nCREATE TABLE PersonPart (\n    id LONG PRIMARY KEY,\n    name VARCHAR,\n    age INT\n) WITH \"template=partitioned,backups=1\";\n\n-- Create replicated table (no backups needed)\nCREATE TABLE PersonRep (\n    id LONG PRIMARY KEY,\n    name VARCHAR,\n    age INT\n) WITH \"template=replicated\";\n\n-- Insert data into partitioned table\nINSERT INTO PersonPart (id, name, age) VALUES (1, 'Alice', 30);\nINSERT INTO PersonPart (id, name, age) VALUES (2, 'Bob', 25);\nINSERT INTO PersonPart (id, name, age) VALUES (3, 'Carol', 28);\n\n-- Insert data into replicated table\nINSERT INTO PersonRep (id, name, age) VALUES (1, 'Alice', 30);\nINSERT INTO PersonRep (id, name, age) VALUES (2, 'Bob', 25);\nINSERT INTO PersonRep (id, name, age) VALUES (3, 'Carol', 28);\n\n-- Query row counts for each table\nSELECT 'Partitioned' AS tbl, COUNT(*) AS cnt FROM PersonPart;\nSELECT 'Replicated' AS tbl, COUNT(*) AS cnt FROM PersonRep;"
        },
        "hints": [
          "Use at least two server nodes to see the effect of backups on partitioned data.",
          "Query SYS.CACHES to verify the template and backup settings of each table.",
          "After stopping one node, re‑run the SELECT on the partitioned table to observe that data is still available because of the backup."
        ],
        "concepts": [
          "Table templates (partitioned vs replicated)",
          "Backup copies for fault tolerance",
          "Data distribution across cluster nodes"
        ],
        "difficulty": "Medium",
        "referenceSolution": {
          "ignite_sql": "-- Create partitioned table with one backup\nCREATE TABLE PersonPart (\n    id LONG PRIMARY KEY,\n    name VARCHAR,\n    age INT\n) WITH \"template=partitioned,backups=1\";\n\n-- Create replicated table (no backups needed)\nCREATE TABLE PersonRep (\n    id LONG PRIMARY KEY,\n    name VARCHAR,\n    age INT\n) WITH \"template=replicated\";\n\n-- Insert data into partitioned table\nINSERT INTO PersonPart (id, name, age) VALUES (1, 'Alice', 30);\nINSERT INTO PersonPart (id, name, age) VALUES (2, 'Bob', 25);\nINSERT INTO PersonPart (id, name, age) VALUES (3, 'Carol', 28);\n\n-- Insert data into replicated table\nINSERT INTO PersonRep (id, name, age) VALUES (1, 'Alice', 30);\nINSERT INTO PersonRep (id, name, age) VALUES (2, 'Bob', 25);\nINSERT INTO PersonRep (id, name, age) VALUES (3, 'Carol', 28);\n\n-- Query row counts for each table\nSELECT 'Partitioned' AS tbl, COUNT(*) AS cnt FROM PersonPart;\nSELECT 'Replicated' AS tbl, COUNT(*) AS cnt FROM PersonRep;"
        },
        "samples": [
          {
            "input": "",
            "output": "-- -- Create partitioned table with one backup\nCREATE TABLE PersonPart (\n    id LONG PRIMARY KEY,\n    name VARCHAR,\n    age INT\n) WITH \"template=partitioned,backups=1\"\nUPDATED\n0\n-- -- Create replicated table (no backups needed)\nCREATE TABLE PersonRep (\n    id LONG PRIMARY KEY,\n    name VARCHAR,\n    age INT\n) WITH \"template=replicated\"\nUPDATED\n0\n-- -- Insert data into partitioned table\nINSERT INTO PersonPart (id, name, age) VALUES (1, 'Alice', 30)\nUPDATED\n1\n-- INSERT INTO PersonPart (id, name, age) VALUES (2, 'Bob', 25)\nUPDATED\n1\n-- INSERT INTO PersonPart (id, name, age) VALUES (3, 'Carol', 28)\nUPDATED\n1\n-- -- Insert data into replicated table\nINSERT INTO PersonRep (id, name, age) VALUES (1, 'Alice', 30)\nUPDATED\n1\n-- INSERT INTO PersonRep (id, name, age) VALUES (2, 'Bob', 25)\nUPDATED\n1\n-- INSERT INTO PersonRep (id, name, age) VALUES (3, 'Carol', 28)\nUPDATED\n1\n-- -- Query row counts for each table\nSELECT 'Partitioned' AS tbl, COUNT(*) AS cnt FROM PersonPart\nTBL | CNT\nPartitioned | 3\n-- SELECT 'Replicated' AS tbl, COUNT(*) AS cnt FROM PersonRep\nTBL | CNT\nReplicated | 3"
          }
        ]
      }
    ]
  },
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 6,
    "problemStatement": "Time series data analysis using a temporal database like TimescaleDB.",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "Create a hypertable in TimescaleDB, populate it with sample time‑series data, and execute time‑bucketed aggregation queries to analyse temperature and humidity trends over time.",
        "type": "sql",
        "isExecutable": false,
        "_note": "Run with --sql-image timescale/timescaledb:latest-pg16 so the container is Timescale-enabled, not plain postgres:16.",
        "title": "TimescaleDB Hypertable Creation and Time‑Bucketed Aggregation",
        "theory": "TimescaleDB extends PostgreSQL with hypertables, which partition data across time and space for efficient time‑series storage. The `time_bucket` function groups rows into fixed‑size intervals, enabling fast aggregate calculations. Numeric values should be rounded using the `numeric` type to avoid missing overloads for `double precision`. Hypertables inherit all PostgreSQL features, so indexes and permissions work as usual.",
        "algorithm": "1. Connect to PostgreSQL as a superuser.\n2. Install the TimescaleDB extension if not present.\n3. Create a regular table `sensor_data` with a timestamp column, device identifier, temperature and humidity columns.\n4. Convert `sensor_data` into a hypertable partitioned on the timestamp column.\n5. Insert synthetic data for the past 24 hours using `generate_series` and `random()`, rounding numeric values to two decimal places.\n6. Create an index on the timestamp column to speed up queries.\n7. Run a `time_bucket` aggregation query to compute hourly average temperature and humidity.\n8. Review the query result set.\n9. Clean up (optional) by dropping objects if needed.",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Create extension & table"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Convert to hypertable"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Insert sample data"
            },
            {
              "id": "5",
              "type": "decision",
              "label": "Run aggregation?"
            },
            {
              "id": "6",
              "type": "output",
              "label": "Display results"
            },
            {
              "id": "7",
              "type": "end",
              "label": "End"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            }
          ]
        },
        "setup": {
          "type": "sql",
          "commands": "-- Install TimescaleDB extension if not already present\nCREATE EXTENSION IF NOT EXISTS timescaledb;\n\n-- Create a regular table to hold sensor readings\nCREATE TABLE sensor_data (\n    time        TIMESTAMPTZ NOT NULL,\n    device_id   INT NOT NULL,\n    temperature NUMERIC(5,2),\n    humidity    NUMERIC(5,2)\n);\n\n-- Convert the table into a hypertable partitioned on the time column\nSELECT create_hypertable('sensor_data', 'time');\n\n-- Insert synthetic data for the last 24 hours (one reading per minute)\nINSERT INTO sensor_data (time, device_id, temperature, humidity)\nSELECT\n    now() - (interval '1 minute' * gs.i) AS time,\n    (1 + floor(random()*5))::int AS device_id,\n    round((20 + random()*10)::numeric, 2) AS temperature,\n    round((40 + random()*20)::numeric, 2) AS humidity\nFROM generate_series(0, 1440) AS gs(i);\n\n-- Index to accelerate time‑based queries\nCREATE INDEX idx_sensor_time ON sensor_data (time);\n\n-- Time‑bucketed aggregation: hourly average temperature and humidity\nSELECT\n    time_bucket('1 hour', time) AS hour,\n    AVG(temperature) AS avg_temperature,\n    AVG(humidity)    AS avg_humidity\nFROM sensor_data\nGROUP BY hour\nORDER BY hour;\n"
        },
        "hints": [
          "Cast the result of `random()*10 + 20` to `numeric` before calling `round`.",
          "Use `generate_series` to create a sequence of timestamps for bulk inserts.",
          "After creating a hypertable, regular indexes on the time column still improve query performance."
        ],
        "concepts": [
          "Hypertable creation with TimescaleDB",
          "Time‑bucket aggregation",
          "Numeric rounding and type casting"
        ],
        "difficulty": "Medium",
        "referenceSolution": {
          "sql": "-- Install TimescaleDB extension if not already present\nCREATE EXTENSION IF NOT EXISTS timescaledb;\n\n-- Create a regular table to hold sensor readings\nCREATE TABLE sensor_data (\n    time        TIMESTAMPTZ NOT NULL,\n    device_id   INT NOT NULL,\n    temperature NUMERIC(5,2),\n    humidity    NUMERIC(5,2)\n);\n\n-- Convert the table into a hypertable partitioned on the time column\nSELECT create_hypertable('sensor_data', 'time');\n\n-- Insert synthetic data for the last 24 hours (one reading per minute)\nINSERT INTO sensor_data (time, device_id, temperature, humidity)\nSELECT\n    now() - (interval '1 minute' * gs.i) AS time,\n    (1 + floor(random()*5))::int AS device_id,\n    round((20 + random()*10)::numeric, 2) AS temperature,\n    round((40 + random()*20)::numeric, 2) AS humidity\nFROM generate_series(0, 1440) AS gs(i);\n\n-- Index to accelerate time‑based queries\nCREATE INDEX idx_sensor_time ON sensor_data (time);\n\n-- Time‑bucketed aggregation: hourly average temperature and humidity\nSELECT\n    time_bucket('1 hour', time) AS hour,\n    AVG(temperature) AS avg_temperature,\n    AVG(humidity)    AS avg_humidity\nFROM sensor_data\nGROUP BY hour\nORDER BY hour;\n"
        },
        "samples": [
          {
            "input": "",
            "output": "CREATE EXTENSION\nCREATE TABLE\n    create_hypertable     \n--------------------------\n (1,public,sensor_data,t)\n(1 row)\n\nINSERT 0 1441\nCREATE INDEX\n          hour          |   avg_temperature   |    avg_humidity     \n------------------------+---------------------+---------------------\n 2026-07-08 13:00:00+00 | 24.0492592592592593 | 49.5138888888888889\n 2026-07-08 14:00:00+00 | 25.4128333333333333 | 50.7666666666666667\n 2026-07-08 15:00:00+00 | 25.0061666666666667 | 51.5983333333333333\n 2026-07-08 16:00:00+00 | 24.5090000000000000 | 50.0203333333333333\n 2026-07-08 17:00:00+00 | 24.9756666666666667 | 49.9525000000000000\n 2026-07-08 18:00:00+00 | 24.5258333333333333 | 49.6156666666666667\n 2026-07-08 19:00:00+00 | 24.8160000000000000 | 50.0525000000000000\n 2026-07-08 20:00:00+00 | 26.1640000000000000 | 50.0236666666666667\n 2026-07-08 21:00:00+00 | 24.7075000000000000 | 50.4843333333333333\n 2026-07-08 22:00:00+00 | 24.5173333333333333 | 50.4118333333333333\n 2026-07-08 23:00:00+00 | 25.0288333333333333 | 50.5173333333333333\n 2026-07-09 00:00:00+00 | 24.2320000000000000 | 51.1723333333333333\n 2026-07-09 01:00:00+00 | 25.5946666666666667 | 50.4028333333333333\n 2026-07-09 02:00:00+00 | 25.0198333333333333 | 49.8991666666666667\n 2026-07-09 03:00:00+00 | 26.0056666666666667 | 50.2608333333333333\n 2026-07-09 04:00:00+00 | 25.1401666666666667 | 50.9811666666666667\n 2026-07-09 05:00:00+00 | 24.9286666666666667 | 49.1965000000000000\n 2026-07-09 06:00:00+00 | 24.6860000000000000 | 50.1506666666666667\n 2026-07-09 07:00:00+00 | 25.2553333333333333 | 49.2165000000000000\n 2026-07-09 08:00:00+00 | 24.9116666666666667 | 49.6808333333333333\n 2026-07-09 09:00:00+00 | 24.6948333333333333 | 50.7775000000000000\n 2026-07-09 10:00:00+00 | 24.5268333333333333 | 49.7673333333333333\n 2026-07-09 11:00:00+00 | 25.3450000000000000 | 49.6133333333333333\n 2026-07-09 12:00:00+00 | 25.0820000000000000 | 49.6021666666666667\n 2026-07-09 13:00:00+00 | 23.7914285714285714 | 46.8542857142857143\n(25 rows)"
          }
        ]
      }
    ]
  },
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 8,
    "problemStatement": "Compare the cost required for query execution and obtain the optimized query.",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "Write an unoptimized query and an optimized alternative that return the same result set (e.g., using different join orders or with/without an index). Execute both queries with EXPLAIN ANALYZE, compare their execution costs, and identify which query is optimized.",
        "type": "sql",
        "isExecutable": false,
        "title": "Comparing Unoptimized and Optimized Queries with EXPLAIN ANALYZE",
        "theory": "PostgreSQL's query planner chooses execution plans based on available indexes, join order, and statistics. An index can dramatically reduce I/O by allowing index scans instead of sequential scans. EXPLAIN ANALYZE runs the query and reports actual runtime statistics, enabling students to see the impact of optimization techniques such as indexing or join reordering.",
        "algorithm": "1. Connect to PostgreSQL as a superuser.\n2. Create a new role \"analyst\" for running the queries.\n3. Create tables \"customers\" and \"orders\" with appropriate primary keys and a foreign key.\n4. Insert a moderate amount of seed data (e.g., 100 customers, 10,000 orders).\n5. Create an index on orders.customer_id.\n6. Grant the analyst role SELECT privilege on both tables and USAGE on the identity sequences.\n7. Disable index scans and run the unoptimized query with EXPLAIN ANALYZE; capture the output.\n8. Enable index scans and run the optimized query (same SQL) with EXPLAIN ANALYZE; capture the output.\n9. Compare the total cost and actual time reported by the two EXPLAIN ANALYZE results.\n10. Conclude which query is optimized based on lower cost and faster execution.",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Create role & tables"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Insert seed data"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Create index on orders.customer_id"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Run unoptimized query (index disabled)"
            },
            {
              "id": "6",
              "type": "process",
              "label": "Run optimized query (index enabled)"
            },
            {
              "id": "7",
              "type": "output",
              "label": "Compare EXPLAIN ANALYZE results"
            },
            {
              "id": "8",
              "type": "end",
              "label": "End"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            },
            {
              "source": "6",
              "target": "7"
            },
            {
              "source": "7",
              "target": "8"
            }
          ]
        },
        "setup": {
          "type": "sql",
          "commands": "-- 1. Create a role for the student analyst\nCREATE ROLE analyst LOGIN PASSWORD 'analystpwd';\n\n-- 2. Create tables with identity columns\nCREATE TABLE customers (\n    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    name TEXT NOT NULL\n);\n\nCREATE TABLE orders (\n    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    customer_id BIGINT NOT NULL REFERENCES customers(id),\n    amount      NUMERIC(10,2) NOT NULL,\n    order_date  DATE NOT NULL\n);\n\n-- Grant usage on the identity sequences to the analyst role\nGRANT USAGE ON SEQUENCE customers_id_seq TO analyst;\nGRANT USAGE ON SEQUENCE orders_id_seq TO analyst;\n\n-- 3. Insert seed data\nINSERT INTO customers (name)\nSELECT 'Customer_' || g\nFROM generate_series(1,100) g;\n\nINSERT INTO orders (customer_id, amount, order_date)\nSELECT (random()*99+1)::BIGINT,\n       (random()*500)::NUMERIC(10,2),\n       CURRENT_DATE - (random()*365)::INT\nFROM generate_series(1,10000);\n\n-- 4. Create an index on orders.customer_id (used by the optimized query)\nCREATE INDEX idx_orders_customer_id ON orders(customer_id);\n\n-- Grant SELECT privilege to the analyst role\nGRANT SELECT ON customers, orders TO analyst;\n\n-- 5. Unoptimized query: force a sequential scan by disabling index scans\nSET enable_indexscan = off;\nEXPLAIN ANALYZE\nSELECT c.name, COUNT(o.id) AS order_count\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.name\nORDER BY order_count DESC;\n\n-- 6. Optimized query: enable index scans (default) and run the same SQL\nSET enable_indexscan = on;\nEXPLAIN ANALYZE\nSELECT c.name, COUNT(o.id) AS order_count\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.name\nORDER BY order_count DESC;\n\n-- Reset session settings (optional)\nRESET enable_indexscan;"
        },
        "hints": [
          "Use GENERATED ALWAYS AS IDENTITY for primary keys and remember to grant USAGE on the underlying sequences.",
          "Disabling index scans with SET enable_indexscan = off forces the planner to use a sequential scan, demonstrating the unoptimized path.",
          "The same SQL statement can be optimized simply by allowing the planner to use the index you created on orders.customer_id."
        ],
        "concepts": [
          "PostgreSQL query planner and execution plans",
          "Indexes and their impact on join performance",
          "EXPLAIN ANALYZE for measuring actual query cost"
        ],
        "difficulty": "Medium",
        "referenceSolution": {
          "sql": "-- 1. Create a role for the student analyst\nCREATE ROLE analyst LOGIN PASSWORD 'analystpwd';\n\n-- 2. Create tables with identity columns\nCREATE TABLE customers (\n    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    name TEXT NOT NULL\n);\n\nCREATE TABLE orders (\n    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    customer_id BIGINT NOT NULL REFERENCES customers(id),\n    amount      NUMERIC(10,2) NOT NULL,\n    order_date  DATE NOT NULL\n);\n\n-- Grant usage on the identity sequences to the analyst role\nGRANT USAGE ON SEQUENCE customers_id_seq TO analyst;\nGRANT USAGE ON SEQUENCE orders_id_seq TO analyst;\n\n-- 3. Insert seed data\nINSERT INTO customers (name)\nSELECT 'Customer_' || g\nFROM generate_series(1,100) g;\n\nINSERT INTO orders (customer_id, amount, order_date)\nSELECT (random()*99+1)::BIGINT,\n       (random()*500)::NUMERIC(10,2),\n       CURRENT_DATE - (random()*365)::INT\nFROM generate_series(1,10000);\n\n-- 4. Create an index on orders.customer_id (used by the optimized query)\nCREATE INDEX idx_orders_customer_id ON orders(customer_id);\n\n-- Grant SELECT privilege to the analyst role\nGRANT SELECT ON customers, orders TO analyst;\n\n-- 5. Unoptimized query: force a sequential scan by disabling index scans\nSET enable_indexscan = off;\nEXPLAIN ANALYZE\nSELECT c.name, COUNT(o.id) AS order_count\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.name\nORDER BY order_count DESC;\n\n-- 6. Optimized query: enable index scans (default) and run the same SQL\nSET enable_indexscan = on;\nEXPLAIN ANALYZE\nSELECT c.name, COUNT(o.id) AS order_count\nFROM customers c\nJOIN orders o ON c.id = o.customer_id\nGROUP BY c.name\nORDER BY order_count DESC;\n\n-- Reset session settings (optional)\nRESET enable_indexscan;"
        },
        "samples": [
          {
            "input": "",
            "output": "CREATE ROLE\nCREATE TABLE\nCREATE TABLE\nGRANT\nGRANT\nINSERT 0 100\nINSERT 0 10000\nCREATE INDEX\nGRANT\nSET\n                                                             QUERY PLAN                                                             \n------------------------------------------------------------------------------------------------------------------------------------\n Sort  (cost=296.98..297.48 rows=200 width=40) (actual time=3.724..3.732 rows=100 loops=1)\n   Sort Key: (count(o.id)) DESC\n   Sort Method: quicksort  Memory: 29kB\n   ->  HashAggregate  (cost=287.34..289.34 rows=200 width=40) (actual time=3.674..3.688 rows=100 loops=1)\n         Group Key: c.name\n         Batches: 1  Memory Usage: 40kB\n         ->  Hash Join  (cost=37.00..237.34 rows=10000 width=40) (actual time=0.088..2.176 rows=10000 loops=1)\n               Hash Cond: (o.customer_id = c.id)\n               ->  Seq Scan on orders o  (cost=0.00..174.00 rows=10000 width=16) (actual time=0.009..0.694 rows=10000 loops=1)\n               ->  Hash  (cost=22.00..22.00 rows=1200 width=40) (actual time=0.039..0.040 rows=100 loops=1)\n                     Buckets: 2048  Batches: 1  Memory Usage: 22kB\n                     ->  Seq Scan on customers c  (cost=0.00..22.00 rows=1200 width=40) (actual time=0.009..0.016 rows=100 loops=1)\n Planning Time: 0.681 ms\n Execution Time: 3.844 ms\n(14 rows)\n\nSET\n                                                             QUERY PLAN                                                             \n------------------------------------------------------------------------------------------------------------------------------------\n Sort  (cost=296.98..297.48 rows=200 width=40) (actual time=3.855..3.861 rows=100 loops=1)\n   Sort Key: (count(o.id)) DESC\n   Sort Method: quicksort  Memory: 29kB\n   ->  HashAggregate  (cost=287.34..289.34 rows=200 width=40) (actual time=3.815..3.828 rows=100 loops=1)\n         Group Key: c.name\n         Batches: 1  Memory Usage: 40kB\n         ->  Hash Join  (cost=37.00..237.34 rows=10000 width=40) (actual time=0.065..2.261 rows=10000 loops=1)\n               Hash Cond: (o.customer_id = c.id)\n               ->  Seq Scan on orders o  (cost=0.00..174.00 rows=10000 width=16) (actual time=0.007..0.788 rows=10000 loops=1)\n               ->  Hash  (cost=22.00..22.00 rows=1200 width=40) (actual time=0.031..0.032 rows=100 loops=1)\n                     Buckets: 2048  Batches: 1  Memory Usage: 22kB\n                     ->  Seq Scan on customers c  (cost=0.00..22.00 rows=1200 width=40) (actual time=0.005..0.012 rows=100 loops=1)\n Planning Time: 0.281 ms\n Execution Time: 3.944 ms\n(14 rows)\n\nRESET"
          }
        ]
      }
    ]
  },
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 9,
    "problemStatement": "Develop a distributed database application (FileServer implementation using RMI).",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "Implement a distributed FileServer application using Java RMI where the server provides remote methods to upload a file, download a file, and list all stored files. The client must invoke these methods and display clear, labeled output for each operation.",
        "type": "rmi",
        "isExecutable": false,
        "title": "Distributed FileServer using Java RMI",
        "theory": "Java RMI enables a Java program to invoke methods on an object residing in another JVM. Remote interfaces extend java.rmi.Remote and declare RemoteException for each method. Implementations extend UnicastRemoteObject to export the object for remote access. The RMI registry, created with LocateRegistry.createRegistry, holds name-to-remote-object bindings. Clients obtain a stub via Naming.lookup and call remote methods as if they were local, with network communication handled by the RMI runtime.",
        "algorithm": "1. Define a remote interface FileServer with methods upload, download, and listFiles, each throwing RemoteException.\n2. Implement FileServerImpl extending UnicastRemoteObject, storing files in a synchronized in‑memory Map<String,String>.\n3. In FileServerMain, create the RMI registry on port 1099, instantiate FileServerImpl, and bind it to a name (e.g., \"FileServer\") using Naming.rebind.\n4. In FileServerClient, lookup the remote object, call upload for several files, print a confirmation after each upload.\n5. Invoke listFiles, print the returned list.\n6. Call download for a chosen file and print its content.\n7. Allow both server and client programs to terminate naturally after completing their tasks.",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start Experiment"
            },
            {
              "id": "2",
              "type": "process",
              "label": "Create RMI Registry & Bind Server"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Client Uploads Files"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Client Lists Files"
            },
            {
              "id": "5",
              "type": "process",
              "label": "Client Downloads a File"
            },
            {
              "id": "6",
              "type": "end",
              "label": "End Experiment"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            }
          ]
        },
        "setup": {
          "type": "rmi",
          "files": {
            "FileServer.java": "import java.rmi.Remote;\nimport java.rmi.RemoteException;\nimport java.util.List;\n\npublic interface FileServer extends Remote {\n    void upload(String filename, String content) throws RemoteException;\n    String download(String filename) throws RemoteException;\n    List<String> listFiles() throws RemoteException;\n}\n",
            "FileServerImpl.java": "import java.rmi.RemoteException;\nimport java.rmi.server.UnicastRemoteObject;\nimport java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\npublic class FileServerImpl extends UnicastRemoteObject implements FileServer {\n    private final Map<String, String> storage;\n\n    public FileServerImpl() throws RemoteException {\n        super();\n        storage = new HashMap<>();\n    }\n\n    @Override\n    public synchronized void upload(String filename, String content) throws RemoteException {\n        storage.put(filename, content);\n    }\n\n    @Override\n    public synchronized String download(String filename) throws RemoteException {\n        return storage.getOrDefault(filename, \"\");\n    }\n\n    @Override\n    public synchronized List<String> listFiles() throws RemoteException {\n        return new ArrayList<>(storage.keySet());\n    }\n}\n",
            "FileServerMain.java": "import java.rmi.Naming;\nimport java.rmi.registry.LocateRegistry;\n\npublic class FileServerMain {\n    public static void main(String[] args) {\n        try {\n            LocateRegistry.createRegistry(1099);\n            FileServerImpl impl = new FileServerImpl();\n            Naming.rebind(\"rmi://localhost/FileServer\", impl);\n            System.out.println(\"FileServer ready.\");\n        } catch (Exception e) {\n            e.printStackTrace();\n        }\n    }\n}\n",
            "FileServerClient.java": "import java.rmi.Naming;\nimport java.util.List;\n\npublic class FileServerClient {\n    public static void main(String[] args) {\n        try {\n            FileServer server = (FileServer) Naming.lookup(\"rmi://localhost/FileServer\");\n            // Upload files\n            server.upload(\"notes.txt\", \"This is the notes content.\");\n            System.out.println(\"Uploaded file: notes.txt\");\n            server.upload(\"data.csv\", \"id,value\\n1,100\\n2,200\");\n            System.out.println(\"Uploaded file: data.csv\");\n            // List files\n            List<String> files = server.listFiles();\n            System.out.println(\"Files on server: \" + files);\n            // Download a file\n            String content = server.download(\"notes.txt\");\n            System.out.println(\"Downloaded notes.txt content: \" + content);\n        } catch (Exception e) {\n            e.printStackTrace();\n        }\n    }\n}\n"
          },
          "server_class": "FileServerMain",
          "client_class": "FileServerClient"
        },
        "hints": [
          "Make all remote methods throw RemoteException and declare them in the interface.",
          "Use synchronized blocks or methods in the implementation to protect the in‑memory Map.",
          "Bind the server with a URL like \"rmi://localhost/FileServer\" and lookup the same URL from the client."
        ],
        "concepts": [
          "Remote interface definition",
          "UnicastRemoteObject export",
          "RMI registry creation and binding",
          "Remote method invocation and exception handling"
        ],
        "difficulty": "Medium",
        "referenceSolution": {
          "FileServer.java": "import java.rmi.Remote;\nimport java.rmi.RemoteException;\nimport java.util.List;\n\npublic interface FileServer extends Remote {\n    void upload(String filename, String content) throws RemoteException;\n    String download(String filename) throws RemoteException;\n    List<String> listFiles() throws RemoteException;\n}\n",
          "FileServerImpl.java": "import java.rmi.RemoteException;\nimport java.rmi.server.UnicastRemoteObject;\nimport java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.List;\nimport java.util.Map;\n\npublic class FileServerImpl extends UnicastRemoteObject implements FileServer {\n    private final Map<String, String> storage;\n\n    public FileServerImpl() throws RemoteException {\n        super();\n        storage = new HashMap<>();\n    }\n\n    @Override\n    public synchronized void upload(String filename, String content) throws RemoteException {\n        storage.put(filename, content);\n    }\n\n    @Override\n    public synchronized String download(String filename) throws RemoteException {\n        return storage.getOrDefault(filename, \"\");\n    }\n\n    @Override\n    public synchronized List<String> listFiles() throws RemoteException {\n        return new ArrayList<>(storage.keySet());\n    }\n}\n",
          "FileServerMain.java": "import java.rmi.Naming;\nimport java.rmi.registry.LocateRegistry;\n\npublic class FileServerMain {\n    public static void main(String[] args) {\n        try {\n            LocateRegistry.createRegistry(1099);\n            FileServerImpl impl = new FileServerImpl();\n            Naming.rebind(\"rmi://localhost/FileServer\", impl);\n            System.out.println(\"FileServer ready.\");\n        } catch (Exception e) {\n            e.printStackTrace();\n        }\n    }\n}\n",
          "FileServerClient.java": "import java.rmi.Naming;\nimport java.util.List;\n\npublic class FileServerClient {\n    public static void main(String[] args) {\n        try {\n            FileServer server = (FileServer) Naming.lookup(\"rmi://localhost/FileServer\");\n            // Upload files\n            server.upload(\"notes.txt\", \"This is the notes content.\");\n            System.out.println(\"Uploaded file: notes.txt\");\n            server.upload(\"data.csv\", \"id,value\\n1,100\\n2,200\");\n            System.out.println(\"Uploaded file: data.csv\");\n            // List files\n            List<String> files = server.listFiles();\n            System.out.println(\"Files on server: \" + files);\n            // Download a file\n            String content = server.download(\"notes.txt\");\n            System.out.println(\"Downloaded notes.txt content: \" + content);\n        } catch (Exception e) {\n            e.printStackTrace();\n        }\n    }\n}\n"
        },
        "samples": [
          {
            "input": "",
            "output": "Uploaded file: notes.txt\nUploaded file: data.csv\nFiles on server: [notes.txt, data.csv]\nDownloaded notes.txt content: This is the notes content."
          }
        ]
      }
    ]
  },
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 10,
    "problemStatement": "Create a node and relationships using Neo4j.",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "Using Cypher in Neo4j, create sample nodes with appropriate labels and properties, define relationships between these nodes, and return the resulting graph structure.",
        "type": "cypher",
        "isExecutable": false,
        "title": "Create Sample Graph with Nodes and Relationships",
        "theory": "In Neo4j, data is modeled as nodes and relationships, each of which can have one or more labels and a set of key‑value properties. Labels categorize nodes (e.g., Person, Company) and enable efficient indexing. Relationships are directed, typed connections that also may carry properties, allowing rich graph traversals. Cypher's CREATE clause adds nodes and relationships, while MATCH with pattern syntax retrieves subgraphs. The RETURN clause specifies what to display, often using variables bound in MATCH patterns.",
        "algorithm": "1. Clear any existing data from the database.\n2. Define and create sample nodes with labels and properties.\n3. Define and create relationships between the created nodes, optionally adding relationship properties.\n4. Query the graph using a MATCH pattern that captures nodes and their relationships.\n5. Return the matched nodes and relationships to visualize the graph.",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Define nodes & relationships"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Execute CREATE statements"
            },
            {
              "id": "4",
              "type": "output",
              "label": "Return graph structure"
            },
            {
              "id": "5",
              "type": "end",
              "label": "End"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            }
          ]
        },
        "setup": {
          "type": "cypher",
          "commands": "// Clean the database\nMATCH (n) DETACH DELETE n;\n\n// Create sample nodes\nCREATE (alice:Person {name: 'Alice', age: 30}),\n       (bob:Person {name: 'Bob', age: 35}),\n       (acme:Company {name: 'Acme Corp', industry: 'Manufacturing'}),\n       (globex:Company {name: 'Globex Inc', industry: 'Technology'});\n\n// Create relationships between nodes\nCREATE (alice)-[:WORKS_FOR {since: 2015}]->(acme),\n       (bob)-[:WORKS_FOR {since: 2018}]->(globex),\n       (bob)-[:MANAGES]->(acme);\n\n// Return the created graph structure\nMATCH (n)-[r]->(m)\nRETURN n, r, m\nORDER BY n.name;"
        },
        "hints": [
          "Use a single CREATE statement with commas to add multiple nodes at once.",
          "Assign meaningful labels (e.g., Person, Company) to differentiate node types.",
          "After creating the graph, use MATCH (n)-[r]->(m) RETURN n, r, m to view the whole structure."
        ],
        "concepts": [
          "Node labels",
          "Node properties",
          "Relationship types and properties",
          "Pattern matching with MATCH",
          "RETURN clause for visualization"
        ],
        "difficulty": "Medium",
        "referenceSolution": {
          "cypher": "// Clean the database\nMATCH (n) DETACH DELETE n;\n\n// Create sample nodes\nCREATE (alice:Person {name: 'Alice', age: 30}),\n       (bob:Person {name: 'Bob', age: 35}),\n       (acme:Company {name: 'Acme Corp', industry: 'Manufacturing'}),\n       (globex:Company {name: 'Globex Inc', industry: 'Technology'});\n\n// Create relationships between nodes\nCREATE (alice)-[:WORKS_FOR {since: 2015}]->(acme),\n       (bob)-[:WORKS_FOR {since: 2018}]->(globex),\n       (bob)-[:MANAGES]->(acme);\n\n// Return the created graph structure\nMATCH (n)-[r]->(m)\nRETURN n, r, m\nORDER BY n.name;"
        },
        "samples": [
          {
            "input": "",
            "output": "n, r, m\n(), [:WORKS_FOR {since: 2015}], ()\n(), [:WORKS_FOR {since: 2018}], ()\n(), [:MANAGES], ()"
          }
        ]
      }
    ]
  },
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 11,
    "problemStatement": "Select and display data using Neo4j.",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "Using Cypher MATCH, WHERE, and RETURN clauses on a seeded graph, retrieve nodes and relationships that satisfy specified conditions and display the selected properties.",
        "type": "cypher",
        "isExecutable": false,
        "title": "Cypher MATCH/WHERE/RETURN Query Lab",
        "theory": "In Neo4j, the MATCH clause defines a pattern to search for in the graph. The WHERE clause refines this pattern by applying boolean predicates on node or relationship properties. Multiple predicates can be combined with AND, OR, and NOT operators. RETURN specifies which elements and properties of the matched pattern are sent back to the user. Cypher’s pattern matching is declarative, allowing expressive queries without explicit traversal code.",
        "algorithm": "1. Load the seed data into the graph (create Person nodes and FRIEND relationships).\\n2. Formulate a MATCH pattern that captures the desired node or relationship type.\\n3. Add a WHERE clause with the required property filters (e.g., age > 30 AND city = 'London').\\n4. Use RETURN to project the needed properties of the matched elements.\\n5. Execute the query and verify the output matches the expected criteria.",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Start Lab"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Create Seed Data"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Write MATCH/WHERE Query"
            },
            {
              "id": "4",
              "type": "decision",
              "label": "Conditions Met?"
            },
            {
              "id": "5",
              "type": "output",
              "label": "Display Results"
            },
            {
              "id": "6",
              "type": "end",
              "label": "End Lab"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            }
          ]
        },
        "setup": {
          "type": "cypher",
          "commands": "// -------------------------------------------------\n// 1. Seed data: create Person nodes and FRIEND relationships\n// -------------------------------------------------\nCREATE (:Person {name: 'Alice', age: 28, city: 'London'});\nCREATE (:Person {name: 'Bob', age: 35, city: 'London'});\nCREATE (:Person {name: 'Carol', age: 42, city: 'New York'});\nCREATE (:Person {name: 'Dave', age: 31, city: 'London'});\nCREATE (:Person {name: 'Eve', age: 27, city: 'Paris'});\n\n// FRIEND relationships with a 'since' property\nMATCH (a:Person {name: 'Bob'}), (b:Person {name: 'Alice'}) CREATE (a)-[:FRIEND {since: 2015}]->(b);\nMATCH (a:Person {name: 'Bob'}), (c:Person {name: 'Carol'}) CREATE (a)-[:FRIEND {since: 2018}]->(c);\nMATCH (a:Person {name: 'Dave'}), (b:Person {name: 'Alice'}) CREATE (a)-[:FRIEND {since: 2020}]->(b);\n\n// -------------------------------------------------\n// 2. Query 1: Find Persons older than 30 living in London\n// -------------------------------------------------\nMATCH (p:Person)\nWHERE p.age > 30 AND p.city = 'London'\nRETURN p.name AS Name, p.age AS Age, p.city AS City;\n\n// -------------------------------------------------\n// 3. Query 2: Find FRIEND relationships where the source Person is older than 30\n// -------------------------------------------------\nMATCH (p1:Person)-[r:FRIEND]->(p2:Person)\nWHERE p1.age > 30\nRETURN p1.name AS From, p2.name AS To, r.since AS Since;\n"
        },
        "hints": [
          "Use property names exactly as they were defined in the CREATE statements.",
          "Combine multiple predicates in WHERE with AND for stricter filtering.",
          "Remember that RETURN can rename columns using the AS keyword."
        ],
        "concepts": [
          "Pattern matching with MATCH",
          "Filtering with WHERE",
          "Projection with RETURN",
          "Node and relationship properties"
        ],
        "difficulty": "Easy",
        "referenceSolution": {
          "cypher": "// -------------------------------------------------\n// 1. Seed data: create Person nodes and FRIEND relationships\n// -------------------------------------------------\nCREATE (:Person {name: 'Alice', age: 28, city: 'London'});\nCREATE (:Person {name: 'Bob', age: 35, city: 'London'});\nCREATE (:Person {name: 'Carol', age: 42, city: 'New York'});\nCREATE (:Person {name: 'Dave', age: 31, city: 'London'});\nCREATE (:Person {name: 'Eve', age: 27, city: 'Paris'});\n\n// FRIEND relationships with a 'since' property\nMATCH (a:Person {name: 'Bob'}), (b:Person {name: 'Alice'}) CREATE (a)-[:FRIEND {since: 2015}]->(b);\nMATCH (a:Person {name: 'Bob'}), (c:Person {name: 'Carol'}) CREATE (a)-[:FRIEND {since: 2018}]->(c);\nMATCH (a:Person {name: 'Dave'}), (b:Person {name: 'Alice'}) CREATE (a)-[:FRIEND {since: 2020}]->(b);\n\n// -------------------------------------------------\n// 2. Query 1: Find Persons older than 30 living in London\n// -------------------------------------------------\nMATCH (p:Person)\nWHERE p.age > 30 AND p.city = 'London'\nRETURN p.name AS Name, p.age AS Age, p.city AS City;\n\n// -------------------------------------------------\n// 3. Query 2: Find FRIEND relationships where the source Person is older than 30\n// -------------------------------------------------\nMATCH (p1:Person)-[r:FRIEND]->(p2:Person)\nWHERE p1.age > 30\nRETURN p1.name AS From, p2.name AS To, r.since AS Since;\n"
        },
        "samples": [
          {
            "input": "",
            "output": "Name, Age, City\n\"Bob\", 35, \"London\"\n\"Dave\", 31, \"London\"\nFrom, To, Since\n\"Bob\", \"Alice\", 2015\n\"Bob\", \"Carol\", 2018\n\"Dave\", \"Alice\", 2020"
          }
        ]
      }
    ]
  },
  {
    "department": "Electronics and computer science",
    "subject": "Advanced Database Management Systems",
    "experimentNumber": 12,
    "problemStatement": "Create index and add constraints using Neo4j.",
    "subExperiments": [
      {
        "part": "a",
        "problemStatement": "In Neo4j, create an index on a node property to speed up lookups, add a uniqueness constraint on another property, and demonstrate that the constraint is enforced.",
        "type": "cypher",
        "isExecutable": false,
        "title": "Creating Index and Uniqueness Constraint in Neo4j",
        "theory": "Neo4j uses indexes to accelerate property lookups, especially for equality and range queries. A uniqueness constraint guarantees that a property value is unique across all nodes with a given label, and it implicitly creates an index for fast validation. Constraints are defined using the CREATE CONSTRAINT syntax and can be scoped to a label and property. Indexes are created with CREATE INDEX and can be named or left unnamed. When a uniqueness constraint is violated, Neo4j aborts the transaction and returns an error, ensuring data integrity.",
        "algorithm": "1. Start the lab.\n2. Create a uniqueness constraint on Person.email and an index on Person.name.\n3. Insert sample Person nodes.\n4. Attempt to insert another Person with an existing email to see the constraint error (commented out to avoid abort).\n5. Query and return all Person nodes to verify data.\n6. End the lab.",
        "flowchart": {
          "nodes": [
            {
              "id": "1",
              "type": "start",
              "label": "Begin Lab"
            },
            {
              "id": "2",
              "type": "input",
              "label": "Define constraints & index"
            },
            {
              "id": "3",
              "type": "process",
              "label": "Create sample data"
            },
            {
              "id": "4",
              "type": "process",
              "label": "Attempt duplicate insert"
            },
            {
              "id": "5",
              "type": "output",
              "label": "Display persons"
            },
            {
              "id": "6",
              "type": "end",
              "label": "Lab Complete"
            }
          ],
          "edges": [
            {
              "source": "1",
              "target": "2"
            },
            {
              "source": "2",
              "target": "3"
            },
            {
              "source": "3",
              "target": "4"
            },
            {
              "source": "4",
              "target": "5"
            },
            {
              "source": "5",
              "target": "6"
            }
          ]
        },
        "setup": {
          "type": "cypher",
          "commands": "// Clean any existing data\nMATCH (n) DETACH DELETE n;\n\n// Create a uniqueness constraint on Person.email (available in Community Edition)\nCREATE CONSTRAINT person_email_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.email IS UNIQUE;\n\n// Create an index on Person.name to speed up name lookups\nCREATE INDEX person_name_index IF NOT EXISTS FOR (p:Person) ON (p.name);\n\n// Insert sample Person nodes\nCREATE (:Person {name: 'Alice', email: 'alice@example.com', age: 30});\nCREATE (:Person {name: 'Bob', email: 'bob@example.com', age: 25});\n\n// Demonstrate constraint enforcement (this would fail if executed)\n// CREATE (:Person {name: 'Charlie', email: 'alice@example.com', age: 22}); // expected to fail\n\n// Return all Person nodes to verify the result\nMATCH (p:Person) RETURN p.name AS name, p.email AS email, p.age AS age ORDER BY p.name;"
        },
        "hints": [
          "Use IF NOT EXISTS when creating constraints or indexes to make the script idempotent.",
          "A uniqueness constraint automatically creates an index, so you only need a separate index for other properties you query frequently.",
          "Comment out the duplicate CREATE statement to show the expected error without stopping the script."
        ],
        "concepts": [
          "Uniqueness constraint",
          "Property index",
          "Constraint enforcement"
        ],
        "difficulty": "Medium",
        "referenceSolution": {
          "cypher": "// Clean any existing data\nMATCH (n) DETACH DELETE n;\n\n// Create a uniqueness constraint on Person.email (available in Community Edition)\nCREATE CONSTRAINT person_email_unique IF NOT EXISTS FOR (p:Person) REQUIRE p.email IS UNIQUE;\n\n// Create an index on Person.name to speed up name lookups\nCREATE INDEX person_name_index IF NOT EXISTS FOR (p:Person) ON (p.name);\n\n// Insert sample Person nodes\nCREATE (:Person {name: 'Alice', email: 'alice@example.com', age: 30});\nCREATE (:Person {name: 'Bob', email: 'bob@example.com', age: 25});\n\n// Demonstrate constraint enforcement (this would fail if executed)\n// CREATE (:Person {name: 'Charlie', email: 'alice@example.com', age: 22}); // expected to fail\n\n// Return all Person nodes to verify the result\nMATCH (p:Person) RETURN p.name AS name, p.email AS email, p.age AS age ORDER BY p.name;"
        },
        "samples": [
          {
            "input": "",
            "output": "name, email, age\n\"Alice\", \"alice@example.com\", 30\n\"Bob\", \"bob@example.com\", 25"
          }
        ]
      }
    ]
  }
]
];
// ===================================================

async function seedExperiments() {
  try {
    await mongoose.connect('mongodb+srv://dbUser:DNtr6fJbVa1PoQgP@cluster0.bkxmcjc.mongodb.net/bh-labs?appName=Cluster0/bh-labs');

    console.log('✅ Connected to MongoDB');

    // Update existing
    const updateResult = await Experiment.updateMany(
      {},
      { $set: { "subExperiments.$[].isExecutable": true } }
    );
    console.log(`✅ Updated ${updateResult.modifiedCount} existing sub-experiments`);

    const experimentsArray = Array.isArray(rawData[0]) ? rawData[0] : rawData;

    const experimentsToInsert = experimentsArray.map(exp => ({
      // ✅ Properly converted to ObjectId
      subjectId: new mongoose.Types.ObjectId('6a4b93a8dedd29c33d5fc5bd'),

      experimentNumber: exp.experimentNumber,
      problemStatement: exp.problemStatement,
      subExperiments: exp.subExperiments.map(sub => {
        let files = [];

        if (sub.referenceSolution && typeof sub.referenceSolution === 'object') {
          Object.entries(sub.referenceSolution).forEach(([key, code]) => {
            let filename = "solution.sql";
            if (key === "ignite_sql") filename = "main.ignite";
            else if (key === "cypher") filename = "solution.cypher";
            else if (key === "sql") filename = "solution.sql";
            else if (key.includes(".")) filename = key;
            else filename = `solution.${key}`;

            files.push({ filename, content: code, language: key });
          });
        }

        return {
          part: sub.part,
          title: sub.title,
          problemStatement: sub.problemStatement,
          theory: sub.theory || "",
          algorithm: sub.algorithm || "",
          flowchart: sub.flowchart || { nodes: [], edges: [] },
          files: files,
          referenceSolution: {},
          samples: sub.samples || [],
          hints: sub.hints || [],
          concepts: sub.concepts || [],
          difficulty: sub.difficulty || "Medium",
          isExecutable: false
        };
      })
    }));

    const result = await Experiment.insertMany(experimentsToInsert);
    console.log(`✅ Successfully seeded ${result.length} new experiments`);

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedExperiments();