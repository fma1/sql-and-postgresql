## Section 8 - Unions and Intersections with Sets

We're going to look at new keyword called `UNION`.

Find the 4 products with the highest price __and__ the 4 products with the highest price/weight ratio. Most efficient to ship items.

I want you to notice that it might be challenging to solve this problem with one query. To get the first products with highest price, have to ORDER BY, and pop 4 more expensive items. To get the second part, sort by price/weight ratio. Two different sorting criteria.

So let's just try to solve these separately first.

```sql
SELECT *
FROM products
ORDER by price DESC
LIMIT 4;
```

```sql
SELECT *
FROM products
ORDER by price / weight DESC
LIMIT 4;
```

So now we have 2 separate queries and combine the results. This is where the `UNION` keyword comes into play.

```sql
(
  SELECT *
  FROM products
  ORDER by price DESC
  LIMIT 4;
)
UNION
(
  SELECT *
  FROM products
  ORDER by price / weight DESC
  LIMIT 4;
)
```

Now you might notice we only have 7 rows. That's because we have a row that exists in both of the two queries. We can change this with the `UNION ALL` keyword to not remove duplicates.

```sql
(
  SELECT *
  FROM products
  ORDER by price DESC
  LIMIT 4;
)
UNION ALL
(
  SELECT *
  FROM products
  ORDER by price / weight DESC
  LIMIT 4;
)
```

### A Few Notes on Union

1) We have parentheses. It is not strictly required to use parentheses. We use parentheses because the database may be confused about whether we're doing `ORDER BY` on the union or just the 2nd query.

2) Once again we have products table. Let's say we have two queries.

```sql
SELECT name, price
FROM products
```

```sql
SELECT name, weight
FROM products
```

We are only allowed to use `UNION` if the columns are the same.

### Commonalities with Intersect

There are a couple of other keywords:

![Set Operations](images/setoperations.png)

Now we're going to look at the `INTERSECT` keyword:
```sql
(
  SELECT *
  FROM products
  ORDER by price DESC
  LIMIT 4;
)
INTERSECT
(
  SELECT *
  FROM products
  ORDER by price / weight DESC
  LIMIT 4;
)
```

It's only that row that is common to the row. Another keyword is `INTERSECT ALL`. You might think we would see two rows with `INTERSECT ALL` but instead, we're only going to see the same result. We're only going to see more than 1 if there's more than 1 row in the top query and more than 1 row in the bottom query.

### Remving Commonalities with Except

`EXCEPT`is going take two different queries, rows present in first query but not in second query

Two very important things. 
1. On the right hand side, we have some extra rows. These don't matter. Only the rows on the Left Hand Side matter. Not like a total/true difference.
2. All the other Set keywords are Commutative. However, this doesn't hold true for `EXCEPT`.

```sql
(
  SELECT *
  FROM products
  ORDER by price DESC
  LIMIT 4;
)
EXCEPT
(
  SELECT *
  FROM products
  ORDER by price / weight DESC
  LIMIT 4;
)
```

### Exercise - Merging Results with Union

Write a query that will print the manufacturer of phones where the phone's price is less than 170.  Also print all manufacturer that have created more than two phones.

IMPORTANT: You don't need to wrap each query with parenthesis! Your solution should not have any parens in it.

Hint:

To find the manufacturers who have created more than two phones, you can group by manufacturer then apply a 'HAVING' filter to only consider groups with a `COUNT(*) > 2`

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

