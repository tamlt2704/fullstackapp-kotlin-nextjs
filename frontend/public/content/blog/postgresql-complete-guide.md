---
title: "PostgreSQL Complete Guide for Developers"
date: "2024-12-06"
category: "Database"
tags: ["PostgreSQL", "Database", "SQL", "Performance", "Advanced"]
---

# PostgreSQL Complete Guide for Developers

*Published on December 6, 2024*

## 1. PostgreSQL Fundamentals

### What is PostgreSQL?
- **Object-relational database** with advanced features
- **ACID compliant** with full transaction support
- **Extensible** with custom functions, operators, and data types
- **Standards compliant** SQL with many advanced features
- **Multi-version concurrency control** (MVCC)

### Key Features
- **JSON/JSONB support** for NoSQL-like operations
- **Full-text search** capabilities
- **Geospatial data** with PostGIS extension
- **Array and composite types**
- **Window functions** and CTEs
- **Parallel query execution**

### Installation and Setup
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Docker
docker run --name postgres-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

### Basic Configuration
```sql
-- postgresql.conf key settings
shared_buffers = 256MB          -- 25% of RAM
effective_cache_size = 1GB      -- 75% of RAM
work_mem = 4MB                  -- Per operation memory
maintenance_work_mem = 64MB     -- Maintenance operations
max_connections = 100           -- Connection limit
```

### Q&A: PostgreSQL Fundamentals

**Q1: What's the difference between PostgreSQL and MySQL?**
A: PostgreSQL is more standards-compliant, supports advanced data types (JSON, arrays), has better concurrency control (MVCC), and stronger ACID compliance.

**Q2: What is MVCC and why is it important?**
A: Multi-Version Concurrency Control allows multiple transactions to access data simultaneously without blocking, improving performance and reducing deadlocks.

**Q3: When should you use JSONB over JSON?**
A: JSONB is binary format, faster for queries and indexing, supports GIN indexes. Use JSON only when you need exact formatting preservation.

**Q4: What's the difference between VACUUM and ANALYZE?**
A: VACUUM reclaims storage from dead tuples; ANALYZE updates table statistics for query planner optimization.

**Q5: How does PostgreSQL handle NULL values?**
A: NULLs are treated as unknown values, don't match in comparisons, and are handled specially in indexes and constraints.

## 2. Advanced Data Types

### JSON and JSONB
```sql
-- JSON column
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    attributes JSON,
    metadata JSONB
);

-- Insert JSON data
INSERT INTO products (name, attributes, metadata) VALUES
('Laptop', '{"brand": "Dell", "ram": "16GB"}', '{"tags": ["electronics", "computer"], "rating": 4.5}');

-- Query JSON data
SELECT name, attributes->>'brand' as brand
FROM products
WHERE attributes->>'ram' = '16GB';

-- JSONB operators
SELECT * FROM products 
WHERE metadata @> '{"tags": ["electronics"]}';  -- Contains

SELECT * FROM products 
WHERE metadata ? 'rating';  -- Key exists

-- JSON path queries
SELECT name, jsonb_path_query(metadata, '$.tags[*]') as tag
FROM products;
```

### Arrays
```sql
-- Array columns
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    tags TEXT[],
    scores INTEGER[]
);

-- Insert array data
INSERT INTO posts (title, tags, scores) VALUES
('PostgreSQL Guide', ARRAY['database', 'sql', 'tutorial'], ARRAY[95, 87, 92]);

-- Array operations
SELECT title FROM posts 
WHERE 'database' = ANY(tags);  -- Contains element

SELECT title FROM posts 
WHERE tags @> ARRAY['sql'];  -- Contains array

SELECT title, array_length(tags, 1) as tag_count
FROM posts;

-- Array aggregation
SELECT array_agg(title) as all_titles
FROM posts;
```

