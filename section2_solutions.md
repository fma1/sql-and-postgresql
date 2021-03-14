### Solution - Practicing Where Statements

`SELECT name, price FROM phones WHERE units_sold > 5000;`

### Solution - A More Challenging "Where"

`SELECT name, manufacturer FROM phones WHERE manufacturer in ('Apple', 'Samsung');`

### Solution - Trying Calculations in Where Clauses

`SELECT name, price * units_sold AS total_revenue FROM phones WHERE price * units_sold > 1000000;`

### Solution - Try Updating Records in a Table

```
UPDATE phones SET units_sold = 8543 WHERE name = 'N8' ;
SELECT * from phones;
```

### Solution - Practice Deleting Records

```
DELETE FROM phones WHERE manufacturer = 'Samsung';
SELECT * from phones;
```
