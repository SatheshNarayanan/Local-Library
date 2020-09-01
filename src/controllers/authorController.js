const Author = require('../database/models/author');
const async = require('async');
const Book = require('../database/models/book');

// Display list of all Authors.
exports.author_list = function(req, res, next) {

    Author.find()
      .populate('author')
      .sort([['family_name', 'ascending']])
      .exec(function (err, list_authors) {
        if (err) { return next(err); }
        //Successful, so render
        const lists = []
        list_authors.forEach( element => {
            const data = {
                links : element.url,
                name : element.name,
                date_of_birth : element.date_of_birth_formatted,
                date_of_death :  element.date_of_death_formatted
            }
            if (element.date_of_birth_formatted == element.date_of_death_formatted) {
                data["date_of_birth"] = ''
                data["date_of_death"] = ''
            }
                                            
            lists.push(data)
        })
        res.render('author_list', { title: 'Author List', layout : 'main.hbs', author_list: lists });
      });
  
  };

// Display detail page for a specific Author.
exports.author_detail = function(req, res, next) {
    const { id } = req.params
    async.parallel({
        author: function(callback) {
            Author.findById(id)
              .exec(callback)
        },
        authors_books: function(callback) {
          Book.find({ 'author': id },'title summary')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.author==null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        const booksList = []
        const data = [{
            name : results.author.name,
            date_of_birth : results.author.date_of_birth_formatted, 
            date_of_death: results.author.date_of_death_formatted
        }]
        results.authors_books.forEach( element => {
            const data = {
                links : element.url,
                title : element.title,
                summary : element.summary,
            }
            booksList.push(data)
        })
        // Successful, so render.
        res.render('author_detail', { title: 'Author Detail', layout:"main.hbs",author: data, authorbooks: booksList } );
    });

};

// Display Author create form on GET.
exports.author_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create GET');
};

// Handle Author create on POST.
exports.author_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author create POST');
};

// Display Author delete form on GET.
exports.author_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Author update POST');
};