### Custom Types and Enums
```sql
-- Enum type
CREATE TYPE status_type AS ENUM ('draft', 'published', 'archived');

-- Composite type
CREATE TYPE address_type AS (
    street VARCHAR(100),
    city VARCHAR(50),
    postal_code VARCHAR(10),
    country VARCHAR(50)
);

-- Using custom types
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    status status_type DEFAULT 'draft',
    author_address address_type
);

-- Insert with composite type
INSERT INTO articles (title, status, author_address) VALUES
('PostgreSQL Types', 'published', ROW('123 Main St', 'New York', '10001', 'USA'));

-- Query composite type
SELECT title, (author_address).city
FROM articles
WHERE (author_address).country = 'USA';
```

### Q&A: Advanced Data Types

**Q1: When should you use arrays vs separate tables?**
A: Use arrays for simple, fixed-size collections that don't need complex queries. Use separate tables for normalized data with relationships.

**Q2: What's the performance difference between JSON and JSONB?**
A: JSONB is faster for queries (binary format, indexable) but slower for insertion. JSON preserves exact formatting.

**Q3: How do you index JSONB data?**
A: Use GIN indexes: `CREATE INDEX ON table USING GIN (jsonb_column);` for containment queries.

**Q4: Can you modify enum values?**
A: You can add new values with `ALTER TYPE enum_name ADD VALUE 'new_value'`, but cannot remove or modify existing values.

**Q5: What are the limitations of PostgreSQL arrays?**
A: Arrays are not normalized, limited query capabilities, and can impact performance with large arrays.

## 3. Indexing and Performance

### Index Types
```sql
-- B-tree index (default)
CREATE INDEX idx_users_email ON users (email);

-- Partial index
CREATE INDEX idx_active_users ON users (created_at) 
WHERE status = 'active';

-- Composite index
CREATE INDEX idx_orders_customer_date ON orders (customer_id, order_date);

-- GIN index for arrays/JSONB
CREATE INDEX idx_posts_tags ON posts USING GIN (tags);
CREATE INDEX idx_products_metadata ON products USING GIN (metadata);

-- GiST index for full-text search
CREATE INDEX idx_articles_search ON articles USING GIN (to_tsvector('english', title || ' ' || content));

-- Hash index (equality only)
CREATE INDEX idx_users_id_hash ON users USING HASH (id);

-- Expression index
CREATE INDEX idx_users_lower_email ON users (lower(email));
```

### Query Optimization
```sql
-- Analyze query performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.customer_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name
ORDER BY order_count DESC;

-- Index usage statistics
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Table statistics
SELECT schemaname, tablename, seq_scan, seq_tup_read, idx_scan, idx_tup_fetch
FROM pg_stat_user_tables
ORDER BY seq_scan DESC;
```

### Performance Tuning
```sql
-- Update table statistics
ANALYZE users;

-- Vacuum and analyze
VACUUM ANALYZE orders;

-- Reindex
REINDEX INDEX idx_users_email;

-- Check for unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Find missing indexes (slow queries)
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

### Q&A: Indexing and Performance

**Q1: When should you use a composite index vs multiple single-column indexes?**
A: Use composite indexes when queries filter on multiple columns together. Order matters - most selective column first.

**Q2: What's the difference between GIN and GiST indexes?**
A: GIN is better for exact matches (arrays, JSONB); GiST is better for range queries and geometric data.

**Q3: How do you identify slow queries?**
A: Enable `pg_stat_statements`, use `EXPLAIN ANALYZE`, check `log_min_duration_statement`, and monitor with tools like pgBadger.

**Q4: What's the cost of maintaining indexes?**
A: Indexes slow down INSERT/UPDATE/DELETE operations and consume storage. Balance query performance with write performance.

**Q5: When should you use partial indexes?**
A: When queries frequently filter on a specific condition (e.g., active records only), reducing index size and maintenance cost.

## 4. Advanced Queries

### Window Functions
```sql
-- Ranking functions
SELECT 
    name,
    salary,
    ROW_NUMBER() OVER (ORDER BY salary DESC) as row_num,
    RANK() OVER (ORDER BY salary DESC) as rank,
    DENSE_RANK() OVER (ORDER BY salary DESC) as dense_rank,
    PERCENT_RANK() OVER (ORDER BY salary DESC) as percent_rank
FROM employees;

-- Partition by department
SELECT 
    name,
    department,
    salary,
    AVG(salary) OVER (PARTITION BY department) as dept_avg,
    salary - AVG(salary) OVER (PARTITION BY department) as diff_from_avg
