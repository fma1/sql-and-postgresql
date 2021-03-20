### Solution - Group By Review

```sql
SELECT paid, COUNT(*)
FROM orders
GROUP BY paid;
```

### Solution - Inner Join Review

``sql
SELECT first_name, last_name, paid
FROM users
JOIN orders
ON users.id = orders.user_id;
```
