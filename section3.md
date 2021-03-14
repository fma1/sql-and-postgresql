## Working With Tables

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
