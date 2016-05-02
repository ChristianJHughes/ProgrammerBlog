var view = require('../view'),
    db = require('../db'),
    formidable = require('formidable');

// A controller for the blog resource
// This should have methods for all the RESTful actions
var blog = {
  // Read (Display the index page, which lists all current blog posts)
  index: function(req, res) {
    var blog = db.all('SELECT * FROM posts', function(err, blog){
      if(err) {
        console.error(err);
        res.writeHead(500, {"Content-Type":"text/html"});
        res.end("<h1>Server Error</h1>");
        return;
      }
      res.writeHead(200, {"Content-Type":"text/html"});
      res.end(view.render('blog/index', {blog: blog}));
    });
  },

  // Read (Display an individual post).
  show: function(req, res, params) {
    var postAndComments = [];
    // First, we'll get the correct post.
    var blog = db.get('SELECT * FROM posts WHERE postID=?', params.id, function(err, blog){
      if(err) {
        console.error(err);
        res.writeHead(400, {"Content-Type":"text/html"});
        res.end("<h1>Resource Not Found</h1>");
        return;
      }
      // Add the post to an array containing TWO ELEMENTS (The post, and an array of comments).
      postAndComments.push(blog);
      // Query the database to get all of the comment objects.
      db.all('SELECT * FROM comments WHERE associated_post=?', params.id, function(err, comment){
        if(err) {
          console.error(err);
          res.writeHead(400, {"Content-Type":"text/html"});
          res.end("<h1>Resource Not Found</h1>");
          return;
        };
        // Push the array of comment objects into the Post/Comment array (Array Inception)
        postAndComments.push(comment);
        console.log(postAndComments[1]);
        res.writeHead(200, {"Content-Type":"text/html"});
        res.end(view.render('blog/show', postAndComments));
      });
    });
  },
  // Call the edit form for a post, and pass along the post information.
  edit: function(req, res, params) {
    db.get('SELECT * FROM posts WHERE postID=?', params.id, function(err, data) {
      res.writeHead(200, {"Content-Type":"text/html"});
      res.end(view.render('blog/edit', data));
    });
  },
  // Process the POST request sent when making a modification to a blog post.
  processPostEdit: function(req, res, params) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('UPDATE posts SET post_name = ?, post_html = ?',
        fields.title,
        fields.postContent
      );
      blog.index(req, res)
    });
  },
  // Create
  new: function(req, res) {
    res.writeHead(200, {"Content-Type":"text/html"});
    res.end(view.render('blog/new'));
  },
  // Create
  create: function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.run('INSERT INTO posts (post_name, post_html) values (?,?)',
        fields.title,
        fields.postContent
      );
      blog.index(req, res)
    });
  },
  // Delete a complete post.
  destroy: function(req, res, params) {
    console.log(params.id);
    db.run('DELETE FROM posts WHERE postID=?', params.id);
    blog.index(req, res);
  },

  // Delete a single comment.
  destroyComment: function(req, res, params) {
    console.log("Here" + params.id);
    var postNum = "";
    db.serialize(function() {
    db.get('SELECT * FROM comments WHERE commentID=?', params.id, function(err, post) {
      if(err) {
        console.error(err);
        res.writeHead(400, {"Content-Type":"text/html"});
        res.end("<h1>Resource Not Found</h1>");
        return;
      }
      postNum = post.associated_post;
    });
      db.run('DELETE FROM comments WHERE commentID=?', params.id, function(err){
        if(err) {
          console.error(err);
          res.writeHead(400, {"Content-Type":"text/html"});
          res.end("<h1>Resource Not Found</h1>");
          return;
        }
        console.log("Deleted: " + params.id);
        // blog.show(req, res, {id: postNum});
        res.writeHead(302, {"Content-Type":"text/html", "Location":"/blog/" + postNum});
        res.end();

      });
    });
  },

  redirect: function(req, res) {
    res.writeHead(301, {"Content-Type":"text/html", "Location":"/blog"});
    res.end("This page has moved to <a href='/blog'>blog</a>");
  },

  addComment: function(req, res, params) {
    // console.log(req);
    var stringOfData ="";
    req.on('data', function(data){
      stringOfData += data;
    });
    req.on('end', function() {
      db.serialize(function() {
        db.run("INSERT INTO comments (comment, associated_post) VALUES (?, ?)", stringOfData, params.id);
        db.get('SELECT * FROM comments WHERE comment=?', stringOfData, function(err, comment){
          res.writeHead(200);
          console.log("Adding comment:" + stringOfData)
          res.end(comment.commentID + "");
        });
      });
    });
  }

}

module.exports = exports = blog;
