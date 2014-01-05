var common = require('./common.js');
var ObjectID = require('mongodb').ObjectID;

exports.list = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('invoice').findOne({_id: new ObjectID(req.query.invoice)}
        , function(err, invoice) {
        res.render('item-list', {
            invoice: invoice
          , items: invoice.items});
      });
    });
  }
}

exports.addForm = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('product').find().toArray(function(err, products) {
        res.render('item-add', 
          {invoice: req.query.invoice, 
           products: products});
      });
    });
  }
}

exports.add = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      console.log("invoice: " + req.body.invoice);
      db.collection('invoice').findOne({_id:new ObjectID(req.body.invoice)}, {}, function(err, invoice) {
        db.collection('product').findOne({_id:new ObjectID(req.body.product)}, {}, function(err, product) {
          invoice.items.push({
            product: product, 
            "amount-sold": req.body.amountsold, 
            price: req.body.price,
            "discount-percentage": req.body.discountpercentage
          });
          db.collection('invoice').save(invoice, function(err, result) {
            res.render('invoice-added', {});
          });
        });
      });
    });
  }
}

exports.remove = function(mongoClient) {
  return function(req, res) {
    var delProduct = req.query.product;
    if (typeof delProduct == 'undefined' ||
        delProduct === null || 
        delProduct === '') {
      throw new Error("Document to delete has not been specified.");
    }
    var invoiceId = req.query.invoice;
    if (typeof invoiceId == 'undefined' ||
        invoiceId === null || 
        invoiceId === '') {
      throw new Error("Document to delete has not been specified.");
    }
    common.connect(mongoClient, function(err, db) {
      var iid = new ObjectID(delProduct);
      db.collection('invoice').update(
          {_id: new ObjectID(req.query.invoice)}
        , {$pull: {"items.product._id": iid}}
        , function(err, result) {
        res.render('item-removed');
      });
    });
  };
};
