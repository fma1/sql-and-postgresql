## Section 18 - Designing a Hashtag System

### Designing a Hashtag System

In this video, we're going to start thinking about modeling hashtags inside of our database. They can be placed in many different places. Hashtags inside of a comment, hashtags inside a caption, hashtags used inside of a user biography.

So we can see there is some tie between hashtag and a post, a hashtag and a comment, and a hashtag and a user's biography. You might immediately think we need to relate hashtags with posts, hashtag with users and hashtags with comments. So we might have a `hashtags_users` table, a `hashtag_comments` table and a `hashtag_users` tables. We could also try to combine this down to one table if we wanted to try a different strategy.

I want to give you one quick reminder. We saw tags used inside of a post. And we kind of came up with an idea. We realized _just because_ something you can click on inside this caption doesn't mean we have to model it inside the database. We only have to model things that we eventually expect to query. In the case of tags inside of caption, we decided it was an important thing to model because we want to query users inside of tags, and users should get notifications for tags.

So we have to ask ourselves the exact same question.

We only have to model resources in the DB if we expect to query for them at some point! -> Do we expect to run a query to see what posts/comments/users contain a given hashtag?

If the answer is no, we don't have to create these tables.

So I tried to figure out with our Instgram application where hashtags are actually used. So I found they were only used inside of the search feature. I was searching for `#happy`. If you click on any of them, it shows you a hashtag page, and it shows you posts that make use of that hashtag.

That's a really important distinction. On this page, only one kind of resource. Posts. Not seeing any comments and not seeing a list of users that use this hashtag. The implication is that we can search for posts with hashtags, that hashtags in posts are modeled inside the database.

So right now it doesn't stand that we need to store the hashtags in comments or hashtags in user biographies in the database. So we only need the `hashtags_posts` table.

### Tables for Hashtags

__1st way of modeling:__

Table of `hashtags` and column of `post_id`. You might have the same hashtag used in several different posts. Could do a simple query to find which posts using which hashtag. This design would __definitely work__.

But for performance reasons, frequently you'll see a different solution.

---------------------------
|        hashtags         |
---------------------------
| id | title    | post_id |
|----|----------|---------|
| 1  | birthday | 3       |
| 2  | summer   | 5       |
| 3  | snow     | 2       |
| 4  | fun      | 5       |
| 5  | fun      | 4       |
| 6  | fun      | 3       |


-----------------------------
|           posts           |
-----------------------------
| id | url        | user_id |
|----|------------|---------|
| 1  | lkasjd.jpg | 5       |
| 2  | lkasjd.jpg | 3       |
| 3  | lkasjd.jpg | 5       |
| 4  | lkasjd.jpg | 4       |
| 5  | lkasjd.jpg | 1       |

__2nd way of modeling:__

On the hashtag table, the hashtags are going to be unique. I'm not showing certain columns inside the post for clarity. And we would have a middle table `hashtag_posts`, which is referred to a __join table__. And the only purpose of this table is to model the relationship between `hashtags` and `posts`, to relate a hashtag and a post together.

So it might seem like we're just adding in an extra table arbitrarily. The reason I said is for performance concerns. You'll notice in the first design, we had a lot of words being duplicated many times. That might be a little bit kind of a space concern. Each time we start to duplicate strings, that might be kind of a space concern. It turns out that if we use the 2nd design, we only have list out each string just one time, and we can store a very simple integer instead to point back to the appropriate string. Again you'll see this kind of system for performance reasons. And we'll go into those performance reasons later on in the course.

---------------------------
|        hashtags         |
---------------------------
| id | title    | post_id |
|----|----------|---------|
| 1  | birthday | 3       |
| 2  | summer   | 5       |
| 3  | snow     | 2       |
| 4  | fun      | 5       |

-----------------------------
|       hashtags_posts      |
-----------------------------
| id | hashtag_id | post_id |
|----|------------|---------|
| 1  | 3          | 3       |
| 2  | 1          | 1       |
| 3  | 4          | 4       |
| 4  | 3          | 3       |
| 5  | 3          | 5       |

-----------------------------
|           posts           |
-----------------------------
| id | url        | user_id |
|----|------------|---------|
| 1  | lkasjd.jpg | 5       |
| 2  | lkasjd.jpg | 3       |
| 3  | lkasjd.jpg | 5       |
| 4  | lkasjd.jpg | 4       |
| 5  | lkasjd.jpg | 1       |

### Including the Hashtag Table

![Instagram DB Diagram 5](images/instagram_dbdiagram5.png)

Keep in mind we want to make each hashtag title unique, so we'd use a unique constraint when adding it to Postgres.

### A Few More User Columns

Quick revisit of our users table. One or two columns I want to add in very quickly.

We want to add a biography to our user. We've also got a profile image, so we should store some kind of string that points to the string. And then we have a phone number. We could store that as a number, but we don't expect to do numeric calculation with that so we'd store it as a string. We'd also want an email. And then maybe we'd want to allow some password, and we'd allow very secure, long passwords. We also want a status column. Status is which users are online, which are logged off, which are busy, etc.

```
Table users {
  id SERIAL [pk, increment]
  created_at TIMESTAMP
  updated_at TIMESTAMP
  username VARCHAR(30)
  caption VARCHAR(240)
  lat REAL
  lng REAL
  bio VARCHAR(400)
  avatar VARCHAR(200)
  photo VARCHAR(25)
  email VARCHAR(40)
  password VARCHAR(50)
  status VARCHAR(15)
}
```

### Why No Number of Followers or Posts?

We're discussing why we're not storing number of posts, number of followers, number of following on users table. Think back to when we tried to add a `likes` column to posts. We needed to make sure every like was unique. In addition, a user needed to be able to like a post. But here, posts, followers and following are tied to one user. We could increment/decrement a count when a user creates or deletes a post. Because there's not a uniqueness check, we could store this all as just numbers in the `users` table. But it's very similar here.

So we have a `users` table, a `posts` table and a `followers` table (not yet but imagine we do).

We can just generate these numbers from simple queries:

```sql
SELECT COUNT(*)
FROM posts
WHERE user_id = 123;
```

```sql
SELECT COUNT(*)
FROM followers 
WHERE user_id = 123;
```

So with that in mind, any time you are trying to compute a value, you do not want to store some kind of calculated value.

Can be calculated by running a query on data that already existsi n our DB -> We call this 'derived data' and _We generally don't want to store derived data_


In general, we don't want to store derived data unless there is a good performance reason to do so. But the SQL is very simple and straightforward so we don't want to store this data.
