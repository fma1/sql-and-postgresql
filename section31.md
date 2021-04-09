## Section 31 - Managing Database Design with Schema Migrations

### A Story on Migrations

Schema Migrations is a very important topic. Making very careful and well-planned changes to the structure of your database. Adding tables, removing tables, etc. Really important when working with other engineers.

* We're going to walk through a really busy day that you might have working at Instagram
* We'll identify some huge issues that come up when you start changing the structure of your DB
* These are issues that I can almost promise you will run into at some point

__Part I__

![Postgres on Local Machine and AWS](images/comments_table_dev_prod.png)

You are an engineer at Instagram. You are in charge of managing the `comments` table. You are working with 2 separate copies of Postgres. There are 2 copies of this database. You can test changes on your local machine, and once they're working you then make those changes to the production DB on AWS.

So your actual user database lives inside of the AWS database.

Let's imagine. You show up to work and you get feedback. You hear from other developers that the column name of `contents` is bad. It's hard to remmember whether it's singular or plural.

__Solution - Rename the column!__

It's a very single and easy process. You'd just run
```sql
ALTER TABLE comments
RENAME COLUMN contents TO body;
```

Very inexpensive, fast operation inside of Postgres. So you've seen it works on your local database.

So now you open up pgAdmin and connect to production database in AWS. Lo and behold, __About .001 seconds after making this change, sirens start going off in your office!__

![Request to API Server to Instagram DB](images/request_to_api_server_to_db.png)

Let's think about the structure of your application. Request coming into an API server. Go to some API server. Extract some comment text from text itself and send off to database. You renamed that column to `body` but you never made any changes to the API server itself. So whenever the API statements builds up some statements it might still be referring to that `contents` column. So you're trying to run some invalid SQL statement.

__Big Lesson #1__:
Changes to the DB structure and changes to clients need to be made at precisely the same time

In other words, if we change `contents` -> `body`, at the same time, all of our different clients are told they need to run new code that will refer to a `body` column.

![Updating DB + Clients Timeline](images/updating_db_clients_timeline.png)

We've got 3 columns. One for the DB, one for change to API, and one for existing running API. In theory, what you want to do make rename change as you begin to deploy new version of API code that refers to `body` instead of `contents`. 

Now even if you try to make these changes at the same time, you might run into trouble. Deploy might take several seconds to minutes. Window of time where you're still in process of deploying API. 

So the instant that the rename of the column is complete, the existing running API would start throwing errors every time the user tried to insert a new comment because there is no `contents` column anymore. It's only after the new API is deployed would the error go away. 

Anytime you see a company sends you an email that says "We're going to be down from 2-3am on Wednesday morning." or anytime you hear some big company on planned or scheduled downtime, changes to the DB structure is frequently what they're doing.

One way to address this whole situation is just to say "Hey, we're going to take down our entire application. We're going to stop the API running. We're going to make some changes and deploy a new version of our API code, and Ta-dah everything is working as expected."

Howeer, there are many scenarios where you need to make changes to the database and you just plain can't take the application down. You might be working for a company with a SLA (Service-Level Agreement), and in a SLA, you might be required to keep your application up for a vast, vast majority of the year.

So we're going to take a look at a few techniques where a change to the database is not going to cause any errors to occur.

Assuming the DB and API Deploy would happen at the same time and the DB and API Deploy are handled by different teams, it would assume these two different teams of engineers are working together and coordinating on this very important operation.

__Part II__

* Your manager is furious that you broke the app! 
* Moving forward, you are responsible for the comments table ___and___ related changes to the API accessing the DB
* ___Plus___, all of your changes need to be reviewed by another engineer
* Your manager tells you to change `contents` to `body` again using these new procedures

So you make changes to the API Server and Instagram DB and test them locally and confirm they work. You post a Code Review Pull Request on Github for the API.

You made the change to the comments table with handwritten SQL directly in PGADmin. There's nothing in this review request about the SQL that changed _comments_!


So on your machine, you have the `body` column and the API code. Your boss checks out the code, and tests out the API code. Whenever they try to insert a new comment they would get an error there is no `body` column. So your boss would post a comment on the review stating that they got an error.

You might say "Oh. Please run this SQL in PGAdmin." Your boss says okay it looks good and your code review is complete. 

