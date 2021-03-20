### Solution - Practice for Grouping and Aggregating

```sql
SELECT author_id, COUNT(*)
FROM books
GROUP BY author_id;
```
### Solution - Grouping with a Join!

```sql
SELECT name, COUNT(*)
FROM authors
JOIN books ON authors.id = books.author_id
GROUP BY name;
```
### Solution - Practice Yourself Some Having

```sql
SELECT manufacturer,
SUM(price * units_sold)
FROM phones
GROUP BY manufacturer
HAVING SUM(price * units_sold) > 2000000;
```
