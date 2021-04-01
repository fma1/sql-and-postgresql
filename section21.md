## Section 21 - Approaching and Writing Complex Queries

### Adding Some Data

We're going to throw a ton of data into the database. We're going to take all the data out of that backup file. We'll find our instagram database, right-click and click on `Restore`. Now click on the the 3 dot button where it says Filename and browse to `ig.sql`. Make sure to change format to `sql` rather than `backup` in the file dialog.

We're going to go to `Restore Options` and change 4 settings:
* Only data -> Yes
* Owner -> Yes
* Single Transaction -> Yes
* Trigger -> Yes

Now let's do a simple `SELECT COUNT(*)` for users and likes. So we have 5345 users and 752,009 likes.

There's a lot of data inside our database. It's going to be very clear very quickl that we're going to have to learn a little more about performance aspects of Postgres to have queries run in a short amount of time.

### Restoring from Scratch

We're going to change the structure of our database. You only watch this video if you make a bad change to the database and revert the state of the database. If you accidentally deleted a column or whatever else.

So you may not need to watch this right now but it will come in handy in the future.

1. First, close all open Query Tool windows.
2. Click on instagram database on the left-hand side, then click on Dashboard next to Properties and SQL.
3. Scroll down to the very bottom and see only 1 entry under Sessions under Server Activity. If you see any other rows other than `pgAdmin 4`, click the X button to the right on them.
4. Then right-click on instagram and click Delete/Drop.
5. Okay, now right-click on Databases. Go to Create Database, and type in `instagram`.
6. Now right-click on Instagram and click Restore. And we're going to do the same thing we did before we selecting the `ig.sql` file.
7. However, this time the Restore Options are different. This time we're going to Enable `Do Not Save Owner`, `Queries Single Transaction` and `Disable Trigger`. Make sure nothing inside of `Type of Objects` is enabled.
8. Now click on the Restore button.
9. Wait a few seconds to up a few minutes until it says Successfully completed.


### Exercise - Highest User IDs Exercise

We're going to start to take looking at the advanced features of Postgres, like performance and whatnot. I want to get more familiar with the dataset.

First exercise is __Select the three users with the highest IDs from the users table__.

The hint is you could flip order of the table and limit select to 3 rows. 

### Exercise - Posts by a Particular User

__Join the users and posts table. Show the username of user ID 200 and the captions of all posts they have created.__

### Exercise - Likes Per User

__Show each username and the number of 'likes' that they have created.__
