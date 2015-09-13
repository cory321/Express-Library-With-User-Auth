var express = require("express"),
	app = express();

var books = [
	{id:123, title: "Lord of the Rings", author: "J.R.R Tolkien", year: "1954"}
]; 

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req,res){
	res.render("index", {books: books});
});

app.get("/books/new", function(req,res){
	res.render("books/new");
});

app.get("/books/:id", function(req,res){
	var id = parseInt(req.params.id);
	var index;

	for (var i = 0; i < books.length; i++) {
		if(books[i].id === id) {
			index = i;
		} 
	}
	res.render("books/show", books[index]);
});

app.get("/books", function(req,res){
	var id = Math.floor(Math.random()*1000),
		title = req.query.title,
		author = req.query.author,
		year = req.query.year;

		if(title) books.push({id: id, title: title, author: author, year: year});
		res.redirect("/");
});

app.get("/books/update/:id", function(req,res){
	var id = parseInt(req.params.id);
	var index;

	for (var i = 0; i < books.length; i++) {
		if(books[i].id === id) {
			index = i;
		} 
	}
	res.render("books/update", books[index]);
});

app.get("/books/delete/:id", function(req,res){
	var id = parseInt(req.params.id);
	var index;

	for (var i = 0; i < books.length; i++) {
		if(books[i].id === id) {
			index = i;
		} 
	}
	books.splice(index, 1);
	res.redirect("/");
});

app.use(function(req, res, next){
    res.status(404).send("<h1>404 yo!</h1>The page you are looking for does not exist! Go back <a href='/'>home</a>");
});

app.listen(3000, function(req,res){
	console.log("listening on 3000");
});