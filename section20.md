## Section 20 - Implementing Database Design Patterns

### Back to Psotgres

* Create a new db using PGAdmin
* Convert our design to a series of CREATE TABlE statements
* Insert data into the database
* Write some queries
* Realize a few different things could have been designed better! Make some changes

I'll create a new database called `instagram`. Remember whenever you open up a query tool, you're working on a very specific database. If you have query tool windows open, I recommend you close them by clicking the X button(s). Now let's open the query tool for the instagram database.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  username VARCHAR(30) NOT NULL,
  bio VARCHAR(400),
  avatar VARCHAR(200),
  phone VARCHAR(25),
  email VARCHAR(40),
  password VARCHAR(50),
  status VARCHAR(15),
  CHECK(COALESCE(phone, email) IS NOT NULL)
);
```

As a refresher, `NOT NULL` means we must provide a value for the column, and `DEFAULT` specifies a value if we don't specify it. Also, `COALESCE` returns the first value that is not `NULL` in a list. So we're checking to see that either phone or email is not `NULL`.

### Posts Creation

```
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  url VARCHAR(200) NOT NULL,
  caption VARCHAR(240),
  lat REAL CHECK(lat IS NULL OR (lat >= -90 AND lat <= 90)),
  lng REAL CHECK(lng IS NULL OR (lng >= -180 AND lng <= 180)),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

The goal of a post on instagram is to show a photo to other users, so 100% of the time it should have this url column, so we're going to mark it as `NOT NUlL`. 

In the real world, A note is -90 < lat < 90 and -100 < lng < 100.

### Comments Creation

```
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  contents VARCHAR(240),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);
```

`ON DELETE CASCADE` means when the referenced row is deleted, delete this row that references it as well.

```
CREATE TABLE likes (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
	comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
	CHECK(
		COALESCE((post_id)::BOOLEAN::INTEGER, 0)
		+
		COALESCE((comment_id)::BOOLEAN::INTEGER, 0)
		= 1
	),
	UNIQUE(user_id, post_id, comment_id)
);
```

If you remember, we used a special `CHECK` to make sure one of two columns were provided. If you try to turn `NULL` into a `BOOLEAN` and an `INTEGER`, you still get `NULL`. `COALESCE`  just returns the first value that is not `NULL` or `NULL` if all are `NULL`. So if both are `NULL` we'll get 0 and the check won't pass. If both `post_id` and `comment_id` are provided, then we'll get 2 and the check won't pass. Only providing one will cause the check to pass.

Finally, we want the combination of `user_id`, `post_id` and `comment_id` are unique so a user can only like a post or comment once.

### Photo Tags and Caption Tags


```sql
CREATE TABLE photo_tags (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  x INTEGER NOT NULL,
  y INTEGER NOT NULL,
  UNIQUE(user_id, post_id)
);

CREATE TABLE caption_tags (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE(user_id, post_id)
);
```

### Creating Hashtags, Hashtag Posts and Followers

```sql
CREATE TABLE hashtags (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  title VARCHAR(20) NOT NULL UNIQUE
);
```

```sql
CREATE TABLE hashtags_posts (
  id SERIAL PRIMARY KEY,
  hashtag_id INTEGER NOT NULL REFERENCES hashtags(id) ON DELETE CASCADE,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE
);
```

```sql
CREATE TABLE followers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  leader_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(leader_id, follower_id)
);
```