FROM employees;

-- Running totals
SELECT 
    order_date,
    amount,
    SUM(amount) OVER (ORDER BY order_date ROWS UNBOUNDED PRECEDING) as running_total,
    LAG(amount, 1) OVER (ORDER BY order_date) as previous_amount,
    LEAD(amount, 1) OVER (ORDER BY order_date) as next_amount
FROM orders;
```

### Common Table Expressions (CTEs)
```sql
-- Recursive CTE for hierarchical data
WITH RECURSIVE employee_hierarchy AS (
    -- Base case: top-level managers
    SELECT id, name, manager_id, 1 as level
    FROM employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive case: employees with managers
    SELECT e.id, e.name, e.manager_id, eh.level + 1
    FROM employees e
    JOIN employee_hierarchy eh ON e.manager_id = eh.id
)
SELECT * FROM employee_hierarchy
ORDER BY level, name;

-- Multiple CTEs
WITH 
monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        SUM(amount) as total_sales
    FROM orders
    GROUP BY DATE_TRUNC('month', order_date)
),
avg_monthly_sales AS (
    SELECT AVG(total_sales) as avg_sales
    FROM monthly_sales
)
SELECT 
    ms.month,
    ms.total_sales,
    ams.avg_sales,
    ms.total_sales - ams.avg_sales as difference
FROM monthly_sales ms
CROSS JOIN avg_monthly_sales ams
ORDER BY ms.month;
```

### Advanced Aggregations
```sql
-- GROUPING SETS
SELECT 
    department,
    position,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary
FROM employees
GROUP BY GROUPING SETS (
    (department),
    (position),
    (department, position),
    ()
);

-- ROLLUP and CUBE
SELECT 
    department,
    position,
    COUNT(*) as count
FROM employees
GROUP BY ROLLUP (department, position);

-- Filtered aggregates
SELECT 
    department,
    COUNT(*) as total_employees,
    COUNT(*) FILTER (WHERE salary > 50000) as high_earners,
    AVG(salary) FILTER (WHERE hire_date > '2023-01-01') as new_hire_avg_salary
FROM employees
GROUP BY department;
```

### Q&A: Advanced Queries

**Q1: What's the difference between RANK() and DENSE_RANK()?**
A: RANK() leaves gaps after ties (1,2,2,4); DENSE_RANK() doesn't leave gaps (1,2,2,3).

**Q2: When should you use CTEs vs subqueries?**
A: CTEs improve readability, can be recursive, and can be referenced multiple times. Use for complex queries and hierarchical data.

**Q3: What's the performance impact of window functions?**
A: Window functions can be expensive with large datasets. Consider partitioning and proper indexing on ORDER BY columns.

**Q4: How do GROUPING SETS differ from multiple GROUP BY queries?**
A: GROUPING SETS perform multiple groupings in a single scan, more efficient than UNION of separate GROUP BY queries.

**Q5: What are the limitations of recursive CTEs?**
A: Risk of infinite loops, performance issues with deep recursion, and complexity in debugging.

## 5. Transactions and Concurrency

### Transaction Isolation Levels
```sql
-- Read Uncommitted (lowest isolation)
BEGIN TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;
SELECT * FROM accounts WHERE id = 1;
COMMIT;

-- Read Committed (default)
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;
SELECT * FROM accounts WHERE id = 1;
-- Other transaction can modify data between reads
SELECT * FROM accounts WHERE id = 1;  -- Might see different data
COMMIT;

-- Repeatable Read
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
SELECT * FROM accounts WHERE id = 1;
-- Data remains consistent within transaction
SELECT * FROM accounts WHERE id = 1;  -- Same data guaranteed
COMMIT;

-- Serializable (highest isolation)
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SELECT SUM(balance) FROM accounts;
INSERT INTO accounts (balance) VALUES (1000);
COMMIT;  -- May fail with serialization error
```

### Locking and Concurrency
```sql
-- Explicit locking
BEGIN;
SELECT * FROM accounts WHERE id = 1 FOR UPDATE;  -- Row-level lock
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- Advisory locks
SELECT pg_advisory_lock(12345);  -- Application-level lock
-- Perform critical operations
SELECT pg_advisory_unlock(12345);

