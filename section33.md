## Section 33 - Accessing PostgreSQL from APIs

### Section Goal

In this section we're going to take a lot of what we've learned. Build out a very small API. And we're going to connect to the socialnetwork database with a `users` table. Then we're going to add tests. Connect to a DB from a real application. Interface with a DB.

### One Fast Migration

I'm going to delete our `socialnetwork` database in pgAdmin and then create a new `socialnetwork` database.

Now we're going to run `npm run migrate up` in the `social-repo` directory:
```bash
DATABASE_URL=postgres://postgres:root@localhost:5432/socialnetwork npm run migrate up
```

### Building the Users Router

![Node API 1](images/nodeapi1.png)

### Understanding Connection Pools

Using a module called `pg`. Just set up a connection to Postgres and run some SQL. That's it. No query building or validation. Just runs SQL. Very popular in Node community. `node-pg-migrat` internally uses `pg`. The ORM we'll use later on also uses `pg`.

A pool wraps up different clients. A pool does not make any contact with Postgres. Only when a client is created is a connection made to Postgres. We need to tell the pool to create a client and connect to Postgres. The way to do this is to write a query. Make simple very basic query.
