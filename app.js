var express = require("express"),
	app = express();

var books = [
	{id:1, title: "Lord of the Rings", author: "J.R.R Tolkien", year: "1954"}
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
	var id = books.length + 1,
		title = req.query.title,
		author = req.query.author,
		year = req.query.year;

		if(title) books.push({id: id, title: title, author: author, year: year});
		res.redirect("/");
});

app.listen(3000, function(req,res){
	console.log("listening on 3000");
});