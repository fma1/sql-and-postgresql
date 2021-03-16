## Section 3: Working With Tables

Note: Quizzes are not committed here.

## One-to-Many and Many-to-One relationships

A user on Instagram owns many photos. We refer to this as a One-to-Many relationship because one user has many photos that are tied to that used. You might also say this user "has many" photos, which is a sign of a 1:M relationship

If we look at this relationship from the perspective of the photo, we might say that many different photos belong to one user. A single photo has one user. We refer to this as a Many-to-One relationship.

1:M and M:1 are just different sides of the same relationship.

## One-to-One and Many-to-Many Relationships

```
Boats<->Captain
Company<->CEO
```

These are all examples of one-to-one relationships. There is exactly one record that has a relationship with another record, and the opposite is true as well.

The first example we might consider is boats related to captains. A boat only has one captain at any time. Also one captain is the captain of a boat at any given time. A company only has one CEO at any given time. Now there are companies that have many different CEOs, but for the purposes of discussion, let's just assume that a company has one CEO.

```
Students<->Classes
Projects<->Engineers
```

The other relationship we will consider is Many-to-Many. Students at a school probably go to a variety of different classes over the span of a day, or a week. So we would say a class has many students, and a student has many classes. About tasks and engineers. If you think about a task at a software engineering company, there might be many engineers assigned to one project. And at the same time, a single engineer might be assigned to multiple different tasks.

### Primary Keys and Foreign Keys

photos table:
```
----------------------------------
| id | url             | user_id |
|----|-----------------|---------|
| 1  | http://img1.jpg | 4       |
| 2  | http://img2.jpg | 4       |
| 3  | http://img3.jpg | 1       |
| 4  | http://img4.jpg | 2       |
----------------------------------
```

users table:
```
-------------------------------------------
| id | username  | email                  |
|----|-----------|------------------------|
| 1  | monahan93 | emery.becker@yahoo.com |
| 2  | pfeffer   | lesly88@yahoo.com      |
| 3  | 99stroman | blaze68@hotmail.com    |
| 4  | sim3onis  | nedra1@yahoo.com       |
-------------------------------------------
```

Every single table we're going to create is going to have a primary key. Up until now, we have not created any tables with a primary key. Moving forward, all tables we create will have a primary key. The goal of a primary key is to IDentify an individual row inside of a table. Every value in that column is going to be some sort of unique value in that column. So in the photo table, the first column has an ID of 1. There will never be any other row that has an ID of 1. So if go into this table and ask for the row with an ID of 1, I will always 100% get that row back.

Now, to set up a relationship between two different records, we're going to use something called a foreign key. The goal of a foreign key is to relate the one record in one table to another record in another table. So we are going to give our photos table a foreign key column and call it `user_id`. And inside of it we're going to store the ID of the photo that the user belongs to. So we're going to say the first and second rows of the users table are somehow related to a user with ID 4 in the users table.

Remember, primary and foreign keys are very similar in nature and it just comes down to the perspective that we're looking at.

### Understanding Foreign Keys

When we talk about a 1:M, M:1, M:M or a 1:1, we are always somehow going to involve a foreign key column.

So let's talk about a database photo app, which has a table of users, photos, comments and likes.

Comments have one photo. So the comments table should have a foreign key column __pointing at the photo in the photos table__ each comment belongs to.

Comments have one user. So the comments table should have a foreign key column __pointing at the user in the users table__ each comment belongs to.

From the opposite perspectives, we would say that a photo has many comments and that a user has many comments.

So to decided __who__ (which table) gets the foreign key column, we're going to say that the many side of the relationship gets the foreign key column. So for photos and comments, it is a 1:M relationship. The comments is the many side, so the comments table is going to get a foreign key column. Likewise, with users and comments, there is a 1:M relationship so it is the comments side that is going to have a foreign key column.

__Primary Keys__

* Each row in every table has one primary key
* No other row in the _same_ table can have the same value
* 99% of the time called 'id'
* Either an integer or a UUID
* Will never change

__Foreign Keys__

* Rows only have this if they _belong_ to another record
* Many rows in the same table can have the same foreign key
* Name varies, usually called something like 'xyz_id'
* Exactly equal to the primary key of the referenced row
* Will change if the relationship changes

## Auto-Generated IDs

Let's write some SQL to generate a relationship between two tables.

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50)
);
```

The `SERIAL` data type tells Postgres we want to generate the values in this column automatically. The `SERIAL` keyword in particular whenever we start to insert entries into users we aren't going to provide an ID and we are only going to provide a username. As we insert additional users, the ID will be incremented by 1 for us.

After SERIAL, we are going to mark this as `PRIMARY KEY`. This adds some performance benefits to looking up records in the `users` table when looking up by ID.

```sql
INSERT INTO users (username)
VALUES
  ('monahan93'),
  ('pferrer'),
  ('si93onis'),
  ('99stroman');

SELECT * FROM users;
```

### Creating Foreign Key Columns

```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(200)
  user_id INTEGER REFERENCES users(id)
);
```

So let's walk through this. `user_id` is an integer that is going to reference some row inside the `users` table. And the row we're trying to reference is going to match up to the `id` column.

So what does it mean to mark a column as a foreign key? It enforces some level of data consistency, although that probably doesn't make a lot of sense right now.


```
INSERT INTO photos (url, user_id)
VALUES
  ('http://one.jpg', 4);

SELECT * FROM photos;
```

# Running Queries on Associated Data

```sql
INSERT INTO photos (url, user_id)
VALUES
  ('http://two.jpg', 1)
  ('http://25.jpg', 1)
  ('http://36.jpg', 1)
  ('http://754.jpg', 2)
  ('http://35.jpg', 3)
  ('http://256.jpg', 4)
