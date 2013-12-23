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

exports.person = function(db) {
  return function(req, res) {
    var person = db.get('person');
    person.find({}, {}, function(e, pdocs) {
      var ids = [];
      for (var i=0; i<pdocs.length; i++) {
        ids.push(pdocs[i].customer);
      }
      var customer = db.get('customer');
      customer.find({_id: { $in: ids }}, {}, function(e, cdocs) {
        var plist = [];
        for (var i=0; i<pdocs.length; i++) {
          p = pdocs[i];
          for (var j=0; j<cdocs.length; j++) {
            if (cdocs[j]._id.toString() == p.customer.toString()) {
              p.customer = cdocs[j];
              break;
            }
          }
	  plist.push(p);
        }

        res.render('personlist', {
          "personlist": plist
        });
      });
    }); 
  };
};

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

