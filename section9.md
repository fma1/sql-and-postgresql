## Section 9 - Subqueries

Right now we want to solve this problem:
List the name and price of all prodcts that are _more expensive than all the products in the 'Toys' department_

We can probably answer this question with just the `products` table.

Right now we have one row in the Toys department which has a price of $876. So we want to find all the products that are more expensive than $876. The only one that's more expensive is the Mouse in the Grocery department for $989. Ultimately we would want to find this row right here. So let's try to write some SQL. There's an easy way and hard way.

Easy way:
```
SELECT name, price
FROM products
WHERE price > 876;
```

This is cheating. We only know the most expensive product in the Toys departments is because we visually saw that. But often we'll have too many rows to visually inspect the table. If we have millions of products, we can't do this.

We would need a query to find the most expensive product. We would need to break it into two different steps or queries. First query finds the most expensive product in the Toys department. Then we'd take the result and put it into a second query that finds all products that are more expensive.

Whenever we find ourselves writing two queries like this, we can instead combine these two separate queries by using a subquery. Let's look at how we would combine these two specific queries.

```sql
SELECT name, price
FROM products
WHERE price > ___
```

So wehere `____` is, that is where would want to insert another query. The second query inside the parentheses will be executed first.


```sql
SELECT name, price
FROM products
WHERE price > (
  SELECT MAX(price)
  FROM products
  WHERE department = 'Toys'
);
```

Note: There is no semicolon inside of the parentheses.

### Thinking About the Structure of Data

We got our first taste of subqueries. Subqueries are known in the world of SQL as being challenging to understand. Let me show you a very extreme example.

```sql
SELECT
  p1.name,
  (SELECT COUNT(name) FROM products)
FROM (SELECT * FROM proudcts) as p1
JOIN (SELECT * FROM proudcts) as p2 ON p1.id = p2.id
WHERE p1.id IN (SELECT id FROM products);
```

Take a look at this. There are 4 separate subqueries. So one of the reasons that understanding subqueries is challenging to understand is because it can appear in many different locations.

![Subqueries](images/subqueries.png)

The very first one is producting a single value. The two in the middle are producing a source of rows. The last one is producing a single column.

We're going to take a little detour. We're going to focus on understanding the shape of data.

![Subquery Shapes](images/subqueries_shape.png)

I want to imagine 3 of these queries here and I want you to think about the structure of data when we execute the query. If we ran this first query, I'd expect to get many different rows and many different columsn. If we ran this second query, I'd expect to get many different rows but one single column. And if we ran this last query, I'd expect to get one single row and one single column which we refer to as a Scalar query.

### Subqueries in a Select

As you saw, we can insert different subqueries in different locations. The different subqueries in different locations must return different shapes of data. First scenario is putting in a subquery in SELECT statement. If we want to add a subquery, it must be a subquery that gives a single value or one row and one column.  

For example, this query gives us a single result:
```sql
SELECT MAX(price)
FROM products
```

```sql
SELECT name, price, (
  SELECT MAX(price)
  FROM products
)
FROM products
WHERE price > 867;
```

So right now, this query isn't too meaningful. I'm not too worried about showing you meaningful queries right now. I just want you to get used to idea of making use of subqueries and where we can use them.

### Exercise - Embedding in Select

Write a query that prints the name and price for each phone.  In addition, print out the ratio of the phones price against max price of all phones (so price / max price).  Rename this third column to price_ratio

The result should look something like this. (Only one row is shown, there should be one row for each phone)

| name  | price | price_ratio |
|-------|-------|-------------|
| N1280 | 199   | .498        |

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

### Subqueries in a From

We are going to take a look at inserting a subquery into a `FROM`.

This is going to be a bit more difficult, because what you can put into a `FROM` clause is much more flexible.

You can put any subquery as long as outer selects/wheres are compatible.

