## Section 4: Relating Records with Joins

### Adding Some Data

See seeds/section4.sql

### Queries with Joins and Aggregations

When you ran the code in the previous lecture, it created 3 tables: photos, users and this new table comments. Nothing really special about the comments table. It's what you would expect.

__The more tables we have, the more interesting questions we can answer__

* Find all the comments for the photo with ID = 3, along with the username of the comment author
* Find the __average number of comments__ per photo
* Find the photo with the __most comments__ attached to it
* Find the photo with ID = 10 and get the __number of comments__ attached to it
* Find the user with the most activity (most comments + most photos)
* Calculate the __average number of characters__ per comment

We are going to answer these questions with Joins and Aggregations.

Joins
* Produces values by merging together rows from different related tables
* Use a join _most times_ that you're asked to find data involving multiple resources

Aggregation
* Looks at many rows and calculates a single value
* Words like '_most_', '_average_', '_least_' are a sign you need to use an aggregation


You'll notice the first query is mentioning comments and photos and users, because we are mentioning multiple types of resources, that might be a sign of using a join.

### Joining Data From Different Tables

__For each comment, show the contents of the comment and the username of the user who wrote the comment__:

```sql
SELECT contents, username
FROM comments
JOIN users ON user.id = comments.user_id;
```

Let's take a look at the diagram to see what `JOIN` does.

First off, we know we want some information from both comments and users. Again that is a sign that we might want to use a join. Secondly, we are trying to refer to some columns or information in both tables. So we want access to contents in comments and username in users. Because we are trying to access information in 2 different tables, that is a sign that we might want to use a join.

First off, `FROM` operates as normally, as an initial selection of the rows we want to operate on. So we want to operate initially on all the rows on the comments table.

Then, `JOIN users` means somehow take all the rows in comments and match them in rows with users.

Anytime a join happens, you can imagine the database makes a temporary copy of the initial table (comments in this case). And then it changes the table name to "comments with users". It's then going to iterate through all the rows in the copied table and try to match them with rows in the users table using the matching statement with put on the other side of `ON`.

This is our matching statement. This says for every row in the users table, take a look at the `id` column, and match that up with the row from the comments table using the `user_id` column of that table.

### Another Quick Join

__For each comment, list the contents of the comment and the URL of the photo the comment was added to.__

```sql
SELECT contents, url
FROM comments 
JOIN photos ON photos.id = comments.photo_id;
```

### Alternate Forms of Syntax

__Notes on Joins__

* Table order between `FROM` and `JOIN` _frequently_ make a difference
* We must give context if column names collide
* Tables can be renamed using the `AS` keyword
* There are a few kind of joins

Take the join from __Another Quick Join__, joining comments with photos. We are starting off with all the rows in comments and joining with photos. We could start off with all the rows in photos and join with comments. So in some cases, we can flip the order and it won't change the ultimate result. However, there are other scenarios where flipping the order will change the result. Now your initial question probably is, when does it make a difference? I will show you in the next video or two.

Let's say we combined comments with photos together into one table. If we have two columns with the same column name, `id` in this scenario, we have to specify which table we're talking about when we reference `id`, otherwise we'll get an error `column reference "id" is ambiguous`. 

Ambiguous:
```sql
SELECT id
FROM photos
JOIN comments ON photos.id = comments.photo_id;
```

Unambiguous:
```sql
SELECT id
FROM photos
JOIN comments ON photos.id = comments.photo_id;
```

Tables can be renamed:
```sql
SELECT comments.id AS comment_id, p.id as photo_id
FROM photos AS p
JOIN comments ON p.id = comments.photo_id;
```

### Missing Data in Joins

__Show each photo url and the username of the poster__

So if we imagine how we'd do this, we'd look at each row in the photos table, and match it up with the referenced user in the users table.

```sql
SELECT url, username
FROM photos
JOIN users ON users.id = photos.user_id
```

Now you should keep in mind that when we executed this query, every row in the photos table nicely lined up with a user in the users table. Now I'm going to throw a wrench into the works. I am going to insert a new row into the photos table.

```sql
INSERT INTO photos (url, user_id)
VALUES ('https://banner.jpg', NULL);
```

Now I'm going to run the query again. Something interesting has happened. We do not see anything related to the photo we just added. So this query is not listing all photos, but only photos related to a user. Is this a problem? Yes, because again, it doesn't fulfill the original goal of our query.

__Resulting Tables__

-------------------------------------
|              photos               |
-------------------------------------
| id | url                | user_id |
|----|--------------------|---------|
| 1  | http://santiya.net | 2       |
| 2  | http://alayna.net  | 3       |
| 3  | http://kailyn.name | 1       |
| 4  | http://banner.jpg  | NULL    |

