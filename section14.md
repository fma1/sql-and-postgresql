## Section 14 - Database-Side Validation and Constraints

### Thinking About Validation

In this section, we are going to start thinking about doing validation around a database. Explaining 2 possible situation around products table.

I want you to imagine that our company has some administrator user that is in charge of adding new products. Let's say they are using a web interface to add some product. You would take the form submission and give to a web server and the web server would create that row in the products table somehow.

New Product:
```
Product = 'Shirt'
Department = 'Tools'
Price = -35
```

That's all good and well, but let's take a closer look at our new product. We have a negative price, and it doesn't have a weight. So if we tried to enter a price of -35, that's almost implying we're going to pay anyone who's purchasing our product. So we probably need to implement some validation at the web server level. So the web server might do some validation on the price and weight. And it might send an error "Sorry, but this must have a positive price and a department." So this happens everyday whenever you use a web application. 

Now I want you to think about an alternative scenario. We don't have any web developers. So what could we do? They might directly connect to the database using something like pgAdmin. They might connect directly to the DB. What would happen if they try to add an invalid product to the products table? Right now we don't have any validation whatsoever. All we said, as long as you submit values that conform to these types, we'll take whatever you have. So we'll look at how we'll add validation. And talk about where to add validation (webserver vs DB level).

### Creating and Viewing Tables in PGAdmin


__Row-Level Validation__
* Is a given value defined?
* Is value unique in its column?
* Is a value >, <, >=, <=, = some other value?

So let's try to create the products table and inserting products into it.

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40),
  department VARCHAR(40),
  price INTEGER,
  weight INTEGER
);

INSERT INTO products (name, department, price, weight)
VALUES
  ('Shirt', 'Clothes', 20, 1);
```

### Applying a Null Constraint


Let's try inserting this:

```sql
INSERT INTO products (name, department, weight)
VALUES
  ('Pants', 'Clothes', 1);
```

So we `null` for the price for the new row. Is that bad? Maybe. That might mean they could purchase for $0. So we could add some validation. So how would we do that?

We can set up a `NULL` constraint so a value must be provided for a column. We can add a `NOT NULL` rule on a particular column or after the table was created.

__When Creating The Table:__
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40),
  department VARCHAR(40),
  price INTEGER,
  weight INTEGER
);
```

__After The Table Was Created:__
```
ALTER TABLE products
ALTER COLUMN price 
SET NOT NULL;
```
_Gotcha!_

So let's try running the 2nd statement since I don't want to lose all the data we entered. We get this:
```
ERROR: column "price" contains null values
SQL state: 23502
```

So we can't put a constraint on the price column because `null` values already exist in the table. Sometimes you're going to want to edit a column, the data already is going to violate those rules. So there are two options. We can either try to find all rows with `null` price and delete them. Alternatively, we can find all rows with a price of `null` and update them to another price (or manually update them each one by one to a specific price).

### Solving a Gotcha with Null Constraints

We'll write in a little bit of SQL to do our update. You might be tempted to do `WHERE price = NULL` but it's `WHERE price IS NULL`. The reason is a comparison between `null` value and any other value will result in a `null`, which is `false` for the purposes of a where clause. The reason is `null` means "unknown", so the result of any comparison to `null` is also "unknown".

```sql
UPDATE products
SET price = 9999
WHERE price IS NULL;
````

So now that our price column has no `null` values inside of it, we can now apply our Null Constraint with the `ALTER TABLE` statement. So let's try to insert a new row.

```sql
INSERT INTO products (name, department, weight)
VALUES
  ('Shoes', 'Clothes', 5);
```

So we get an error (and it's an error that we want):
```
ERROR: null value in column "price" violates not-null constraint
DETAIL: Failing row contains (3, Shoes, Clothes, null, 5).
SQL state: 23502
```

In general, many different columns will be marked as `NOT NULL`, because we want validation like this. Unless your app has a very specific reason to say "yeah, we don't need this value". We'd always want a name for our product, and we'd always want a department too. In some cases, we might just not know the weight of a product. So there might be some scenario where you want to allow `null` values.

### Default Column Vaulues

__When Creating The Table:__
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  department VARCHAR(40) NOT NULL,
  price INTEGER DEFAULT 999,
  weight INTEGER
);
```

__After The Table Was Created:__
```
ALTER TABLE products
ALTER COLUMN price 
SET DEFAULT 999;
```

### Applying a Unique Constraint to One Column

We want to make sure how to make sure a value within a column is unique

So I'm going to insert a row with an identical name:
```
INSERT INTO products (name, department, price, weight)
VALUES
  ('Shirt', 'Tools', 24, 1);
```

Let's say the company says "Hey new rule. No products with same name."

So the name column should only have these inside of it.