All done with the review, your boss goes back to running the current latest version of the codebase (that doesn't have your changes!). They are once again in a conflicted state. But they've got a version of the database that has a `body` column. Chances are, your boss would come back and say "You just broke everything on my computer. I'm not even running your code anymore. I can't create any comments."

__Big Lesson #2__
When working with other engineers, we need a _really_ easy way to tie the structure of our database to our code

### Migration Files

So at this point, we've made all changes inside of pgAdmin. Moving forward, we're going to use Schema Migration File.

A __Schema Migration File__ is Code that describes a precise change to make to the database.

You can author a Migration File with Javascript, Python, etc.

A 

                               

-------------------------------------------------------------------------
|                            Migration File                             |
-------------------------------------------------------------------------
| Up                               | Down                               |
|----------------------------------|------------------------------------|
| ALTER TABLE comments<br />RENAME COLUMN comments TO body; | ALTER TABLE comments<br />RENAME COLUMN body TO comments; |

* __Up__ contains a statement that advances/upgrades the structure of the DB
* __Down__ contains a statement that __exactly undos__ the 'up' command

So the Up and Down commands of a Migration File allow you to apply a certain migration but also revert that certain migration.

The nice thing about migration files is you might write out a migration file for creating a `comments` table. You might write a 2nd migration file for renaming `contents` to `body`. You can take a bunch of migration files and hand them off to a brand-new engineer at your company and they can just run them.

### Issues Solved By Migrations

So we had two big lessons:
* Changes to the DB structure and changes to clients need to be made at precisely the same time
* When working with other engineers, we need a _really_ easy way to tie the structure of our database to our code

Let's see how migrations solve these issues.

Whenever we do a deployment, we might start to deploy our code. Process takes several mnutes.

Problem #1;

As soon as new version of code is ready to start receiving traffic, we can run all available migrations with a script and then the DB structure is update. So then we'd start we'd receiving traffic and it'd shrink the window of time that we'd get errors because of the DB and API code not being in a sync.

Problem #2;

In every code review request, we can pair it along with a migration file that describes the exact changes to DB structure. So the other engineer applies the migration gets the correct structure of the DB, then evaluates the code and completes the review. And then they revert the migration and that would take them back to the current real structure of the DB. 

---

Now this doesn't solve all issues, but it solves these two big issues.

### A Few Notes on Migration Libraries

You can write Schema migrations in any language

Javascript:
* node-pg-migrate
* typeorm
* sequelize
* db-migrate

Java
* flywaydb

Python
* alemba

Go
* golang-migrate
* go-pg

So we're going to be using Javascript to write a Schema migration. So we're going to be using node-pg-migrate.

Many migration tools can __automatically generate migrations for you__. I highly highly recommend you write all migrations manually using plain SQL.

### Project Creation

```
mkdir ig
cd ig
npm init -y
npm install node-pg-migrate pg
```

We're going to generate a new database called `socialnetwork`. We're then going to write out 2 migrations for it. Trying to create a new table called `comments`. Second migration rename column `contents` to `body`. Not directly working with data.

### Generating and Writing Migrations

In pgAdmin, we'll create the `socialnetwork` database.

We're going to open up package.json:
```
"scripts": {
  "migrate": "node-pg-migrate"
},
```

Now we're going to run
`npm run migrate create table comments`

Now we're going to edit the created file in the migrations directory.

### Applying and Reverting Migrations

__`DATABASE_URL` Environment Variable__
* `postgres://` `USERNAME` `:` `PASSWORD` `@localhost:5432/socialnetwork`

__MacOS with Postgress.app__
* username = your username (type `whoami` in terminal)
* password = none

__Windows__
* username = postgres
* password = the password you set this whole time you installed PG

In Git Bash:
`DATABASE_URL=postgres://postgres:PASSWORD@localhost:5342/socialnetwork npm run migrate up`

So if we go to pgAdmin, we see that the `comments` table is there. And we see there is a `pgmigrations` table where node-pg-migrate keeps track of migrations. If we run the migration again, we would get an error due to that table.

If we wanted to revert the changes we can run this:
`DATABASE_URL=postgres://postgres:PASSWORD@localhost:5342/socialnetwork npm run migrate down`

Now if we go to pgAdmin again, the table is gone.

### Generationg a Second Migration

So to create a second migration, let's do this:
`npm run migrate create rename contents to body`

Now we'll open the new generated file in our editor. We'll fill out the up first and down afterwards.

Now we can run the migration script up and down and check pgAdmin.

We are talking about changing the structure of database. We haven't talked about changing data as well. We might change the data type of a column. That's definitely an open point to think about.

I also want to think about how to use this to have 0% downtime. 
