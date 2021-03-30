## Section 19 - How to Design a 'Follower' System

### Designing a Follower System

You can think of a Leader and a Follower. We can only follow one user one time and we can not follow ourselves. So modeling this is straightforward.

So we'd make a table of `followers` with `id`, `user_id` and `follower_id` with `CHECK (user_id <> follower_id)` or `UNIQUE(leader_id, follower_id)`.

![Instagram DB Diagram 6](images/instagram_dbdiagram6.png)
