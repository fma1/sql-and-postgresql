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

