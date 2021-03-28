## Section 15 - Database Structure Design Patterns

### Approaching More Complicated Designs

__Moving Forward__
* We've seen lots of little examples for various topics
* Going forward, we need a more complicated schema to make use of some more advanced features
* Let's build out a more serious version of an Instagram schema!

__Working With Many Tables__
* Challenging to keep the structures/names of different tables in your head
* Nice to document your db structure somehow
* We can use _schema designer_ to help guide our design

__SQL Schema Designers__
* dbdiagram.io
* drawsql.app
* sqldbm.com
* quickdatabasediagramms.com
* ondras.zarovi.cz/sql/demo

### A Config-Based Schema Designer

https://dbdiagram.io

So we're going to erase all the configuration in the initial example. And we're going to enter all this config.

```
Table users {
  id SERIAL [pk, increment]
  username VARCHAR(30)
}

Table comments {
  id SERIAL [pk, increment]
  comments VARCHAR  
  user_id INTEGER [ref: > users.id]
  post_id INTEGER [ref: > posts.id]
}

Table photos {
  id SERIAL [pk, increment]
  title varchar
}
```

### Rebuilding the Schema

We're going to recreate the same schema we had previously.

First, designating a table of users, a table of posts, and a table of comments as well. So this time we're going to call it posts, because Instagram calls a photo a post.

Then, I'm going to add `id` to each. `id SERIAL [pk, increment]`.

Then, I'm going to add a `created_at` and an `updated_at`. When a user first joined the application, or when a post was made, or how many minutes days ago a comment was created. That's why we want these two columns.

Next up, for users, going to give the user a username and make that `VARCHAR(30)`. For posts, I'm going to add an url with `VARCHAR(200)`. In general we do not store raw photo data inside our database, but some storage medium somewhere else designed for that like Amazon S3 and we'll provide a link to it inside our DB. And finally on comments, I want all comments to have some content associated with them.

Last thing to do to put foreign key columns. We're going to say a user has many comments and a post has many comments as well. That means we want 2 foreign key columns on comments. We want them to point at the id of the post and the id of user.

One other foreign key column. A post is created by a very specific user. Set up a foreign key column on posts referring to users.

```
Table users {
  id SERIAL [pk, increment]
  created_at TIMESTAMP
  updated_at TIMESTAMP
  username VARCHAR(30)
}

Table posts {
  id SERIAL [pk, increment]
  created_at TIMESTAMP
  updated_at TIMESTAMP
  url VARCHAR(200)
  user_id INTEGER [ref: > users.id]
}

Table comments {
  id SERIAL [pk, increment]
  created_at TIMESTAMP
  updated_at TIMESTAMP
  comments VARCHAR(240)  
  user_id INTEGER [ref: > users.id]
  post_id INTEGER [ref: > posts.id]
}
```
