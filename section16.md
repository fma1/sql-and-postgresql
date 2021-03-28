## Section 16 - How to Build a 'Like' System

### Requirements of a Like System

![Instagram DB Diagram](images/instagram_dbdiagram.png)

So we've recreated our schema in the last video. We're going to take a look at some different screenshots. Think about columns and relationships to support these features. And then build into our PostgreSQL database and seed it.

So here's the first feature. We want to include some sort of like feature. Look up some given post, and tap on some kind of like button well I like the post. Now adding in a like system is something that a lot of different applications have. Lot of applications have the idea of liking some sort of resource. So even though we are talking about liking posts here, everything we're going to be discussing can be taken directly to any kind of app where you want to implement a Like System.

__Rules of 'Likes'__
* Each user can like a specific post a single time (a user shouldn't be able to like a post twice)
* A user should be able to unlike a post
* Need to be able figure out how many users like a post
* Need to be able to list which users like a post
* Something besides a post might need to be liked (comments, maybe?)
* We might want to think about 'dislikes' or other kinds of reactions

So in this screenshots 725k likes. We wouldn't want to show a list of 725k people, but we might want to show top ten most popular people who like a given post. Not just retrieve number of likes, but retrieve some details about people who like a post.

Posts can be liked, but comments can be liked as well. Keep that in mind. Want to be able to unlike a post. Might also want to put reaction system like Facebook(Love, Sad, Excited, etc.) aka different kind of likes.

### How to Not Design a Like System

I'm going to show you not so great way of designing a like system because it is an approach a lot of beginners try to use.

We would not want to add a column of likes to our posts table.

__Don't do this!__
* No way to make sure a user likes a post only once
* No way to make sure a user can only 'unlike' they have liked
* No way to figure out which users like a particular post
* No way to remove a like if a user gets deleted

### Designing a Like System 

Now that we've seen a bad solution, let's take a look at a better system. We're going to add a third table `likes` to our database. It will have an `id`, a `user_id` and a `post_id`. It should have a unique constraint with `UNIQUE(user_id, post_id)`.

So it's very to figure out which user liked a post and what posts are liked by different users. The unique constraint guarantees a user can only like a post. Remember this unique constraint with two columns means we want to make sure that the combination of `user_id` and `post_id` are unique, Like if you were to concatenate `user_id` + `_` + `post_id`, is that unique?

Let's say that Jannie doesn't like the post with `id` 5 anymore. To make sure of that, we'd find the relevant row in the `likes` table and remove that row.

We can start to write out interesting queries to find out important information.

Number of likes on post with id = 3:
```sql
SELECT COUNT(*)
FROM likes
WHERE post_id = 3
```

Id's of top five most liked posts
```sql
SELECT posts.id
FROM posts
JOIN likes ON likes.post_id = posts.id
GROUP BY posts.id
ORDER BY COUNT(*) DESC
LIMIT 5
```

You can tell this pattern is pretty flexible. It works well but there is a downside, or 2 downsides. We don't have the ability a different kind of like or a reaction. This user is excited or is sad for this post. Might try to do a bit more work here for that. The other thing is the ability for a comment to be liked. It's really just for liking a post and doesn't really add the ability to like a comment.

### Making a Reaction System Instead

The ability to be happy, sad or excited about a post.

So what we could do is change `likes` table to `reactions` table. Then we could add a `type` column with "like", "love", "care", "funny", etc. The set of reaction types we have is very limited. If that's the case, Postgres has a special type to make sure only these certain keys are entered into the column. It's called an enum and we'll discuss it later in the course.

### Polymorphic associations

* A like can be a 'post like' or a 'comment like'
* Referred to as a '__polymorphic association__'
* Requires your app to figure out the meaning of each like
* Can't use foreign key columns, `liked_id` is a plaint integer
* Not recommmended, but you'll still see it in use

We're going to look at adjusting our system to allow liking both posts and comments. There are three possible solutions to this. Might sound overkill for 3 solutions but it's an important or interesting problem in the world of SQL.

The first solution is creating a polymorphic associations. They are not recommended but it's important to know them because they'll still used in quite a few number of applications.

We still have posts, comments and likes. However, our likes table has changed. Rather than having a `post_id` column, it has a `likes_id` column. It also has a `liked_type` column which is either `post` or `comment`. So each row of the likes table, but is a like for a post or comment, based on the value of the `liked_type` column. Seems like a reasonable solution. Why is this such a bad idea?

It comes down to this `liked_id` column. Remember that to form associations between different tables, we had to create something called foreign key columns. And just every time `user_id` or something, we are always talking about a foreign key column. They're treated a little differently by Postgres. Postgres is going to take a look at the value at the `user_id` column, and makes sure there is an actually a `user_id` of that value in the `users` table. Automatically do that sort of validation. And set up this foreign key relationship when we first set up the table. And we really like/enjoy using FK columns in general because they allow us to have some sort of data consistency. So we want to use foreign key columns.

How does that relate? We can not created `liked_id` as a foreign key column. When we create this table and we tell Postgres this is going to be a foreign key column, we don't know whether it's going to be one on the posts table or the comments table. We only know later on when we insert a row in the table. This column is only us for the developers. So when we make use of this polymorphic association, we do not treat this as a Foreign Key Column, and we lose data consistency. We could insert a row with `liked_id` of `99999` and that comments row wouldn't exist. 

You'll still see this in a lot of applications, typically Ruby on Rails projects.

### Polymorphic Associations Alternative Implementation

So this solution is going to be a bit more straightforward. But our likes table is going to have a `post_id` and a `comment_id` column. So we do have some sort of data consistency with foreign key columns. We are going to have either a `post_id` or a `comment_id`, but not both. And both can't be `NULL`.

```
Add CHECK of
(
  COALESCE((post_id)::BOOLEAN::INTEGER. 0)
  +
  COALESCE((comment_id)::BOOLEAN::INTEGER. 0)
)
```

```sql
SELECT COALESCE(NULL, 5);
```

All `COALESCE()` does is return the first value that is not `NULL`.


```sql
SELECT COALESCE((4)::BOOLEAN::INTEGER. 0)
```

So I'm going to convert 4 into a boolean and then an integer, so we get 1. That means we supplied a valid ID there.

```sql
SELECT (NULL)::BOOLEAN::INTEGER
```

That returns `NULL`. So if we provide this to the first argument `COALESCE()`, it won't return the value of this expression. The entire goal of the check with `COALESCE()` is to give us either a value a 1 or 0. We then take those 2 values and add them together and check to make sure that sum is equal to 1.

### The Simplest Alternative

* Each type of like gets its own table
* Still want to write queries to count up all likes? You can use a Union or a View for that

Very very straightforward. So this time we're just going to create a `posts_likes` table and a `comments_likes` table. First table refers to likes for a post. And second table refers to likes for a comment. Nothing magic. And again, we have foreign key columns for data consistency. And that's pretty much it.

The downside of this solution is if we want a user to be able to like many different things we would end up having to create many different tables.

An upside is that we can have different variations on constraints for each different type of like. For example, we might want to allow reaction likes for posts and comments can only be liked, this would be a very good solution, because we would isolate all that reaction logic.

Another downside is if you want to aggregate all likes, it's a little bit harder but using a Union and we could also create something a View. We haven't covered Views yet, but I'll get to that in this Instagram app.

Okay, so that's 3 possible solutions. I apologize, but trust me, this entire idea of allowing a user to have a relation that is very similar in nature to many different kinds of resources is something that actually comes up very very frequently. So frequently in fact, we'll see two other kinds of resources in this very application that are going to follow this scenario. And we need to figure out how to model that relationship in the middle.

### So which approach? 

Which are we going to use? We're going to go with Solution #2 where a like had a `post_id` or a `comment_id`.

Why are we not using Solution #3? Well we're just saying a user likes either a post or a comment. There's no _other information associated with a like_, so the extra tables are not needed. Later in this application we are going to use Solution #3 because each relationship is going to have some extra information we want to store with it.

So now we're going to create the likes table in our schema:

![Instagram DB Diagram 2](images/instagram_dbdiagram2.png)


![Instagram DB Diagram 3](images/instagram_dbdiagram3.png)
