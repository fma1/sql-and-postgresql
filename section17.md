## Section 17 - How to Build a 'Mention' System

### Additional Features Around Posts

We're notice through screenshots, there are more features we need to add.

When they are looking at this post, they are seeing the user who created the post, see the photo itself, no problem. We see number of likes, no problem. We've then got a lot of text here. It's a caption. So we need to store a caption of a post in our DB. Then comments tied to a post, no problem. How many hours passed from post was created, no problem.

So it seems like our database represents the post very well, other than the caption.

So let's say we want to create a post.

To create a post, you need a button to create a post. So I'm trying to create a post showing Tom Cruise. So we are trying to upload some photo. And store URL in our table. And next is caption tied to our post. Now two little selections afterwards, add location and tag people. Add Location is tying a physical location to the post. A longitude and a latitude to the post. Not too bad. Can just add two columns.

Tagging people requires a little more explanation. When we tag a person, essentially mention a specific Instagram user on a specific portion of the image. So when we tag a person, we're essentially linking a person to a photo, and a specific plot within that photo. We need to precisely locate each tag on the photo. Not only relate to some other Instagram user, but very specific part of photo.

3 big items:
* Post has caption
* Post has longitude + latitude (Later find all posts in geolocation in world)
* Some idea of tagging people and relating them to a very specific post

### Adding Captions and Locations

In this video, we're going to very quickly add in the notion of a caption tied into a post, and location tied into a post. Now we're going to make latitude and longtitude `REAL`, which will round off at 6 decimal places, but for our purposes, that's okay.

![Instagram DB Diagram 3](images/instagram_dbdiagram3.png)

### Photo Mentions vs Caption Mentions

So this is an idea I had to represent mentions in the database. We're going to have a table that has 2 foreign keys. The user that was mentioned, and the post they were tagged in. A post can mention different users. The one little problem is a tag doesn't represent where in the photo the tag was added.

--------------------------
|          tags          |
--------------------------
| id | user_id | post_id |
|----|---------|---------|
| 1  | 3       | 3       |
| 2  | 1       | 1       |
| 3  | 4       | 4       |
| 4  | 3       | 3       |
| 5  | 3       | 3       |

One possible way is recording some distance from the top left of the photo in (x, y) coordinates. So this assumes photos have the same dimensions. Maybe photos have different dimensions, but we're not going to worry about that. So this is now the table that we have.

--------------------------------------
|               tags                 |
--------------------------------------
| id | user_id | post_id | x   | y   |
|----|---------|---------|-----|-----|
| 1  | 3       | 3       | 352 | 235 |
| 2  | 1       | 1       | 765 | 26  |
| 3  | 4       | 4       | 574 | 925 |
| 4  | 3       | 3       | 472 | 578 |
| 5  | 3       | 3       | 155 | 185 |

So this would work no problem, right? Well we definitely have a good design but there is one very small thing.

So I got another screenshot here. And I want you to notice something. There are tags added into a caption, and added tags added into a photo. I want you to think about whether we need to add something to the database for mentions in a caption.

* Highlighted text doesn't necessarily mean that we need to store something in the database
* Mobile app could (and probably is) in charge of highlighting anything that looks like a mention
* Need to show a list of posts a user was mentioned in?
* Need to show a list of the most-often mentioned users?
* Need to notify a user when they've been mentioned?

### Considerations on Photo Tags vs Caption Tags

So now we have 2 ideas of tagging. Tagging within a caption, and Tagging within a photo. These might seem like 2 different things but think about the actual behavior. The end result is kind of similar. We are trying to draw a user's attention. Whether form of text or label within a photo. Next thing should we model them in same way, or separate way? At the end of day, they're modeling same thing.

__Tag Solution #1__

We might distinguish between the two using the x and y coordinates. For a photo one, we'd use the x and y coordinates. For a caption one, we'd make x and y coordinates `NULL`. So we have one single table of all tags. That's the upside. Single resource how often user is being mentioned. There's not really a lot more. I can agree with you if you think this feels funny. I agree with you, but just wanted to mention it, and not worst thing in the world.


----------------------------------------
|                 tags                 |
----------------------------------------
| id | user_id | post_id | x    | y    |
|----|---------|---------|------|------|
| 1  | 3       | 3       | 352  | 235  |
| 2  | 1       | 1       | NULL | NULL |
| 3  | 4       | 4       | 574  | 925  |
| 4  | 3       | 3       | 472  | 578  |
| 5  | 3       | 3       | NULL | NULL |

__Tag Solution #2__

Make 2 separate tables. `photo_tags` and `caption_tags`.

--------------------------------------
|               tags                 |
--------------------------------------
| id | user_id | post_id | x   | y   |
|----|---------|---------|-----|-----|
| 1  | 3       | 3       | 352 | 235 |
| 3  | 4       | 4       | 574 | 925 |
| 5  | 3       | 3       | 155 | 185 |

--------------------------
|          tags          |
--------------------------
| id | user_id | post_id |
|----|---------|---------|
| 1  | 1       | 1       |
| 2  | 3       | 3       |

---

So which is better?

Solution #1 is weird but it does make sense because they're achieving the exact same results.

So ask yourself:
* Do you expect to query for `caption_tags` and `photo_tags` at different tags?
* Will the meaning of a `photo_tag` expect to gain functionality as our application changes?

With the 1st question, if that's true, then you'd want to separate them, and you can apply optimizations to the `captions_tag` table.

Add a like to a `photo_tag` or a comment to a `photo_tag`, that would drive us to Solution #2, since they're isolated. Opposite is true. If we wanted to add more functionality to a `caption_tag`, that'd be a lot easier to do with a separate table.

We're going to with Solution #2. I apologize for being long, but Design is the real meat and potatoes of DB stuff. Writing SQL and queries, you can fiddle around with and google until you get it right.

### Update For Tags

![Instagram DB Diagram 4](images/instagram_dbdiagram4.png)

The reason we don't have a `updated_at` field for a caption is we don't ever expect to update a caption tag. We have one for `photo_tags` because we might update a photo tag by moving it a different location in the photo.

Also our diagram may look visually confusing but it doesn't necessarily mean you've got a bad design.
