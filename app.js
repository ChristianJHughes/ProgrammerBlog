var http = require('http'),
    router = require('./router'),
    db = require('./db'),
    view = require('./view'),
    fs = require('fs'),
    js = fs.readFileSync('./static/bundle.js'),
    css = fs.readFileSync('./static/prism.css');

// Add a route to the client-side JavaScript bundle
router.addRoute('/bundle.js', 'GET', function(req, res) {
  res.writeHead(200, {"Content-Type":"text/javascript"});
  res.end(js);
});

// Add a route to the prism (syntax highlighting) css
router.addRoute('/prism.css', 'GET', function(req, res) {
  res.writeHead(200, {"Content-Type":"text/css"});
  res.end(css);
});

// Populating the router with the blog resource
var blog = require('./controllers/blog');

// Add the blog resource
router.addResource('blog', blog);

// Launching the server
new http.Server(router.route).listen(8080);
