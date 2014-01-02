var common = require('./common.js');
var ObjectID = require('mongodb').ObjectID;

exports.list = function(mongoClient) {
  return function(req, res) {
    renderList(mongoClient, req, res);
  };
};

exports.addForm = function() {
  return function(req, res) {
    res.render('customer-add');
  }
}

exports.add = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('customer').insert(req.body, function(err, result) {
        renderList(mongoClient, req, res);
      });
    });
  }
}

function renderList(mongoClient, req, res) {
  common.connect(mongoClient, function(err, db) {
    db.collection('customer').find().toArray(function(err, docs) {
      res.render('customer-list', {
        "customerlist": docs
      });
    });
  });
}
exports.delete = function(mongoClient) {
  return function(req, res) {
    var delCustomer = req.query.id;
    if (typeof delCustomer == 'undefined' ||
        delCustomer === null || 
        delCustomer === '') {
      throw new Error("Document to delete has not been specified.");
    }
    common.connect(mongoClient, function(err, db) {
      var cid = new ObjectID(delCustomer);
      db.collection('customer').remove({_id: cid}, {w:1}, function(err, result) {
        res.render('customer-removed');
      });
    });
  };
};



