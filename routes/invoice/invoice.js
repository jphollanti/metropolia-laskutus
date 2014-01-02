var common = require('./common.js');
var ObjectID = require('mongodb').ObjectID;

exports.index = function() {
  return function(req, res) {
    res.render('index');
  }
}

exports.list = function(db) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('invoice').find().toArray(function(err, products) {
        res.render('invoice-list', {
          "invoicelist": invoices
        });
    }); 
  };
};

exports.addForm = function() {
  return function(req, res) {
    res.render('invoice-add', {});
  }
}

exports.add = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('invoice').insert(req.body, function(err, result) {
        res.render('invoice-added', {});
      });
    });
  }
}

exports.remove = function(mongoClient) {
  return function(req, res) {
    var delInvoice = req.query.id;
    if (typeof delInvoice == 'undefined' ||
        delInvoice === null || 
        delInvoice === '') {
      throw new Error("Document to delete has not been specified.");
    }
    common.connect(mongoClient, function(err, db) {
      var iid = new ObjectID(delInvoice);
      db.collection('product').remove({_id: iid}, {w:1}, function(err, result) {
        res.render('invoice-removed');
      });
    });
  };
};
