var BookInstance = require('../database/models/bookInstance');
const book = require('../database/models/book');

// Display list of all BookInstances.
exports.bookinstance_list = function(req, res, next) {

    BookInstance.find()
      .populate('book')
      .exec(function (err, list_bookinstances) {
        if (err) { return next(err); }
        // Successful, so render
        let lists = []
        list_bookinstances.forEach( element => {
            const data = {
                links : element.url,
                title : element.book.title,
                imprint : element.imprint,
                status : element.status,
                due_back : element.due_back_formatted
            }
            lists.push(data)
        })
        res.render('bookinstance_list', { title: 'Book Instance List',layout: "main.hbs", bookinstance_list: lists });
      });
      
  };

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res, next) {
    const { id } = req.params
    BookInstance.findById(id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance==null) { // No results.
          var err = new Error('Book copy not found');
          err.status = 404;
          return next(err);
        }
        console.log(bookinstance)
        const data = [{
            id : bookinstance._id,
            links : bookinstance.book.url,
            title : bookinstance.book.title,
            imprint : bookinstance.imprint,
            status : bookinstance.status,
            due_back : bookinstance.due_back_formatted
        }]
      // Successful, so render.
      res.render('bookinstance_detail', { title: 'Copy: '+bookinstance.book.title, bookinstance:  data});
    })

};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create GET');
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance create POST');
};

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};