--------------------------
|          users         |
--------------------------
| id | username          |
|----|-------------------|
| 1  | Reynah.Marvin     |
| 2  | Micah.Cremin      |
| 3  | Alfredo66         |
| 4  | Gerard_Mitchell42 |
--------------------------

### Why Wasn't It Included

So we can imagine we're creating a new table "photos with users" with columns `id`, `url`, `user_id`, `id`, `username` from both photos and users.

So we add all the rows from the photos first. So now we match with the users in the users table and add those matching rows to the "photos with users" table alongside the added photo rows. But in this case, there is no matching row because `user_id` is `NULL`.

Remember there are several different kinds of joins and the join we are using will drop a row from the new table if there is any row from our source table that does not match up with the target table. So because we could not find a match in the users table for that banner row, we don't see it in the final result.

### Four Kinds of Joins

We're going to walk through four kinds of joins:
* Inner Join
* Left Outer Join
* Right Outer Join
* Full Join

```sql
SELECT url, username
FROM photos
JOIN users ON users.id = photos.user_id
```

Whenever you see the `JOIN` keyword by itself in a query, that is by default an Inner Join. You can also write `INNER JOIN` in the query. As we walked through in the last video, we are going to walk through all rows in photos and match up each with rows with users. In Inner Joins, we only keep rows that match up to a row in the target table and drop rows that don't match.

Now to visualize this, you'll see a Venn Diagram like this. The purple section shows that we only keep rows that have a perfect match between the two tables.

__Left Outer Join__

```sql
SELECT url, username
FROM photos
LEFT JOIN users ON users.id = photos.user_id
```

So the keyword here is `LEFT JOIN` which indicates we are doing a Left Outer Join. Once again, take all rows from photos and do that matching process with users. Finally, we also do not have a match for the banner row. But in a Left Outer Join, we do not throw this row away. Instead if, we can't find a match for that, we backfill a row right here in place of a row from the users table with `NULL` values. If anything from the left photos table does not match up with the users table, we are going to keep it.

Again, we are going to look at this Venn Diagram. We are going to hopefully match some stuff with the users table, but if we don't, that's fine.

__Right Outer Join__

```sql
SELECT url, username
FROM photos
RIGHT JOIN users ON users.id = photos.user_id
```

This is pretty much the exact opposite of a Left Outer Join. Again, we are going to take all the rows from photos and try to match them up with the rows in the users. Any rows in photos that do not match up are dropped, but then we add any unmatched rows from users, and backfill the row in place of a row from photos.

__Full Join__

```sql
SELECT url, username
FROM photos
FULL JOIN users ON users.id = photos.user_id
```

The last one we are going to look at is a Full Join. In a Full Join, give us everything, try to merge as many rows as possible.

Once again, take all our different photo rows and put them down here in "photos with users table". Match them up with users in rows. Now we have this banner row so we set all relevant columns in users with `NULL`. In addition, we're going to include this user with `id` of 4 and set all relevant columns in photos with `NULL`.

### Does Order Matter?

Note: See tables from Resulting Tables.

The only difference between these 2 queries is the order of tables:

```sql
SELECT url, username
FROM photos
LEFT JOIN users ON users.id = photos.user_id
```

```sql
SELECT url, username
FROM users  
LEFT JOIN photos ON users.id = photos.user_id
```

We'll start over here first. We would take all our different photos from the photos table. And then we'd match each row from the users table. And then finally, because the banner row doesn't match up, because it is a left join, we will backfill that row with `NULL`.

Result of Query 1:

-------------------------------------------------------------
|                      photos with users                    |
-------------------------------------------------------------
| id | url                 | user_id | id   | username      |
|----|---------------------|---------|------|---------------|
| 1  | https://santiya.net | 2       | 2    | Micah.Cremin  |
| 2  | https://alayna.net  | 3       | 3    | Alfredo66     |
| 3  | https://kailyn.name | 1       | 1    | Reynah.Marvin |
| 4  | https://banner.jpg  | NULL    | NULL | NULL          |
-------------------------------------------------------------

Result of Query 2:

-----------------------------------------------------------------
|                       users with photos                       |
-----------------------------------------------------------------
| id | username          | id   | url                 | user_id |
|----|-------------------|------|---------------------|---------|
| 1  | Reynah.Marvin     | 3    | https://kailyn.name | 1       |
| 2  | Micah.Cremin      | 1    | https://santiya.net | 2       |
| 3  | Alfredo66         | 2    | https://alayna.net  | 3       |
| 4  | Gerard_Mitchell42 | NULL | NULL                | NULL    |
-----------------------------------------------------------------

When we list out photos first, we ended up with a photo that does not have a corresponding user. When we swap the two and start off with users, we end up with a user that does not have corresponding photo. So yes, the answer is there is a difference whenever we use a RIGHT or LEFT OUTER JOIN. But with an INNER JOIN or a FULL JOIN, in general, it does not make a difference. Now having said that, there are some scenarios in which you would want to massage the order of tables, especially when you are joining multiple (3+) tables.

