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
- Priority: highest
- Criteria of Satisfaction:
  - Have the mainpage that points to subpages
  - Be able to create a subpage (such as UTM) with a specific topic
  - A subpage should contain different categories.
  - Main page should have links to subpages and vice versa
  - Back buttons and reload should work as expected

**Create a category under subpage:**
- As a senior in university, I want to start a category about my specific program (such as CS) at my school so that all students can share our experiences.
- Estimate: 5
- Priority: highest
- Criteria of Satisfaction:
  - Be able to create a category under a specific subpage.
  - A category should contain different threads
  - Be able to navigate from main page -> subpage -> category and vice versa
  - back/reload buttons should work as expected

**Create a thread under category:** 
- As a freshman in university, I want to start a thread about which courses are easy 4.0 for my specific program so that I can focus on my core courses. 
- Estimate: 5
- Priority: highest
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
- Priority: highest
- CoS:
  - Be able to type and submit my post
  - Be able to view my post afterwards
  - Should contain:
    - Text content
    - Date/time posted
    - Posted by <username> or <anonymous>
    - Optional: include pictures 

**Edit/delete a post:**
- As a senior, I want to edit or delete a post I created earlier to fix some mistakes.
- Estimate: 3
- Priority: highest
- CoS:
    - Only available to users with an account
    - Be able to track my own posts 
    - Clicking on the edit button should allow me to edit my original post
    - Clicking on the cancel button should undo everything
    - Clicking on the post button should post my revision.
    - Delete button should mark the post as deleted and the content should change to “This post has been deleted”
    - Be able to see my revised post under the thread.
    
**Edit my thread:** 
- As a first-year student, I want to be able to edit a thread I created earlier to clarify what I meant by “Easy 4.0”
- Estimate: 2
- Priority: Moderate
- CoS:
    - Only available to users with an account
    - Be able to track my own threads
    - Clicking on the edit button should allow me to edit my original thread
    - Clicking on the cancel button should undo everything
    - Clicking on the post button should post my revision.
    - Be able to see my revised thread under the category page

**React to a post:** 
- As a regular user, I want to be able to react to a thread by emoji so that I don’t have to manually type anything.
- Estimate: 1
- Priority: low
- CoS:
    - Users are able to include emojis in their posts 
    - Users should be able to “like” a post with an emoji
    - Click on an emoji like the like button and have the emoji appear like a normal like

**Delete a thread:** 
- As a regular user, I want to be able to delete a thread that I created so that no one can reply to it anymore.
- Estimate: 2
- Priority: moderate
- CoS:
  - Deleting a thread will result in that thread no longer showing up in their subcategories anymore
  - Users can no longer find or read any posts from the deleted thread


**Anonymity:** 
- As someone who lives on campus, I want to ask about how to get my roommate to take out the garbage without exposing either of our identity.  
-- Delay/Approval system  
-- Captchas  
-- Possibly some sort of smart filter system.  
-- Will be split into more USs most likely
- Estimate: 20
- Priority: highest
- Criteria of Satisfaction:



