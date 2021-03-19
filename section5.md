### Section 5 - Aggregation of Records

## Aggregating and Grouping

With all the queries up until now, always been trying to put a set of rows, exact information more or less put into database.

Moving forward, we're going to use two techniques: Grouping and Aggregation.

__Grouping__:
* Reduces many rows down to fewer rows
* Done by using the `GROUP BY` keyword
* Visualizing the result is key to using grouping

__Aggregates__:
* Reduces many values down to one
* Done by using 'aggregate functions'

## Picturing Group By

Taking many rows and condensing down to fewer rows. So let's try a few queries.

```sql
SELECT user_id
FROM comments
GROUP BY user_id;
```

Result:
| user\_id |
|---------|
| 1       |
| 3       |
| 5       |
| 4       |
| 2       |

So we just have this `user_id` column. What happened?

`GROUP BY user_id` -> Find the set of all unique `user_id`s -> Take each row and assign it to a group based on its `user_id`

![Group By Table](/images/groupby.png)

All the values inside the `user_id` column match up to each other in their respective group. So group `user_id` #1 has only rows that have a `user_id` of 1. So we now can try to select info out of this temporary group table, but there is a big catch on what we can select. We can only select some very certain columns. We can only select in particular the grouped column. We are not allowed to directly select any of the red columns.


If we try this query:
```sql
SELECT contents
FROM comments
GROUP BY user_id;
```

We get:
```
column "comments.contents" must appear in the GROUP BY clause or be used in an aggregate function
```

## Aggregate Functions

Aggregate Functions reduce many different values down to just one.

* `COUNT()` -> Return number of values in a group of values
* `SUM()` -> Finds the __sum__ of a group of numbers
* `AVG()` -> Find the __average__ of a group of numbers
* `MIN()` -> Returns the __maximum__ value from a group of numbers
* `MAX()` -> Returns the __minimum__ value from a group of numbers

```sql
SELECT MAX(id)
FROM comments;
```

```sql
SELECT MIN(id)
FROM comments;
```

```sql
SELECT AVG(id)
FROM comments;
```

```sql
SELECT SUM(id)
FROM comments;
```

Now, when we make use of an aggregate function, we cannot do a normal `SELECT` next to it:
```sql
SELECT SUM(id), id
FROM comments;
```
We get an error:
```
column "comments.id" must appear in the GROUP BY clause or be used in an aggregate function
```

We're going to most frequently these aggregation functions by themselves or as part of a larger `GROUP BY` statement. That's why we're talking about `GROUP BY` and Aggregation Functions at the same time.

## Combining Group By and Aggregates

```sql
SELECT user_id
FROM comments
GROUP BY user_id
```

After we ran that query, we took a look at a diagram with groups by `user_id` from 1 ot 5. Now that we've got this grouping down, we can introduce aggregate functions on top of it. If we use an aggregate function while doing group by, it will only be applied to each of these individual little subgroups. For example, if we add `MAX(id)` as a new column, then for group 1, it'd be 7. For group 2, it'd be 6. For group 3, it'd be 4. For group 5, it'd be 3.

So now let's write a query for that:
```sql
SELECT user_id, MAX(id)
FROM comments
GROUP BY user_id
```

## A Gotcha with Count

```sql
SELECT * from photos;
```

It looks like we have 21 photos in total. The last photo doesn't have a `user_id` by the way (because we added it that way with `NULL`.

So let's run this query:
```
SELECT COUNT(user_id) from photos;
```

We got 20. What's going on? Whenever we do a `COUNT()` on a column, `NULL` values are not counted. To get around that, rather than referencing any particular column you can use `*` (star):

```
SELECT user_id, COUNT(*) from photos;
```

### Exercise - Practice for Grouping and Aggregating

Write a query that will print an author's id and the number of books they have authored.

Note: There is an `author` table but all information needed is in the `books` table.

----------------------------------------
|                books                 |
----------------------------------------
| id | title               | author_id |
|----|---------------------|-----------|
| 1  | Chamber of Secrets  | 1         |
| 2  | Prisoner of Azkaban | 1         |
| 3  | The Dark Tower      | 2         |
| 4  | Murder at the Links | 3         |
