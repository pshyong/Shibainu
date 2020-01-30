Story points:
Fibonacci-like format: 0, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100

**Most important user stories:**
- Create a database with NoSQL
- Create CRUD
- Create main page/subpage
- Create category under subpage
- Create threads under category
- Create posts in threads
- Posting anonymously

## User Stories  
  
**Create a database with NoSQL:** 
- As a developer, I want to design and create a database so that forum users can post in their designated subpages
- Estimate: 8
- Priority: highest
- Criteria of Satisfaction:  
  - Be able to create tables and insert dummy data
  - Tables required: (Will be refined when we actually design it)
      - user(name, email, ,role, age?, school?)
      - main_page(title, sub_pages)
      - sub_page(title, categories)
      - category(title, sub_categories)
      - sub_category(title, threads)
      - thread(title, posts)
      - post(posted_by, date/time, content)
      
**Create CRUD:** 
- As a developer, I want to create APIs for CRUD functionality.
- Estimate: 13
- Priority: highest
- Criteria of Satisfaction:
  - Be able to create(POST), read(GET), upload(PUT), and delete(DELETE) rows/columns in the database with APIs


**Create a main page/subpage:**
- As an admin, I want to create a main page/subpage for forum users to interact in. Both main page and subpage is fixed (for now)
- Estimate: 5
- Priority: Highest
- Criteria of Satisfaction:
  - Have the mainpage that points to subpages
  - Be able to create a subpage (such as UTM) with a specific topic
  - A subpage should contain different categories.
  - Main page should have links to subpages and vice versa
  - Back buttons and reload should work as expected

**Create a category under subpage:**
- As a senior in university, I want to start a category about my specific program (such as CS) at my school so that all students can share our experiences.
- Estimate: 5
- Priority: Highest
- Criteria of Satisfaction:
  - Be able to create a category under a specific subpage.
  - A category should contain different threads
  - Be able to navigate from main page -> subpage -> category and vice versa
  - back/reload buttons should work as expected

**Create a thread under category:** 
- As a freshman in university, I want to start a thread about which courses are easy 4.0 for my specific program so that I can focus on my core courses. 
- Estimate: 5
- Priority: Highest
- Criteria of Satisfaction:
  - Only available for users with an account
  - Be able to create a thread under a specific category
  - A thread should have a title, created by, date/time.
  - A thread should contain different posts
  - A thread should contain a textbox for typing up a post
  - Be able to navigate from main page -> subpage -> category -> thread and vice versa.
  - Back/reload buttons should work as expected

**Create a post in a thread:**
- As a senior, I want to respond to a thread about which courses are easy 4.0s for my program.
- Estimate: 5
- Priority: Highest
- Criteria of Satisfaction:
  - Be able to type and submit my post
  - Be able to view my post afterwards
  - Should contain:
    - Text content
    - Date/time posted
    - Posted by <username> or <anonymous>
    - Optional: include pictures 

**Posting anonymously:** 
- As a freshman who lives on campus, I want to ask about how to get my roommate to take out the garbage without exposing either of our identity.  
- Estimate: 5
- Priority: Highest 
- Criteria of Satisfaction:
    - Users can make posts without registering for an account
    - User’s personal information does not appear anywhere in their post
    - Users needs to complete a CAPTCHA before they can post 

**Edit/delete a post:**
- As a senior, I want to edit or delete a post I created earlier to fix some mistakes.
- Estimate: 3
- Priority: Highest
- Criteria of Satisfaction:
    - Only available to users with an account
    - Be able to track my own posts 
    - Clicking on the edit button should allow me to edit my original post
    - Clicking on the cancel button should undo everything
    - Clicking on the post button should post my revision.
    - Delete button should mark the post as deleted and the content should change to “This post has been deleted”
    - Be able to see my revised post under the thread.

**Impose penalties on users for inappropriate behaviour:** 
- As a moderator/admin, I want to be able to penalize users so that I can penalize inappropriate behavior.
- Estimate: 8
- Priority: High 
- Criteria of Satisfaction:
    - Moderators/admins can stop certain people from posing with IP bans 
    - Impose a point system on registered accounts to encourage good behaviour
    - Allow moderators/admins to lock threads so users can cool off

**Optional approval system for threads:** 
- As a teacher, I want to create a thread where no anonymous posts are allowed.
- Estimate: 3
- Priority: High 
- Criteria of Satisfaction:
    - Threads default to allow anonymous posts
    - Have a checkbox to “Disable anonymous posts”
    - Users are no longer able to post anonymously in such threads
    
**Delay posting for anonymous users:** 
- As a moderator/admin, I want to prevent trolls and other malicious users from abusing the anonymous posting feature to spam threads with inappropriate content. 
- Estimate: 3
- Priority: High 
- Criteria of Satisfaction:
    - An anonymous post needs to wait for a certain amount of time before it comes “alive” and can be seen by other users
    - Limited number of posts allowed in a time-frame (roughly 1 post per 10 min)
    - Posts can be cancelled if they are not "alive"

