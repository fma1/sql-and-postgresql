## Secton 7 - Sorting Records

### The Basics of Sorting

We're going to take a look at sorting records. Reorder records based upon some value in a column. Let's take a look at a quick example or two.

Sort by price. Least expensive to most expensive.

```sql
SELECT *
FROM products
ORDER BY price;
```

Now normally by default you're going to go from the lowest value to the highest value. If you want to flip the order you can apply an optional keyword:

```sql
SELECT *
FROM products
ORDER BY price;
```

Now we get descending order. We can also put in `ASC` rather than `DESC` to be really really obvious. That's all on sorting.

### Two Variations on Sorting

Select all our different products, but not sort by a number. I want to arrange them by name in alphabetical order.

```sql
SELECT *
FROM products
ORDER by name;
```

```sql
SELECT *
FROM products
ORDER by name DESC;
```

```sql
SELECT *
FROM products
ORDER by name ASC;
```

We can order by many different properties. You might notice the first two have the same price. If we want to, not only sort by price, we can apply a second ordering rule if the two have the same price. Let's sort by price and then weight if prices are equal.


```sql
SELECT *
FROM products
ORDER by price, weight;
```

### Offset and Limit

Pretty straightforward. Make use of `OFFSET`, skip some number of records. Offset of 3, skip first 3 records.

```sql
SELECT *
FROM USERS
OFFSET 40;
```

We can see the rows start from 41.

LIMIT somewhat similar in nature. Only take some specific number of records from the table.

So if we had an offset of 3 and a limit of 2, we would drop the first 3 rows, and then only take the remaining 2 rows.


```sql
SELECT *
FROM users
LIMIT 5;
```

```sql
SELECT *
FROM users
LIMIT 1;
```

```sql
SELECT *
FROM users
LIMIT 50;
```

```sql
SELECT *
FROM users
LIMIT 999;
```

I want to try order all my different products by price, and  i want to retrieve the 5 least expensive products.

```sql
SELECT *
FROM products
ORDER BY price
LIMIT 5;
```

Anytime you're working with a large set of records to the user. Companies like amazon with millions of products. Apply offset and limit.


```sql
SELECT *
FROM products
ORDER BY price
LIMIT 10
OFFSET 0;
```

```sql
SELECT *
FROM products
ORDER BY price
LIMIT 10
OFFSET 10;
```

### Exercise - Sorting, Offsetting, and Limiting

Write a query that shows the names of only the second and third most expensive phones.

For reference, here is the phones table:

| name        | manufacturer | price | units_sold |
|-------------|--------------|-------|------------|
| N1280       | Nokia        | 199   | 1925       |
| Iphone 4    | Apple        | 399   | 9436       |
| Galaxy S    | Samsung      | 299   | 2359       |
| S5620 Monte | Samsung      | 250   | 2385       |
| N8          | Nokia        | 150   | 7543       |
| Droid       | Motorola     | 150   | 8395       |
| Wave S8500  | Samsung      | 175   | 9259       |
