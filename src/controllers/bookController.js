const Book = require('../database/models/book');
const Author = require('../database/models/author');
const Genre = require('../database/models/genre');
const BookInstance = require('../database/models/bookInstance');

const async = require('async');
const genre = require('../database/models/genre');

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
exports.book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
};

// Handle book create on POST.
exports.book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
};

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