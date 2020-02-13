CREATE TABLE Subcategory (
    sub_cat_id SERIAL PRIMARY KEY,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    main_cat_id int REFERENCES category(cat_id),
    subject VARCHAR(100) NOT NULL
);