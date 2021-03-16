## Section 1: Simple - But Powerful SQL Statements

Data taken from here:
[https://en.wikipedia.org/wiki/List_of_largest_cities](https://en.wikipedia.org/wiki/List_of_largest_cities)
Statements entered here:
[https://pg-sql.com/](https://pg-sql.com/)

### Creating Tables

```sql
CREATE TABLE cities (
  name VARCHAR(50),
  country VARCHAR(50),
  population INTEGER,
  area INTEGER
);
```

`VARCHAR(50)` - If we put in a string longer than 50 characters, we'll get an error.
`INTEGER` - If we put in a number larger/smaller than -2,147,483,647 to +2,147,483,647, we'll get an error.

### Inserting Data Into a Table

```sql
INSERT INTO cities (name, country, population, area)
VALUES ('Tokyo', 'Japan', 37977000, 8230);
```

Order of columns doesn't matter but the values given to `VALUES` must match up with the columns (i.e. 'Tokyo' must line up with name).

```sql
INSERT INTO cities (name, country, population, area)
VALUES
	('Delhi', 'India', 29617000, 2232),
  ('Shanghai', 'China', 22120000, 4068),
  ('Sao Paulo', 'Brazil', 22046000, 3116);
```

### Retrieving Data with Select

```sql
SELECT * FROM cities;
SELECT name, country FROM cities;
SELECT name, population FROM cities;
```

### Exercise - Create, Insert and Select!

```sql
-- You don't need to change these lines
CREATE TABLE movies (
    title VARCHAR(60),
    box_office INTEGER
);

INSERT INTO movies (title, box_office)
VALUES 
    ('The Avengers', 1500000000),
    ('Batman v Superman', 873000000);
    

-- WRITE YOUR SOLUTION BELOW THIS LINE!
```
    
Write a `SELECT` statement to retrieve both rows inserted into the `movies` table. Select both the `title` column and the `box_office` column.

### Calculated Columns

```sql
SELECT name, population / area FROM cities;
SELECT name, population + area FROM cities;
SELECT name, population / area AS population_density FROM cities;
```

### Exercise - Using Calculated Columns

* Write a query that will select the `name` of each phone from the `phones` table and calculate the total revenue for each phone (`price` X `units_sold`)
* Rename this calculated column to revenue

| name  | manufacturer | price | units_sold |
| N1280 | Nokia        | 199   | 1925       | 

### String Operators and Functions

```sql
SELECT name || country FROM cities;
SELECT name || ', ' || country FROM cities;
SELECT name || ', ' || country AS location FROM cities;
SELECT CONCAT(name, ', ', country) AS location FROM cities;
SELECT 
  CONCAT(UPPER(name), ', ', country) AS location 
FROM 
  cities;
```
