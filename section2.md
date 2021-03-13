## Filtering Records

### Filtering Rows with "Where"

```sql
SELECT name, area FROM cities WHERE area > 4000;
```

Best not to think of query as executed from left to right.

1st: `FROM cities`
2nd: `WHERE area > 4000`
3rd: `SELECT name, area`

First Postgres takes a data source, analyzes the query and it's going to pull all different rows from the cities table. After it gets all that data, it's going to apply filtering criteria. Then, from the remaining entries/rows, it's going to select some number of columns (name and area in this case).

### More on the "Where" Keyword

```sql
SELECT name, area FROM cities WHERE area < 4000;
SELECT name, area FROM cities WHERE area = 8230;
SELECT name, area FROM cities WHERE area != 8230;
```

### Compound "Where" Clauses

```sql
SELECT name, area FROM cities WHERE area BETWEEN 2000 AND 4000;
SELECT name, area FROM cities WHERE name IN ('Delhi', 'Shanghai');
SELECT name, area FROM cities WHERE name NOT IN ('Delhi', 'Shanghai');
SELECT name, area FROM cities WHERE area NOT IN (8230, 3116);

SELECT 
  name, 
  area 
FROM 
  cities 
WHERE 
  area NOT IN (8230, 3116) AND name = 'Delhi';
```

### Exercise - Practicing Where Statements

* Write a query that will print the `name` and `price` of all phones that sold __greater than 5000 units__.

### Exercise - A More Challenging "Where"

* Write a query that will print the `name` and `manufacturer` of all phones created by Apple or Samsung (`manufacturer` column contains Apple, Samsung, Nokia, Motorola, etc.)

### Exercise - Trying Calculations in Where Clauses

* Write a query that will print the `name` and `total_revenue` of all phones with a `total_revenue` greater than 1,000,000 (remember that `total_revenue` isn't an actual column in the table; you have to create it from `price` and `units_sold`) 
