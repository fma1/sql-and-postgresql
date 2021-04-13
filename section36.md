## Section 36 - Fast Parallel Testing

### Isolation with Schemas

So the problem is we have tests running in parallel that are conflicting with each other.

__Option #1__

Each file gets its own database, `socialnetworking-a`, `socialnetworking-b`, `socialnetworking-c`. The downside is you would need to create a new database for each new test file.

__Option #2__

Each file gets its own schema.

A schema is very similar to a folder on your hard drive. 

* Schema are like folders to organize things in a database
* Every database gets a default schema called 'public'
* Each schema can have its own separate copy of a table

### Creating and Accessing Schemas

So let's open up a query tool for socialnetwork-test.

```sql
CREATE SCHEMA test;
```

```sql
CREATE TABLE test.users (
  id SERIAL PRIMARY KEY,
  username VARCHAR
)
```

```sql
INSERT INTO test.users (username)
VALUES
  ('alex'),
  ('asdf');

```

```sql
SELECT * FROM test.users;
```

### Controlling Schema Access With Search Paths

Right now we have Schema "public" and Schema "test".

What happens when you run `SELECT * FROM users;`? You have a `users` table in both so Postgres has to make a decision and what Schema to access.

Postgres uses an internal setting called `search_path`.

```sql
SHOW search_path;
```

You'll notice it says `"$user",public`. Let's ignore `$user` for moment. That means if we ever run some kind of statement, then Postgres is going to default to finding it inside the `public` schema. What `$user` mean? Whenever you connect to Postgres, you connect to it with a user. It's `postgres` on Windows and whatever user you are on Mac OS X. So my user is `sg` on OS X. That means Postgres should prefer a schema called `sg` even before `public`.

Let's update our search path.

```sql
SET search_path TO test, public;
```

```sql
SELECT * FROM users;
```

So it now prioritizes the `test` schema. Let's revert it back.

```sql
SET search_path TO "$user", public;
```

### Strategy for Isolation

For Each Test File
* Connect to PG as normal
* Generate a random string of chars like "asdf"
* Create a new user (role) with that name
* Create a new schema with that name
* Tell our test file to connect to the DB with that name
