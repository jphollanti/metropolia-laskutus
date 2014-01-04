var common = require('./common.js');
var ObjectID = require('mongodb').ObjectID;

exports.people = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      console.log("doinnit");
      db.collection('person').find({customer:req.query.customer}).toArray(function(err, people) {
        console.log("still doinnit!");
        res.write(JSON.stringify(people));
        res.end();
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
