var common = require('./common.js');

exports.list = function(mongoClient) {
  return function(req, res) {
    renderList(mongoClient, req, res);
  };
};

exports.addForm = function() {
  return function(req, res) {
    res.render('add-customer-form');
  }
}

exports.add = function(mongoClient) {
  return function(req, res) {
    connect(mongoClient, function(err, db) {
      db.collection('customer').insert(req.body, function(err, result) {
        renderList(mongoClient, req, res);
      });
    });
  }
}

exports.delete = function(mongoClient) {
  return function(req, res) {
    
  }
}

function renderList(mongoClient, req, res) {
  common.connect(mongoClient, function(err, db) {
    db.collection('customer').find().toArray(function(err, docs) {
      res.render('customerlist', {
        "customerlist": docs
      });
    });
  });
}