```

Find all photos created by user with ID 4:
```sql
SELECT * FROM photos WHERE user_id = 4;
```

List all photos with details about the associated user for each:
```sql
SELECT * FROM photos
JOIN users ON users.id = photos.user_id
```

### Exercise - Creating and Using Foreign Keys

You are building a database for a naval shipping company. You need to store a list of boats and the crew members who work on each, so you create a table called `boats` and a table called `crew_members`. From the perspective of a boat, this is a One-to-Many (1:M) relationship.

To complete this design you need to do two things:

1. Add a column to the `crew_members` table definition that will relate `crew_members` to `boats`. You should call this foreign key column `boat_id`.
2. Write a query that will fetch all columns for all `crew_members` associated with the boat that has an ID of 1.

```sql
-- Create table called 'boats'
CREATE TABLE boats (
    -- Note that this environment doesn't support 'SERIAL' keyword
    -- so 'AUTOINCREMENT' is used instead. Postgres always uses 'SERIAL'
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR
);


-- Insert two boats 
INSERT INTO boats (name)
VALUES ('Rogue Wave'), ('Harbor Master');


-- Create table called 'crew_members'
CREATE TABLE crew_members (
    -- Note that this environment doenst support 'SERIAL' keyword
    -- so 'AUTOINCREMENT' is used instead. Postgres always uses 'SERIAL'
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name VARCHAR,
    -- >>>>>>>> TODO #1 HERE!!!
    
);

-- Insert three crew members
INSERT INTO crew_members (first_name, boat_id)
VALUES ('Alex', 1), ('Lucia', 1), ('Ari', 2);


-- Write query here to fetch all columns for all crew_members associated with the boat that has an ID of 1
-- >>>>>>>> TODO #2 HERE!!!
```

### Foreign Key Constraints Around Insertion

In this video we will be talking about data consistency. In other words, it refers to the ability of our database to make sure that the information we are inserting into it makes sense and data lines up in some way.

For example, take 3 scenarios:
1. We insert a photo that is tied to a user that exists.
2. We insert a photo that refers to a user that doesn't exist.
3. We insert a photo that isn't tied to any user.

For scenario #2, it would be this SQL:
```sql
INSERT INTO photos (url, user_id)
VALUES ('http://jpg', 999);
```

Result:
```
insert or update on table "photos" violates foreign key constraint "photos_users_id_fkey"
```

It says we are trying to insert some record into the photos table but it is going to violate the foreign key constraint. This foreign key constraint means that Postgres wants to make sure that whenever we set up this foreign key, it tries to reference a record that actually exists inside of the users table.


For scenario #3, it would be this SQL:
```sql
INSERT INTO photos (url, user_id)
VALUES ('http://jpg', NULL);
```

`NULL` is special in Postgres. There's no value there. Nothing.

Result:
```
INSERT successful
```

So for the 3 scenarios, these are the results:
1. Everything works OK!
2. An error!
3. Put in a value of 'NULL' for `user_id`

### Constraints Around Deletion

What happens when we try to delete some records that involve a foreign key?

A question. What happens if we delete the user with ID of 1? We would have some dangling references. These rows in photos are now trying to reference a user that does not exist. Remember, no ID ever gets reused so there will never be a new user with ID of 1. So in this scenario, we would need to add some code in our application to detect that we have some photos that aren't referencing any user that exists in the database. So when we use foreign keys, we can specify some options for exactly what we want to happen for what we want to happen whenever we try to delete a record that some other rows are dependent upon.

There are 5 different options.

1. `ON DELETE RESTRICT` -> Throw an error
2. `ON DELETE NO ACTION` -> Throw an error
3. `ON DELETE CASCADE` -> Delete the photo too!
4. `ON DELETE SET NULL` -> Set the `user_id` of photo to `NULL`
5. `ON DELETE SET DEFAULT` -> Set the `user_id` to a default value, if one is provided

### Commands needed for next video to avoid copy-pasting

```sql
CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR(200),
  user_id INTEGER REFERENCES users(id)
);
 
INSERT INTO photos (url, user_id)
VALUES
  ('http:/one.jpg', 4),
  ('http:/two.jpg', 1),
  ('http:/25.jpg', 1),
  ('http:/36.jpg', 1),
  ('http:/754.jpg', 2),
  ('http:/35.jpg', 3),
  ('http:/256.jpg', 4);
```

### Testing Deletion Constraints

To add one of the constraints, just add it to the `user_id` field when creating the photos table:
`user_id INTEGER REFERENCES user(id) ON DELETE CASCADE`.

### Setting Foreign Keys to Null on Delete

`user_id INTEGER REFERENCES user(id) ON DELETE NULL`.

### Adding Some Complexity

At this point, we've taken a look at how to set up a database for a photo sharing app, but we've only got users and photos right now. We've seen some simple queries, and we've also had a look at maintaining data consistency by using those deletion constraints. So now we're going to add more complexity. I want to add this table called comments here, which is going to definitely have a relationship with users and photos.

* We've seen how to set up relationships between tables
* We've seen some _simple_ queries
* We've seen how to clean up these relationships.

__Now__:
* Let's add in a `comments` table then figure out how to write a few super common queries

photos table:
```
--------------------------
|         photos         |
--------------------------
| id      | SERIAL       |
| url     | VARCHAR(200) |
| user_id | INTEGER      |
--------------------------
```

users table:
```
--------------------------
|          users         |
--------------------------
| id       | SERIAL      |
| username | VARCHAR(40) |
--------------------------
```

comments table:
```
---------------------------
|        comments         |
---------------------------
| id       | SERIAL       |
| photo_id | INTEGER      |
| user_id  | INTEGER      |
| content  | VARCHAR(240) |
---------------------------
```
