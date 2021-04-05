## Section 26 - Simple Common Table Expressions

### Common Table Expressions

Make a query a little bit easy to read.

__Show the username of users who were tagged in a caption or a photo before January 7th, 2010. Also show the date they were tagged.__

So we need `users`, `caption_tags` and `photo_tags`. So we could solve this easily using `UNION`. We would union `caption_tags` and `photo_tags`, then join that with `users` and select the username and date where the date is less than July 7th, 2010.

```sql
SELECT users.username, tags.created_at
FROM users
JOIN (
  SELECT user_id, created_at FROM caption_tags
  UNION ALL
  SELECT user_id, created_at FROM photo_tags
) AS tags ON tags.user_id = users.id
WHERE tags.created_at < '01-07-2010';
```

Note that when you join two tables they have to have thes same columns. One caveat is we don't need the `users` part of `users.username`, but we do need `tags` part of `tags.created_at` because `users` also has `created_at`.

So that looks pretty good.

We've got this big subquery. If you were to take a glance at this query, it would be hard to understand what's going. Rewrite it and make it more evident to other engineers what's going on.

### So What's a CTE?

```sql
WITH tags AS (
  SELECT user_id, created_at FROM caption_tags
  UNION ALL
  SELECT user_id, created_at FROM photo_tags
)
SELECT users.username, tags.created_at
FROM users
JOIN tags ON tags.user_id = users.id
WHERE tags.created_at < '01-07-2010';
```

So we haven't really changed much but extracted the subquery out.

__Common Table Expression (CTE)__
* Defined with a 'with' before the main query
* Produces a table that we can refer to anywhere else
* __Two forms!__
* Simple form used to make a query easier to understand
* Recursive form used to write queries that are otherwise impossible to write with plain SQL itself

You can use `EXPLAIN` to understand we're not modifying the original query in any way.