-- Lock monitoring
SELECT 
    l.locktype,
    l.database,
    l.relation::regclass,
    l.page,
    l.tuple,
    l.pid,
    a.query
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted;
```

### Deadlock Prevention
```sql
-- Always acquire locks in same order
BEGIN;
SELECT * FROM table_a WHERE id = 1 FOR UPDATE;
SELECT * FROM table_b WHERE id = 2 FOR UPDATE;
-- Perform operations
COMMIT;

-- Use timeouts
SET lock_timeout = '5s';
SET statement_timeout = '30s';

-- Deadlock detection query
SELECT 
    blocked_locks.pid AS blocked_pid,
    blocked_activity.usename AS blocked_user,
    blocking_locks.pid AS blocking_pid,
    blocking_activity.usename AS blocking_user,
    blocked_activity.query AS blocked_statement,
    blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted AND blocking_locks.granted;
```

### Q&A: Transactions and Concurrency

**Q1: What's the default isolation level in PostgreSQL?**
A: Read Committed - you see committed changes from other transactions during your transaction.

**Q2: When would you use SERIALIZABLE isolation?**
A: When you need complete isolation and can handle serialization failures, typically for financial transactions.

**Q3: What's the difference between FOR UPDATE and FOR SHARE?**
A: FOR UPDATE prevents other transactions from updating/deleting rows; FOR SHARE allows updates but prevents deletes.

**Q4: How does PostgreSQL handle deadlocks?**
A: Automatic deadlock detection and resolution by aborting one of the conflicting transactions.

**Q5: What are advisory locks used for?**
A: Application-level coordination, like ensuring only one instance of a job runs at a time.

## 6. Stored Procedures and Functions

### PL/pgSQL Functions
```sql
-- Basic function
CREATE OR REPLACE FUNCTION calculate_tax(amount DECIMAL, rate DECIMAL)
RETURNS DECIMAL AS $$
BEGIN
    RETURN amount * rate / 100;
END;
$$ LANGUAGE plpgsql;

-- Function with conditional logic
CREATE OR REPLACE FUNCTION get_discount(customer_type VARCHAR, order_amount DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
    discount_rate DECIMAL := 0;
BEGIN
    CASE customer_type
        WHEN 'premium' THEN
            IF order_amount > 1000 THEN
                discount_rate := 0.15;
            ELSE
                discount_rate := 0.10;
            END IF;
        WHEN 'regular' THEN
            IF order_amount > 500 THEN
                discount_rate := 0.05;
            END IF;
        ELSE
            discount_rate := 0;
    END CASE;
    
    RETURN order_amount * discount_rate;
END;
$$ LANGUAGE plpgsql;

-- Function with loops
CREATE OR REPLACE FUNCTION fibonacci(n INTEGER)
RETURNS INTEGER AS $$
DECLARE
    a INTEGER := 0;
    b INTEGER := 1;
    temp INTEGER;
    i INTEGER;
BEGIN
    IF n <= 1 THEN
        RETURN n;
    END IF;
    
    FOR i IN 2..n LOOP
        temp := a + b;
        a := b;
        b := temp;
    END LOOP;
    
    RETURN b;
END;
$$ LANGUAGE plpgsql;
```

### Triggers
```sql
-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (table_name, operation, new_data, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, new_data, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, old_data, timestamp)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD), NOW());
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER users_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

-- Timestamp trigger
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

### Stored Procedures (PostgreSQL 11+)
```sql
-- Stored procedure with transaction control
CREATE OR REPLACE PROCEDURE transfer_funds(
    from_account INTEGER,
    to_account INTEGER,
    amount DECIMAL
)
LANGUAGE plpgsql AS $$
DECLARE
    from_balance DECIMAL;
BEGIN
    -- Start transaction
    SELECT balance INTO from_balance 
    FROM accounts 
    WHERE id = from_account FOR UPDATE;
    
    IF from_balance < amount THEN
        RAISE EXCEPTION 'Insufficient funds';
    END IF;
    
    -- Debit from source
    UPDATE accounts 
    SET balance = balance - amount 
    WHERE id = from_account;
    
    -- Credit to destination
    UPDATE accounts 
    SET balance = balance + amount 
    WHERE id = to_account;
    
    -- Log transaction
    INSERT INTO transactions (from_account, to_account, amount, timestamp)
    VALUES (from_account, to_account, amount, NOW());
    
    COMMIT;
    
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
$$;

-- Call procedure
CALL transfer_funds(1, 2, 500.00);
```

