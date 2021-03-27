### Solution - Embedding in Select

```sql
SELECT name, price, price / (
  SELECT MAX(price) FROM phones
) AS price_ratio
FROM phones;
```

### Solution - Subquery From's

```sql
SELECT MAX(average_price) AS max_average_price
FROM (
  SELECT manufacturer, AVG(price) AS average_price
  FROM phones 
  GROUP BY manufacturer
) AS p;
```

### Solution - Subquery Where's

```sql
SELECT name, price
FROM phones
WHERE price > (
    SELECT price
    FROM phones
    WHERE name = 'S5620 Monte'
);
```

### Solution - Practice Your Subqueries!

```sql
SELECT name
FROM phones
WHERE price > ALL (
    SELECT price
    FROM phones
    WHERE manufacturer = 'Samsung'
);
```

### Solution - From-less Selects

```sql
SELECT (
  SELECT MAX(price) FROM phones
) AS max_price, (
  SELECT MIN(price) FROM phones
) AS min_price, (
  SELECT AVG(price) FROM phones
) AS avg_price;
```
