## Section 13 - PostgreSQL Complex Data Types

### What'd We Just do?

Notes on PGAdmin:

* Tool to manage and inspect a Postgres database
* Can connect to local or remote databases
* Can view/change just about _anything_ in PG

Postgres Server:

* We are running a Postgres Server locally
* A PG Server can contain multiple databases
* All data for a single app lives in a single DB
* having multiple DB's is more about working with more than one app on your machine

### Data Types

We're going to dive into the internals of Postgres. This first topic is going to be a bit dry.

This topic is data types.

```
CREATE TABE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50),
  department VARCHAR(50),
  price INTEGER,
  weight INTEGER
);
```

__Data Type Categories__

* Numbers
* Currency
* Binary
* Date/Time
* Character
* JSON
* Geometric
* Range
* Arrays
* Boolean
* XML
* UUID

__Numeric types__

Numbers without any decimal points:
* smallint -> -32768 to 32768
* integer -> -214583648 to 2174463647
* bigint -> -9223372036854775908 to +9223372036854775807

No decimal point, auto increment:
* smallserial -> 1 to 32767
* serial -> 1 to 2147483647
* bigserial -> 1 to 9223372036854775807

Numbers with decimal points:
* decimal -> 131072 digits before decimal point, 16383 after
* numeric -> 131072 digits before decimal point, 16383 after
* real -> 1E-37 to 1E37 with at least 6 places precision
* double precision -> 1E-307 to 1E308 with at least 15 place precision
* float -> Same as real or double precision

### Fast Rules about Numeric Data Types

What word am I going to use when creating a table?

1. `id` column of any table -> Mark the column as __serial__
2. Need to store a number without a decimal -> Mark the column as __integer__
3. Bank balance, grams of gold, scientific calculations -> Need to store a number __with a decimal and this data needs to be very accurate__ -> Mark the column as numeric
4. Kilograms of trash in a landfill, liters of water in a lake, air pressure in a tire -> Need to store a number __with a decimal and the decimal doesn't make a big difference__ -> Mark the column as double precision.

### More on Number Types

Now, we could understand these data types by creating a new table inside of Postgres database, and adding a few columns, and for every column, make it a different data type, insert rows of data in it, and see how Postgres treats the data.

That takes a ton of time though. So here's what  we're going to do. We're going to right-click on Postgres in PGAdmin and click "Query Tool". This is going a little editor. We can type in some SQL here and execute it by clicking the play button at the top. 

Now at this point, we've seen a lot of SQL that select rows of data from a table. But it turns out we can do arbitrary calculations like `SELECT 2 + 2;`. If I do `SELECT (2)` it says the type is integer. If I type `SELECT(2.0)` Postgres thinks it's numeric. If I do `SELECT (2.0::INTEGER);` then Postgres treats it as an integer.

Let's take a look at these other types.

Serial is when you're using `id`s. Nothing really more about them. I want to talk about the ones with decimal points.

You'll notice if you do this calculation with reals, you get `1.001358e-05`. So Postgres thinks `1.99999 - 1.99998 = .00001001358`. But why? In the world of Postgres, real, double precision and float are done with floating point math. Floating point calculations are notoriously known for being inaccurate. So whenever we are trying to store some value we don't care too much about, like # of liters of trash, we can make use of real, double precision, and float.

Decimal and numeric are essentially the same type by the way. You'll notice if we do the same substraction with decimal or numeric, we get the correct answer back of `.00001`. So if you need something to be perfectly accurate you would want to use decimal or numeric, even though you would take a performance hit.

```sql
SELECT (2.0::SMALLINT);
SELECT (99999::SMALLINT);
SELECT (99999999999999::INTEGER);
SELECT (1.99999::REAL - 1.99998::REAL);
SELECT (1.99999::DECIMAL - 1.99998::DECIMAL);
SELECT (1.99999::NUMERIC - 1.99998::NUMERIC);
```

A little bit boring but this is necessary to understand.

__Reminder on Character Types__

* CHAR(5) -> Store some characters, length will always be 5 even if PG has to insert spaces
* VARCHAR -> Store any length of string
* VARCHAR(40) -> Store a string up to 40 characters and automatically remove extra characters
* TEXT -> Store any length of string

If we enter a string longer than the length given to CHAR, our string is truncated. Same thing with VARCHAR. TEXT is pretty much similar to VARCHAR. No performance different between different character types. Just does some validation for you on length of string.

