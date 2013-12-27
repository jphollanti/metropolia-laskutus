exports.customer = function(mongoClient) {
  return function(req, res) {
  
    mongoClient.connect("mongodb://localhost:27017/metropolia-laskutus", function(err, db) {
      if(err) {
        throw err;
      }
      db.collection('customer').find().toArray(function(err, docs) {
        res.render('customerlist', {
          "customerlist": docs
        });
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