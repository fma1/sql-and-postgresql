### Solution - Highest User IDs Exercise

```sql
SELECT * from users
ORDER BY id DESC
LIMIT 3;
```

### Solution - Posts by a Particular User

```sql
SELECT username, caption
FROM users
JOIN posts ON users.id = posts.user_id
WHERE users.id = 200;
```

### Solution - Likes Per User

```sql
SELECT username, COUNT(*)
FROM users
JOIN likes ON users.id = likes.user_id
GROUP BY username;
```
