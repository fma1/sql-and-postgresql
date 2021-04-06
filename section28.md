## Section 28 - Simplifying Queries with Views

### Most Popular Views

We're going to run into an issue or two with a query and look at a more leegant solution to solve it.

__Show the most popular users - the users who were tagged the most__

So we have a `users` table with `id` & `username`, `caption_tags` table with `id` and `user_id`, `photo_tags` table with `id` and `user_id`.

We can do a union on `caption_tags` and `photo_tags` to get a `tags` table.

-----------------
|     users     |
-----------------
| id | username |
|----|----------|
| 1  | Hallie   |
| 2  | Eldon    |
| 3  | Rozella  |
| 4  | Tad      |

----------------
|     tags     |
----------------
| id | user_id |
|----|---------|
| 1  | 1       |
| 2  | 4       |
| 3  | 2       |
| 4  | 1       |
| 1  | 1       |
| 2  | 2       |
| 3  | 2       |
| 4  | 3       |

So we can imagine the join process to be like this.

--------------------------------
|           users_tags         |
--------------------------------
| id | username | id | user_id |
|----|----------|----|---------|
| 1  | Hallie   | 1  | 1       |
| 1  | Hallie   | 4  | 1       |
| 1  | Hallie   | 1  | 1       |
| 2  | Eldon    | 3  | 2       |
| 2  | Eldon    | 2  | 2       |
| 2  | Eldon    | 3  | 2       |

We could then do a `GROUP BY`. We could have groups with Hallie as one group, and Eldon as another group. We could then do a `COUNT(*)` and then a `ORDER BY` to get the popular users.

```sql
SELECT username, COUNT(*)
FROM users
JOIN (
  SELECT user_id FROM photo_tags
  UNION ALL
  SELECT user_id FROM caption_tags
) AS tags ON tags.user_id = users.id;
GROUP BY username
ORDER BY COUNT(*) DESC
```

We went through this rather quickly because the query itself is not that interesting. Looks like  I've got Bonita96 on top with 21 likes and Emilio.Mohr with 17.

What is the awkward part? We've had to take a union of a `photo_tags` and `caption_tags` tables. We've had to union these two tables again and again and again and we've haven't found a scenario where we'd merge these two tables. So maybe there's some better way to do this. How can we fix this mistake here, when we have 2 tables when we should've made 1?

### A Possible Solution for Merging Tables

* We've had to find the union several times
* There's been no benefits to keeping these records in separatble tables
* Guess we have a bad design!
* Two possibilities to fix it up

The obvious solution is to merge the two tables and delete the originals.

__Solution #1: Merge the two tables, delete the original__

Create single `tags` table:
```sql
CREATE TABLE photo_tags (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
);
```

Copy all the rows from `photo_tags`:
```sql
INSERT INTO tags(created_at, updated_at, user_id, post_id, x, y)
SELECT created_at, updated_at, user_id, post_id, x, y
FROM photo_tags
```

Copy all the rows from `caption_tags`:
```sql
INSERT INTO tags(created_at, updated_at, user_id, post_id)
SELECT created_at, updated_at, user_id, post_id
FROM photo_tags
```

Two big issues:
* We can't copy over the IDs of all the different `photo_tags` and `caption_tags`since they must be unique
* If we delete the original tables, we break existing queries that refer to them!

### Creating a View

__Solution #2: Create a View__
* Create a fake table that has rows from other tables
* These can be exact rows as they exist on another table, or a computed value
* Can reference the view in any place where we'd normally reference a table
* Views doesn't actually create a new table or move any data around
* Doesn't have to be used for a union! Can compute absolutely any values

Views are very similiar in nature to a Common Table Expression but CTEs can only be referenced in the attached query. Views are created ahead of time and can be referenced any time afterwards.

```sql
CREATE VIEW tags AS (
  SELECT id, created_at, user_id, post_id, 'photo_tag' AS type FROM photo_tags
  UNION ALL
  SELECT id, created_at, user_id, post_id, 'caption_tag' AS type FROM caption_tags
);
```

The only reason for the `AS type` is to differentiate between a row meant to represent a `photo_tag` versus a row meant to represent a `caption_tag`.

```sql
SELECT * 
FROM tags;

SELECT * 
FROM tags
WHERE type = 'caption_tag';
```

So we can fix our original query:
```sql
SELECT username, COUNT(*)
FROM users
JOIN tags ON tags.user_id = users.id;
GROUP BY username
ORDER BY COUNT(*) DESC
```


### When to Use a View?

The 10 most recent posts are really important.
* Show the users who created the 10 most recent posts
* Show the users who were tagged in the 10 most recent posts
* Show the average number of hashtags used in the 10 most recent posts
* Show the number of likes each of the 10 most recent posts received
* Show the hashtags used by the 10 most recent posts
* Show the total number of comments the 10 most recent posts received

```sql
CREATE VIEW recent_posts AS (
  SELECT *
  FROM posts
  ORDER BY created_at DESC
  LIMIT 10
);
```

We can then do
```sql
SELECT * FROM recent_posts;
```

By the way, in our dataset, we can have dates from 2010 to 2019. And we have posts from 2019, so this looks correct.

Now we've got this view put together, we can execute these 6 different queries without writing the same logic over and over again.

If we wanted to show the users who made the 10 most recent posts we could do a join on `recent_posts`.

```sql
SELECT username
FROM recent_posts
JOIN users ON users.id = recent_posts.user_id;
```

### Deleting and Changing Views

Let's take a look at changing the defition of a view and deleting a view.

```sql
CREATE OR REPLACE VIEW recent_posts AS (
  SELECT *
  FROM posts
  ORDER BY created_at DESC
  LIMIT 15
);

SELECT * FROM recent_posts;
```

So this will update the view.

To delete the view, we can do:
```sql
DROP VIEW recent_posts;
```

If you want to see all views inside your db, open your DB inside pgAdmin and go to Schema, and click on the arrow next to Views.