**Account sign-up:** 
- As a frequent user, I would like to be able to use features that an anonymous user would not be to, such as having a post history.
- Estimate: 5
- Priority: Moderate 
- Criteria of Satisfaction:
    - Have an account sign-up page with basic info: name, password, email (username)
    - Once signed-up, user should be redirected to the login page 
    - Sign-in with the newly created username and password should be successful.

**Search for thread/post:** 
- As a user with an account, I want to be able to quickly find threads/posts I'm interested in quickly
- Estimate: 5
- Priority: Moderate 
- Criteria of Satisfaction:
    - Users should be able to type keywords into a search bar and only have posts and threads that contain the keywords appear 
    - Users should be able to specify where to look for the keywords (title, posts, etc…)
    - Users should be able to specify if all keywords or if any keyword is sufficient for a match

**Edit my thread:** 
- As a first-year student, I want to be able to edit a thread I created earlier to clarify what I meant by “Easy 4.0”
- Estimate: 2
- Priority: Moderate
- Criteria of Satisfaction:
    - Only available to users with an account
    - Be able to track my own threads
    - Clicking on the edit button should allow me to edit my original thread
    - Clicking on the cancel button should undo everything
    - Clicking on the post button should post my revision.
    - Be able to see my revised thread under the category page

**Delete a thread:** 
- As a regular user, I want to be able to delete a thread that I created so that no one can reply to it anymore.
- Estimate: 2
- Priority: Moderate
- Criteria of Satisfaction:
  - Deleting a thread will result in that thread no longer showing up in their subcategories anymore
  - Users can no longer find or read any posts from the deleted thread
  
**Down/up voting:** 
- As a user, I want to be able to upvote and downvote posts so that I demonstrate that I found a post useful or not useful without having to clutter up a thread with a post
- Estimate: 2
- Priority: Moderate 
- Criteria of Satisfaction:
    - Users should be able to press a button to like a post
    - Users should be able to press a different button to dislike a post
    - Posts should show how many users liked or disliked it
  
**Sort:** 
- As a user, I want to be able to sort threads and posts so that I can find specific threads and posts easier 
- Estimate: 1
- Priority: Moderate 
- Criteria of Satisfaction:
    - Users should be able to sort posts/threads by time created/updated, number of posts, number of likes, etc…

**Style your own subpage:** 
- As a user with an account, I want to be able to save my posts so I can find it later.
- Estimate: 5
- Priority: Low 
- Criteria of Satisfaction:
    - moderator/admins should be able to upload a css or other template page and have their subpage reflect the uploaded css
    - moderator/admins should be able to upload their own custom logos that will appear at the top of the page
    - moderator/admins should be able to choose the colour of the elements on their subpage

**Smart filter system for all posts:** 
- As an admin, I want to prevent users from posting inappropriate content automatically.
- Estimate: 5
- Priority: Low 
- Criteria of Satisfaction:
    - Filter out curse words
    - Filter out aggressive,  abusive, racist, or sexist languages

**Save posts:** 
- As a user with an account, I want to be able to save my posts so I can find it later.
- Estimate: 3
- Priority: Low 
- Criteria of Satisfaction:
    - Account users should be able to save specific posts to be view latter 
    - Account users should be able to view all saved posts somewhere on their profile

**Bookmark thread:** 
- As a user with an account, I want to be able to quickly find threads I found useful or liked so that I don’t have to waste time looking for the thread 
- Estimate: 2
- Priority: Low 
- Criteria of Satisfaction:
    - Account users should be able to save(bookmark) any threads they like
    - Account users should be able to see all the threads they bookmarked on a section or interface in their profiles

**Private messaging:** 
- As a user, I would like to be able to send a private message to someone so that I can communicate with them without having everyone knowing the contents of my conversation
- Estimate: 2
- Priority: Low 
- Criteria of Satisfaction:
    - A user can send a message to a specific user
    - Only the recipient user can see the message 
    - Both users can reply to the message

**React to a post:** 
- As a regular user, I want to be able to react to a thread by emoji so that I don’t have to manually type anything.
- Estimate: 1
- Priority: low
- Criteria of Satisfaction:
    - Users are able to include emojis in their posts 
    - Users should be able to “like” a post with an emoji
    - Click on an emoji like the like button and have the emoji appear like a normal like

**Drawing Images:** 
- As a user, I would like to be able to send a private message to someone so that I can communicate with them without having everyone knowing the contents of my conversation
- Estimate: 13
- Priority: Lowest
- Criteria of Satisfaction:
    - Users can click on a button to open up a drawing interface where they can draw an image and attach it to their post 
    - Users should also be able to import a pre-existing image into the interface and draw on the image 
