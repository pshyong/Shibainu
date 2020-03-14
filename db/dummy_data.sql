-- \i /home/pat/csc301/project-shibainu/db/dummy_data.sql


INSERT INTO Subpage (title, description)
VALUES ('Subpage Title Here', 'Sample subpage description here')
ON CONFLICT DO NOTHING;

INSERT INTO Category (subject, page_id)
VALUES ('Category Subject Here', 
(SELECT page_id FROM Subpage WHERE title = 'Subpage Title Here')
) ON CONFLICT DO NOTHING;

INSERT INTO Subcategory (subject, main_cat_id)
VALUES ('Subcategory Subject Here',
(SELECT cat_id FROM Category WHERE subject = 'Category Subject Here')
) ON CONFLICT DO NOTHING;

INSERT INTO Thread (subject, sub_cat_id, session_id) 
VALUES ('Thread Subject Here',
(SELECT sub_cat_id from Subcategory WHERE subject = 
'Subcategory Subject Here'), 'sess1'
) ON CONFLICT DO NOTHING;

INSERT INTO Post (content, thread_id, session_id) 
VALUES ('Post 1 Content Here',
(SELECT thread_id from Thread WHERE subject = 'Thread Subject Here'), 'sess2'
) ON CONFLICT DO NOTHING;

INSERT INTO Post (content, thread_id, session_id) 
VALUES ('Post 2 Content Here',
(SELECT thread_id from Thread WHERE subject = 'Thread Subject Here'), 'sess3'
) ON CONFLICT DO NOTHING;

INSERT INTO Post (content, thread_id, session_id) 
VALUES ('Post 4 Content Here',
(SELECT thread_id from Thread WHERE subject = 'Thread Subject Here'), 'sess4'
) ON CONFLICT DO NOTHING;
-- --------------------
-- Another subcategory:

INSERT INTO Subcategory (subject, main_cat_id)
VALUES ('Subcategory 2 Subject Here',
(SELECT cat_id FROM Category WHERE subject = 'Category Subject Here')
) ON CONFLICT DO NOTHING;

INSERT INTO Thread (subject, sub_cat_id, session_id) 
VALUES ('Thread 2 Subject Here',
(SELECT sub_cat_id from Subcategory WHERE subject = 
'Subcategory 2 Subject Here'), 'sess4'
) ON CONFLICT DO NOTHING;

INSERT INTO Post (content, thread_id, session_id) 
VALUES ('Post 1 Content Here',
(SELECT thread_id from Thread WHERE subject = 'Thread 2 Subject Here'), 'sess4'
) ON CONFLICT DO NOTHING;

INSERT INTO Post (content, thread_id, session_id) 
VALUES ('Post 2 Content Here',
(SELECT thread_id from Thread WHERE subject = 'Thread 2 Subject Here'), 'sess4'
) ON CONFLICT DO NOTHING;

INSERT INTO Post (content, thread_id, session_id) 
VALUES ('Post 4 Content Here',
(SELECT thread_id from Thread WHERE subject = 'Thread 2 Subject Here'), 'sess4'
) ON CONFLICT DO NOTHING;