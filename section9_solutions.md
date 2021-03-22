### Solution - Embedding in Select

```sql
SELECT name, price, price / (
  SELECT MAX(price) FROM phones
) AS price_ratio
FROM phones;
```sql
