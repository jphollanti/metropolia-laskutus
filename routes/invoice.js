exports.index = function() {
  return function(req, res) {
    res.render('index');
  }
}

exports.invoice = function(db) {
  return function(req, res) {
    var invoice = db.get('invoice');
    invoice.find({}, {}, function(e, docs) {
      res.render('invoicelist', {
        "invoicelist": docs
      });
    }); 
  };
};

exports.product = function(db) {
  return function(req, res) {
    var product = db.get('product');
    product.find({}, {}, function(e, docs) {
      res.render('productlist', {
        "productlist": docs
      });
    }); 
  };
};