```
SELECT ('asfjd'::CHAR(3));
SELECT ('dsfijosidfjosijfisjd'::VARCHAR(5));
SELECT ('dsfijosidfjosijfisjd'::VARCHAR);
SELECT ('dsfijosidfjosijfisjd'::TEXT);
```

### Boolean Data Types

* true, yes, on 1, t, y -> TRUE
* false, no, off, 0, f, n -> FALSE
* null -> NULL

If I put in true, y, or 1, I get true. You get the idea. If I put in no, f or n, I get false. You get the idea. Why is this? Some languages have used the precedent of storing a 0 or 1 instead of true or false.

```sql
SELECT ('true'::BOOLEAN);
SELECT ('y'::BOOLEAN);
SELECT ('1'::BOOLEAN);
SELECT ('no'::BOOLEAN);
SELECT ('f'::BOOLEAN);
SELECT ('n'::BOOLEAN);
```

### Times, Dates, and Timestamps

__DATE__
* 1980-11-20 -> 20 November 1980
* Nov-20-1980 -> 20 November 1980
* 20-Nov-1980 -> 20 November 1980
* 1980-November-20 -> 20 November 1980
* November 20, 1980 -> 20 November 1980

If I run this, Postgres will recognize the elements of `NOV-20-1980` and turn it into a date for us. Postgres will take any format you can imagine for DATE.

```sql
SELECT ('NOV-20-1980'::DATE);
SELECT ('NOV 20 1980'::DATE);
SELECT ('NOV 20, 1980'::DATE);
SELECT ('1980 NOV 20'::DATE);
SELECT ('1980 November 20'::DATE);
```

__TIME__
* 01:23 AM -> 01:23, no time zone
* 05:23 PM -> 17:23, no time zone
* 20:34 -> 20:34, no time zone

Postgres will convert any format you can imagine for TIME in a 24 hour format. You'll notice the type of all of these is "time without time zone".

```sql
SELECT ('01:23 AM'::TIME);
SELECT ('01:23'::TIME);
SELECT ('01:23 PM'::TIME);
```

__TIME WITH TIME ZONE__
* 01:23 AM EST -> 01:23-05:00
* 05:23 PM PST -> 17:23-08:00
* 05:23 PM UTC -> 17:23+08:00

We also have times with timezone. 

```sql
SELECT ('01:23:23 AM EST'::TIME WITH TIME ZONE);
SELECT ('01:23:23 AM PST'::TIME WITH TIME ZONE);
SELECT ('01:23:23 AM UTC'::TIME WITH TIME ZONE);
```

__TIMESTAMP WITH TIME ZONE__

* Nov-20-1980 05:23 PM PST -> 1980-11-20 18:23:00-07

So if we enter this query, it's automatically converted and the UTC offset of -07 is added as well. By the way, we can do calculations with timestamps.

```sql
SELECT ('NOV-20-1980 01:23 AM PST'::TIMESTAMP WITH TIME ZONE);
```

### Rreally Awesome Intervals

* 1 day -> 1 day
* 1 D -> 1 day
* 1 D 1 M 1 S -> 1 day 1 minute 1 second

_Think of an interval as a duration of time._

Why is this useful? Okay, so we can store some kind of duration or something like that. Well let's just play around with interval for a bit and see.

```sql
SELECT ('1 day'::INTERVAL);
SELECT ('1 D'::INTERVAL);
SELECT ('1 D 20 H'::INTERVAL);
SELECT ('1 D 20 H 30 M 45 S'::INTERVAL);
```

Well, all this discussion around data types is generally in the world of applying a data type to a column. I'll show you why you want interval at all. Well, it turns out we can do numeric operations on intervals.

```sql
SELECT ('1 D 20 H 30 M 45 S'::INTERVAL) - ('1 D'::INTERVAL);
```

Now we're just left with `20:30:45`. And we can do sbustraction and addition of intervals and be left with useful information. We can make use of intervals to add or subtract time to dates.

```sql
SELECT 
  ('NOV-20-1980 01:23 AM EST'::TIMESTAMP WITH TIME ZONE)
  -
  ('4 D'::INTERVAL);
```

```sql
SELECT 
  ('NOV-20-1980 01:23 AM EST'::TIMESTAMP WITH TIME ZONE)
  -
  ('NOV-20-1980 05:23 AM PST'::TIMESTAMP WITH TIME ZONE)
```

So being able to subtract dates at the database level rather than using a Java or Javascript library, is really useful. Intervals, storing inside a table, maybe not most useful thing in the world. But making use of them to do some sort of calculation, absolutely fantastic.
