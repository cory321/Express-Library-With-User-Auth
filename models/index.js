var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/books");
mongoose.set("debug", true);

module.exports.User = require("./user");
module.exports.Book = require("./book");