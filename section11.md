## Utility Operators, Keywords and Functions

### The Greatest Value in a List

Let's start off with an example to show you how to make use of a PostgreSQL function.

```
SELECT GREATEST(20, 10, 30);
SELECT GREATEST(200, 10, 30);
```

Let's say we want to compute the cost to ship each item. Shipping is the maximum of (weight * 2) or $30.

```
SELECT name, weight, GREATEST(30, 2 * weight)
FROM products;
```

### The Least Value in a List

Just like greatest, we have a function to select the least value in a list.

```
SELECT LEAST(1, 20, 50, 100);
SELECT LEAST(1000, 20, 50, 100);
```

Let's say all products are on sale and price is the least of the product's price * 0.5 or $400.

```
SELECT name, price, LEAST(price * 0.5, 400)
FROM products;
```

For these two functions, you're just going to need to know it when you need it. Just important right now to understand these two functions exist.

### The Case Keyword

Print each product and its prie. Also print a description of the price.

If price > 600 then 'high'
If price > 300 then 'medium' 
else print 'cheap'

```sql
SELECT
  name,
  price,
  CASE
    WHEN price > 600 THEN 'high'
    WHEN price > 300 THEN 'medium'
    ELSE 'cheap'
  END
FROM products;
```

So we can make a use of case to make a comparison over any other column. That's pretty much it for a `CASE` clause. Not required to have an `ELSE` but `WHEN` is required, but we'd get a default value of `NULL`.
