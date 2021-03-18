### Solution - Joins, Joins, Joins

```sql
SELECT title, name
FROM authors
LEFT JOIN books ON authors.id = books.author_id;
```

```sql
SELECT title, name
FROM books 
RIGHT JOIN authors ON authors.id = books.author_id;
```

### Solution - Three Way Exercise

```sql
SELECT title, name, rating
FROM books
JOIN reviews ON books.id = reviews.book_id
JOIN authors ON authors.id = books.author_id AND authors.id = reviews.reviewer_id;
```