__Gotcha__: A subquery in a `FROM` clause requires an alias to be attached to it (because it's like a table).

So let's take a look at this subquery:
```sql
SELECT name,
price / weight as price_weight_ratio
FROM products
```

Let's go and run that subquery and investigate the structure of data.

So we have two columns, `name` and `price_weight_ratio`. Whenever we write out a subquery in the `FROM` clause, we are saying there's this special source of data that we want to use. Remember that we must apply an alias to the subquery in the `FROM` clause so we can refer to that special source of data later.

So let's take a look at outer query.
```sql
SELECT name, price_weight_ratio
FROM ___________________ AS p
WHERE price_weight_ratio > 5;
```

This query implies with the `SELECT` that `name` and `price_weight_ratio` columns are avaialble through the `FROM` clause.

We have to make sure that the outer `SELECT` is compatible. What does that really mean? If we asked for `price` in the `SELECT` statement, we would get an error because that column does not exist in our subquery in the `FROM` clause. Same thing in `WHERE` clause. If we tried to use `weight` in the `WHERE` clause, we'd also get an error.

You might ask why we would need to use a subquery in the `FROM` clause. Well, this is just for demonstration purposes. For this example you don't really need the subquery.

### From Subqueries that Return a Value

Let's try this subquery:
```sql
SELECT MAX(price)
FROM products;
```

We get `989`. That's one single value. We can use that as long as the outer `SELECT`/`WHERE`/`GROUP BY`/etc. matches. What would work is this:
```sql
SELECT *
FROM ___ as p;
```

So let's run that subquery first, and integrate that into a larger query.

```sql
SELECT *
FROM (SELECT MAX(price) FROM products) as p;
```

Again, this doesn't need the subquery. It's for demonstration purposes.

### Example of a Subquery in a From

__Find the average number of orders for _all_ users__

There is more than one way to solve this. Instead of using 2 subqueries inside of a `SELECT` clause, we are going to use a subquery in the `FROM` clause.

You might group orders by `user_id`. Now that we've counted them up, we've got 7 orders and 4 users, which is 1.75 orders per user.

So we might do a `GROUP BY` and use the `SUM()` aggregate function. There's one little problem here. We can write out a query getting us this far.

```sql
SELECT user_id, COUNT(*)
FROM orders
GROUP BY user_id;
```

Now how do we find the average? We can't just do something like `AVG(COUNT(*))`.
 Also that wouldn't take the average of all the groups. This is where we would make use of a subquery.

```sql
SELECT p.order_count
FROM (
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id;
) AS p;
```

Now we have a single column of values. So we can apply an aggregate function.

```sql
SELECT AVG(order_count)
FROM (
  SELECT user_id, COUNT(*) AS order_count
  FROM orders
  GROUP BY user_id;
) AS p;
```

So on average a user has 11 orders. Now it's not exactly 11 because we're treating `order_count` as an integer, but we haven't really discussed conversion of values to float.

### Exercise - Subquery From's

Calculate the average price of phones for each manufacturer.  Then print the highest average price. Rename this value to `max_average_price`


For reference, here is the `phones` table:

| name        | manufacturer | price | units_sold |
|-------------|--------------|-------|------------|
| N1280       | Nokia        | 199   | 1925       |
| Iphone 4    | Apple        | 399   | 9436       |
| Galaxy S    | Samsung      | 299   | 2359       |
| S5620 Monte | Samsung      | 250   | 2385       |
| N8          | Nokia        | 150   | 7543       |
| Droid       | Motorola     | 150   | 8395       |
| Wave S8500  | Samsung      | 175   | 9259       |


### Subqueries in a Join Clause

It's really difficult to show you why with our current dataset so this is going to be contrived.

Outer query:
```sql
SELECT first_name
FROM users
JOIN (___
) AS o
ON o.user_id = users.id
```

Subquery:
```sql
SELECT user_id
FROM orders
WHERE product_id = 3
```

Any subquery must return data compatible with the `ON` clause

From the orders table, find rows in `orders` only related to `product_id` of 3. Then use the remaining data with for a `JOIN` with `users`.

```sql
SELECT first_name
FROM users
JOIN (
  SELECT user_id FROM orders WHERE product_id = 3
) AS o
ON o.user_id = users.id
```

So now we can see all users that ordered a product with id of 3.
