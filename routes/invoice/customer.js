exports.list = function(mongoClient) {
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

exports.addForm = function() {
  return function(req, res) {
    res.render('add-customer-form');
  }
}

exports.add = function(mongoClient) {
  return function(req, res) {
    
    mongoClient.connect("mongodb://localhost:27017/metropolia-laskutus", function(err, db) {
      if (err) {
        throw err;
      }
      db.collection('customer').insert(req.body, function(err, result) {
        res.render('add-customer', {testi:req.body.testi});
      });
    });
  }
}
