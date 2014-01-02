var common = require('./common.js');
var ObjectID = require('mongodb').ObjectID;

exports.list = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('product').find().toArray(function(err, products) {
        res.render('product-list', {
          "productlist": products
        });
      });
    });
  };
};

exports.addForm = function() {
  return function(req, res) {
    res.render('product-add', {});
  }
}

exports.add = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('product').insert(req.body, function(err, result) {
        res.render('product-added', {});
      });
    });
  }
}

exports.remove = function(mongoClient) {
  return function(req, res) {
    var delProduct = req.query.id;
    if (typeof delProduct == 'undefined' ||
        delProduct === null || 
        delProduct === '') {
      throw new Error("Document to delete has not been specified.");
    }
    common.connect(mongoClient, function(err, db) {
      var pid = new ObjectID(delProduct);
      db.collection('product').remove({_id: pid}, {w:1}, function(err, result) {
        res.render('product-removed');
      });
    });
  };
};