### Q&A: Stored Procedures and Functions

**Q1: What's the difference between functions and procedures?**
A: Functions return values and can be used in queries; procedures don't return values and can manage transactions.

**Q2: When should you use triggers?**
A: For automatic data validation, auditing, maintaining derived data, and enforcing complex business rules.

**Q3: What are the performance implications of triggers?**
A: Triggers add overhead to DML operations. Keep them simple and avoid complex logic or external calls.

**Q4: Can you debug PL/pgSQL functions?**
A: Yes, use RAISE NOTICE for logging, pgAdmin debugger, or plpgsql_check extension for static analysis.

**Q5: What's the difference between BEFORE and AFTER triggers?**
A: BEFORE triggers can modify data before it's written; AFTER triggers work with final data and can't modify it.

## 7. Backup and Recovery

### Backup Strategies
```bash
# Full database backup
pg_dump -h localhost -U postgres -d mydb > backup.sql

# Compressed backup
pg_dump -h localhost -U postgres -d mydb | gzip > backup.sql.gz

# Custom format (faster restore)
pg_dump -h localhost -U postgres -Fc -d mydb > backup.dump

# Schema only
pg_dump -h localhost -U postgres -s -d mydb > schema.sql

# Data only
pg_dump -h localhost -U postgres -a -d mydb > data.sql

# Specific tables
pg_dump -h localhost -U postgres -t users -t orders -d mydb > tables.sql

# All databases
pg_dumpall -h localhost -U postgres > all_databases.sql
```

### Point-in-Time Recovery (PITR)
```bash
# Enable WAL archiving in postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /path/to/archive/%f'

# Base backup
pg_basebackup -h localhost -U postgres -D /backup/base -Ft -z -P

# Recovery configuration
# Create recovery.conf or use postgresql.auto.conf
restore_command = 'cp /path/to/archive/%f %p'
recovery_target_time = '2024-12-06 14:30:00'
```

### Continuous Archiving
```sql
-- Check WAL status
SELECT pg_current_wal_lsn();
SELECT pg_walfile_name(pg_current_wal_lsn());

-- Force WAL switch
SELECT pg_switch_wal();

-- Archive status
SELECT name, setting FROM pg_settings WHERE name LIKE 'archive%';
```

### Replication Setup
```bash
# Primary server postgresql.conf
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64

# Create replication user
CREATE USER replicator REPLICATION LOGIN PASSWORD 'password';

# Standby server
pg_basebackup -h primary_host -D /var/lib/postgresql/data -U replicator -P -W

# Standby configuration
standby_mode = 'on'
primary_conninfo = 'host=primary_host port=5432 user=replicator'
```

### Q&A: Backup and Recovery

**Q1: What's the difference between pg_dump and pg_basebackup?**
A: pg_dump creates logical backups (SQL); pg_basebackup creates physical backups (binary files) for PITR.

**Q2: How do you perform zero-downtime backups?**
A: Use pg_basebackup with streaming replication or logical replication for continuous backup.

**Q3: What's the recovery time objective (RTO) for different backup methods?**
A: pg_restore: minutes to hours; PITR: seconds to minutes; streaming replication: near-zero.

**Q4: How do you test backup integrity?**
A: Regularly restore backups to test environment, verify data consistency, and test recovery procedures.

**Q5: What's the difference between synchronous and asynchronous replication?**
A: Synchronous waits for standby confirmation (no data loss); asynchronous doesn't wait (potential data loss but better performance).

---

*This comprehensive PostgreSQL guide covers fundamental to advanced topics for developers and database administrators. Practice with real datasets and scenarios to master these concepts.*