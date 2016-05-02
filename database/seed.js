var sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('blog.sqlite3');

// Create the database schema and populate
db.serialize(function() {
  // Create the posts table.
  db.run("CREATE TABLE posts (postID INTEGER PRIMARY KEY, post_name TEXT, post_html TEXT)");
  // Create the comments table.
  db.run("CREATE TABLE comments (commentID INTEGER PRIMARY KEY, comment TEXT, associated_post INTEGER, FOREIGN KEY(associated_post) REFERENCES posts(postID))");
  // Add two sample posts.
  db.run("INSERT INTO posts (post_name, post_html) VALUES ('Sample Blog #1', '<strong>Here is some sample blog content.</strong> Huzzah!')");
  db.run("INSERT INTO posts (post_name, post_html) VALUES ('Sample Blog #2', '<strong>Here is some more sample blog content.</strong> Huzzah x2!')");
  // Give each of those sample posts two comments.
  db.run("INSERT INTO comments (comment, associated_post) VALUES ('What a cool sample!', 1)");
  db.run("INSERT INTO comments (comment, associated_post) VALUES ('I love this blog!', 1)");
  db.run("INSERT INTO comments (comment, associated_post) VALUES ('What a cool sample x2!', 2)");
  db.run("INSERT INTO comments (comment, associated_post) VALUES ('I love this other blog!', 2)");
});