__When Creating The Table:__
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) UNIQUE,
  department VARCHAR(40) NOT NULL,
  price INTEGER DEFAULT 999,
  weight INTEGER
);
```

__After The Table Was Created:__
```
ALTER TABLE products
ADD UNIQUE (name);
```
_Gotcha!_

Notice for the 2nd statement the column name has to be in a set of parentheses. There is a very good reason for this which I will get to. Just like Null Contraints, there is a gotcha here. You can't apply this constraint until all rows in the table satisfy the constraint. Right now we have two 'Shirt' products.

A couple of different options here. Temporarily rename this value for the duplicate to say 'Shirt2'. Try to run a query delete all duplicate names.

Let's say we want to manually modify the name to 'RedShirt'. So we can double-click on the cell and change the name. After that, we have to click on the grid-like button to save the changes. So if we refresh the table again after that by clicking the play button, we will see that the change was saved.

So now we can apply this unique constraint with the `ALTER TABLE` statement. And if we try to insert a duplicate, we get an error.

### Multi-Column Uniqueness

__When Creating The Table:__
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40),
  department VARCHAR(40),
  price INTEGER,
  weight INTEGER,
  UNIQUE (name, department)
);
```

__After The Table Was Created:__
```
ALTER TABLE products
ADD UNIQUE (name, department);
```


To drop the previous constraint, we can run this
```sql
ALTER TABLE products
DROP CONSTAINT products_name_key
```

This is just a little variation on uniqueness, if you want multiple columns together to be unique.

### Adding a Validation Check

Whenever we insert or update a row, we can check whether a value is greater than, less than or equal to some value.

```sql
INSERT INTO products (name, department, price, weight)
VALUES
  ('Belt', 'Clothes', -99, 1);
```

So we probably want some validation for the price to be greater than 0. Once again there are two places we can do this.

__When Creating The Table:__
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  department VARCHAR(40) NOT NUlL,
  price INTEGER CHECK (price > 0),
  weight INTEGER
);
```

__After The Table Was Created:__
```
ALTER TABLE products
ADD CHECK (price > 0);
```
_Gotcha!_

Like Null Constraints, we can not add a check if all rows within our existing table do not satisfy the check. One thing is a check can only work on the row we are trying to insert or update. So we can't treat this like a subquery and say `ADD CHECK (SELECT MAX(price) FROM products > 0)`. 

### Checks Over Multiple Columns

We are going to work on the `orders` table now, which is going to have a slightly different structure. It's going to have the columns `id`, `name`, `created_at`, `est_delivery`.

We want to make sure an order is delivered after it is ordered. So the delivered date should be greater than the ordered date.

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(40) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  est_delivery TIMESTAMP NOT NULL,
  CHECK (create_at < est_delivery)
);
```

These are timestamps but remember from a previous lecture we can do comparisons on timestamps.

Now I'm going to insert into orders.

```sql
INSERT INTO orders (name, created_at, est_delivery)
VALUES ('Shirt', '2000-NOV-20 01:00AM', '2000-NOV-25 01:00 AM')
```

And that works because our created time is less than our estimated time. Let's try to do the opposite.

```sql
INSERT INTO orders (name, created_at, est_delivery)
VALUES ('Shirt', '2000-NOV-20 01:00AM', '2000-NOV-10 01:00 AM')
```

And we get an error. __As a reminder, we can only use columns inside of the row we are trying to insert.__

### So Where Are We Applying Validation?

Where should we focus adding validation? Web Server? Database? The answer we can spread validation across both.

Web Server Validation
* Easier to express more complex validation
* Far easier to apply new validation rules
* Many libraries to handle validation automatically

Database Validation
* Validation still applied even if you connect with a different client
* Guaranteed that validation is always applied
* Can only apply new validations if all existing rows satisfy it

In general, it's much more easier to apply new validation rules on the Web Server. You just make a change to Web Server code, commit, deploy, and that's it, it's live. Adding new validation rules to our DB is more tricky. We haven't discussed much about making changes to a DB in production, but trust me when I say we tend to be a lot more patient and a little bit more careful when making changes to a DB, specifically rules around our DB.

However, there are benefits to adding validation to DBs. Whether it's pgAdmin or whatever client, it means someone can't connect to the DB and add a negative price. Doesn't matter the source. Similarly related, guaranteed validation is always applied. It may seem like a bad thing, but we always had to make sure existing data satisfied the constraint we were trying to add. It's actually a good thing. We are guaranteed data passes that validation when we add a constraint. With the web server alone, we might have some data that's half-valid and half-invalid.

So we're best spreading our validation between the Web Server and the Database. Personally, I put the bulk of my validation at the Web Server level and some very critical validation at the Database level. Allowing a user to signup and want a certain username length and they happen to have a username of 2 characters? Not as big of a deal, can be done on the Web Server. Make sure products are always added with a price > 0, very very important to uphold that rule. 
