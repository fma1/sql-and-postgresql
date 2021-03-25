## Selecting Distinct Records

## Selecting Distinct Values

`DISTINCT` is always going to place inside of a `SELECT` clause. Always right after it. All unique values inside of a column.

```sql
SELECT DISTINCT department
FROM products;
```

That would give us a list of all unique departments.

You might note `DISTINCT` is like `GROUP BY` because it's taking a look at a column and removing duplicate records. You can use `GROUP BY` in place of `DISTINCT` but not vice versa.

```sql
SELECT DISTINCT department, name
FROM products;
```

That will give us all unique combinations of department and name.

One use of the keyword is to print out a count of all unique values:

```sql
SELECT COUNT(DISTINCT department)
FROM products;
```

If we do a `DISTINCT` over 2 or more different columns we can no longer do a count on it.

### Exercise - Some Practice with Distinct

Write a query that will print the number of unique phone manufacturers.

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

