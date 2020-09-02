const Book = require('../database/models/book');
const Author = require('../database/models/author');
const Genre = require('../database/models/genre');
const BookInstance = require('../database/models/bookInstance');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const async = require('async');
const genre = require('../database/models/genre');
const author = require('../database/models/author');

exports.index = function(req, res) {   
    
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library ',layout: "main.hbs", contents: 'The Contents',  data: results });
    });
};
// Display list of all books.
exports.book_list = function(req, res) {
    Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
      //Successful, so render
      list_books.sort(function(a, b) {let textA = a.title.toUpperCase(); let textB = b.title.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;});
      let lists = []
      list_books.forEach( element => {
          const data = { 
              authorName : element.author.name,
              title : element.title,
              links : element.url
            }
            lists.push(data)
      })
      res.render('book_list', { title: 'Book List', layout: 'main.hbs', book_list: lists });
    });
    
};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {
    const { id } = req.params
    async.parallel({
        book: function(callback) {

            Book.findById(id)
              .populate('author')
              .populate('genre')
              .exec(callback);
        },
        book_instance: function(callback) {

          BookInstance.find({ 'book': id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.book==null) { // No results.
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }
        let bookLists = [], bookInstanceLists = []
        let data  = {
                title : results.book.title,
                authorUrl : results.book.author.url,
                authorName : results.book.author.name,
                summary : results.book.summary,
                isbn : results.book.isbn,
                genre : []
        }
    
            results.book.genre.forEach( element => {
                const genreData = {
                    name : element.name,
                    links : element.url
                }
                data['genre'].push(genreData)
            } )
            bookLists.push(data)
        results.book_instance.forEach(element => {
            const data = {
                status : element.status,
                imprint : element.imprint,
                due_back_formatted : element.due_back_formatted,
                id : element._id,
                links : element.url
            }
            bookInstanceLists.push(data)
        })
        // Successful, so render.
        res.render('book_detail', { title: results.book.title, book: bookLists, book_instances: bookInstanceLists } );
    });

};

// Display book create form on GET.
exports.book_create_get = function(req, res, next) { 
      
    // Get all authors and genres, which we can use for adding to our book.
    async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        
        let authors = [], genres = []
            results.authors.forEach(element => {
                const data = {
                    id : element._id,
                    name : element.name
                }
                authors.push(data)
            })
            results.genres.forEach(element => {
                const data = {
                    id : element._id,
                    name : element.name,
                }
                genres.push(data)
            })
            authors.sort(function(a, b) {let textA = a.name.toUpperCase(); let textB = b.name.toUpperCase(); return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;})
        res.render('book_form', { title: 'Create Book', authors: authors, genres: genres });
    });
    
};

// Handle book create on POST.
exports.book_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),
  
    // Sanitize fields (using wildcard).
    sanitizeBody('*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Book object with escaped and trimmed data.
        var book = new Book(
          { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('book_form', { title: 'Create Book',authors:results.authors, genres:results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save book.
            book.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new book record.
                   res.redirect(book.url);
                });
        }
    }
];
// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};