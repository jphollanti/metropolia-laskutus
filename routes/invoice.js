exports.index = function() {
  return function(req, res) {
    res.render('index');
  }
}

exports.customer = function(db) {
  return function(req, res) {
    var customer = db.get('customer');
    customer.find({}, {}, function(e, docs) {
      res.render('customerlist', {
        "customerlist": docs
      });
    });
  };
};

exports.add_customer_form = function() {
  return function(req, res) {
    res.render('add-customer-form');
  }
}

exports.add_customer_form_post = function(db) {
  return function(req, res) {
    res.render('add-customer-form-post', {testi:req.body.testi});
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