### Exercise - Joins, Joins, Join!

Write a query that will return the `title` of each book, along with the `name` of the author. All authors should be included, even if they do not have a book associated with them.

------------------------
|        authors       |
------------------------
| id | name            |
|----|-----------------|
| 1  | Stephen King    |
| 2  | Agatha Christie |
| 3  | JK Rowling      |

----------------------------------------
|                 books                |
----------------------------------------
| id | title               | author_id |
|----|---------------------|-----------|
| 1  | The Dark Tower      | 1         |
| 2  | Affair At Styles    | 2         |
| 3  | Murder at the Links | 2         |
----------------------------------------

### Where with Join

We've been talking about joins for a while now, but joins are really important for you to understand. So we've got to talk about joins a little more. We're going to start to take a look on variations on joins that are going to use some other SQL keywords.

__Users can comment on photos that they posted. List the url and contents for every photo/comment where this occurred.__

We are going to answer the question:
__Who is commenting on their own photos?__

So to do that, we can join the `comments` and `photos` table as normal to get a `comments with photos` table. We could then select `contents` and `url` from the `comments with photos` table. But that's not quite what we want. We want the contents and URL where the person who created the comment is also the person who created the photo. So to do this, we could find all the rows where the `user_id`b of the comment is equal to the `user_id` of the photo.

```sql
SELECT url, contents
FROM comments
JOIN photos ON photos.id = comments.photo_id;
```

So for now, let's just run that query to make sure it works and we get valid data. I'd say this looks reasonable. Now we're going to add in a `WHERE` expression to filter the rows.

`WHERE` always go on the other side. I would always expect to see `FROM`, then `JOIN`, then `WHERE`. I wouldn't expect to see `WHERE` before `FROM`.

```sql
SELECT url, contents
FROM comments
JOIN photos ON photos.id = comments.photo_id
WHERE comments.user_id = photos.user_id;
```

So this comparison right here is doing exactly what we saw. We're literally at these two columns. Comparing the value of each of them, and if they're equal inside our ResultSet, keep them, otherwise, drop them.

Now, this is another scenario where you really need to remember that comparisons are being done for every single row in this imaginary `comments with photos` table.

Now, I want to do something more complicated. We are only showing about the photo and comment now. But we don't know _which_ users are posting on their own photos.

### Three-Way Joins

We're going to alter this query so we not only post the URL of the photo, the contents of the comment but the username of the user who posted the comment and created the photo.

So we're going to do a Three-Way Join. Now conceptually this is very very challenging, but the SQL ends up being simple and straightforward. So we need information from `comments`, `photos`, `users`.  

So I have this imaginary table `comments with photos with users`.
First we select all rows in comments. We can just join on photos and as usual match up with the rows in photos. Okay that's how far we've gotten in the past photos. So now we are saying, we now want to merge in this table.

You have to really think about the merge condition in the `ON` statement. If we just match up `user_id` from comments with `id` from users, that will not necessarily give us what we want, the users who posted on their own photos. What we really want to see is when the comments `user_id` is equal to the photos `user_id` and equal to the `id` in the users table.

For the first row, we have `user_id` of 2 for the comment and a `user_id` of 3 for the photo. So there is no user that created both the comment and the photo. So we would imagine we would get `NULL` for `id` and `username`. Now when I say we would get, I just mean logically. I'm not even worrying about SQL or anything like that.

For the second row, we have a `user_id` of 5 for both the comment and the photo, so the `id` would be 5 and the `username` would  be `Frederique_Donally`.


For the first row, we have `user_id` of 3 for the comment and a `user_id` of 2 for the photo. So again, there is no user that created both the comment and the photo. So we also get `NULL` filled in for that row.

Now if we printed the table as-is, we would get some rows that say `NULL` for the username and we don't really want that. We only want the rows that have a user that matches the criteria. So we could do a `WHERE` expression, but alternatively, we could look at the 4 different kinds of joins. An Inner Join is only going to show us the rows where there is a matching value from all tables. So if we did a Three-Way Inner Join, these rows where there's no matching user would get dropped.

```sql
SELECT url, contents, username
FROM comments
JOIN photos ON photos.id = comments.photo_id
JOIN users ON users.id = comments.user_id AND users.id = photos.user_id
```

So the key thing here is we're trying to find users or merge tables where the user's ID is equal to the comment's user ID and the user's ID is equal to the photo's user ID.

Generally, the second `JOIN` is going to have a little bit more complicated merging expression because we need to really think about what rows go with whichever rows.

### Exercise - Three Way Exercise

Write a query that will return the `title` of each book, along with the `name` of the author and the `rating` of a review. Only show rows where the author of the book is the author of the review.

