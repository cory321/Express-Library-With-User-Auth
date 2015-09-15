var express = require("express"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	methodOverride = require('method-override'),
	app = express();

mongoose.connect("mongodb://localhost/books");
mongoose.set("debug", true);

var bookSchema = new mongoose.Schema({
	title: String,
	author: String,
	year: Number
});

var Book = mongoose.model("Book", bookSchema);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get("/", function(req,res){
	Book.find({}, function(err, docs) {
		 err ? res.send(err) : res.render("index", {books: docs});
	});
});

app.get("/books/new", function(req,res){
	res.render("books/new");
});

app.post("/books", function(req,res){
	var title = req.body.title,
	 	author = req.body.author,
	 	year = req.body.year;

	 	if(isNaN(year)) {
	 		res.redirect("/books/new");
	 	} else {
	 		Book.create({title: title, author: author, year: year}, function(err, book){
 			 err ? res.send(err) : res.redirect("/");
 		 	});
	 	}
});

app.get('/books/:id', function(req,res){
  Book.findById(req.params.id, function(err, foundBook){
    if(err){
      res.send("404");
    } else {
      res.render('books/show', {book:foundBook});
    }
  });
});

app.get('/books/:id/edit', function(req,res){
  Book.findById(req.params.id, function(err, foundBook){
    if(err){
      res.send("404");
    } else {
      res.render('books/edit', {book:foundBook});
    }
  });
});

app.put('/books/:id', function(req,res){
 Book.findByIdAndUpdate(req.params.id, req.body.book,  function(err, book){
  if(err){
    res.send("404");
  } else{
    res.redirect('/');
  }
 });
});

app.delete('/books/:id', function(req,res){
  Book.findByIdAndRemove(req.params.id, function(err, book){
    if(err){
      res.send("404");
    } else{
      res.redirect('/');
    }
  });
});

app.get('*', function(req,res){
  res.send('404');
});

app.listen(3000, function(req,res){
	console.log("listening on 3000");
});