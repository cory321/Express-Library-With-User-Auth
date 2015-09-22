var express = require("express"),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	methodOverride = require('method-override'),
  db = require("./models"),
  session = require("cookie-session"),
  loginMiddleware = require("./middleware/loginHelper"),
  routeMiddleware = require("./middleware/routeHelper"),
  app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.use(session({
  maxAge: 3600000,
  secret: 'illnevertell',
  name: "mint chocolate"
}));

app.use(loginMiddleware);

app.get('/', routeMiddleware.ensureLoggedIn, function(req,res){
  res.redirect("/books");
});

app.get('/signup', routeMiddleware.preventLoginSignup, function(req,res){
  res.render('users/signup');
});

app.post("/signup", function (req, res) {
  var newUser = req.body.user;
  db.User.create(newUser, function (err, user) {
    if (user) {
      req.login(user);
      res.redirect("/books");
    } else {
      console.log(err);
      // TODO - handle errors in ejs!
      res.render("users/signup");
    }
  });
});

app.get("/login", routeMiddleware.preventLoginSignup, function (req, res) {
  res.render("users/login");
});

app.post("/login", function (req, res) {
  db.User.authenticate(req.body.user,
  function (err, user) {
    if (!err && user !== null) {
      req.login(user);
      res.redirect("/books");
    } else {
      res.render("users/login");
    }
  });
});

app.get("/books", routeMiddleware.ensureLoggedIn, function(req,res){
	db.Book.find({}, function(err, docs) {
		 err ? res.send(err) : res.render("index", {books: docs});
	});
});

app.get("/books/new", routeMiddleware.ensureLoggedIn, function(req,res){
	res.render("books/new");
});

app.post("/books", function(req,res){
	var title = req.body.title,
	 	author = req.body.author,
	 	year = req.body.year;

	 	if(isNaN(year)) {
	 		res.redirect("/books/new");
	 	} else {
	 		db.Book.create({title: title, author: author, year: year}, function(err, book){
 			 err ? res.send(err) : res.redirect("/");
 		 	});
	 	}
});

app.get('/books/:id', routeMiddleware.ensureLoggedIn, function(req,res){
  db.Book.findById(req.params.id, function(err, foundBook){
    if(err){
      res.send("404");
    } else {
      res.render('books/show', {book:foundBook});
    }
  });
});

app.get('/books/:id/edit', routeMiddleware.ensureLoggedIn, function(req,res){
  db.Book.findById(req.params.id, function(err, foundBook){
    if(err){
      res.send("404");
    } else {
      res.render('books/edit', {book:foundBook});
    }
  });
});

app.put('/books/:id', routeMiddleware.ensureLoggedIn, function(req,res){
 db.Book.findByIdAndUpdate(req.params.id, req.body.book,  function(err, book){
  if(err){
    res.send("404");
  } else{
    res.redirect('/');
  }
 });
});

app.delete('/books/:id', routeMiddleware.ensureLoggedIn, function(req,res){
  db.Book.findByIdAndRemove(req.params.id, function(err, book){
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