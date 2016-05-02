var sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('./database/blog.sqlite3');

module.exports = exports = db;
