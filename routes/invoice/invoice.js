var common = require('./common.js');
var ObjectID = require('mongodb').ObjectID;

exports.index = function() {
  return function(req, res) {
    res.render('index');
  }
}

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

exports.list = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      if (req.query.customer) {
        db.collection('invoice').find({"customer._id": new ObjectID(req.query.customer)})
          .toArray(function(err, invoices) {
          renderList(res, invoices);
        }); 
      } if (req.query.product) {
        db.collection('invoice').find({"items.product._id": new ObjectID(req.query.product)})
          .toArray(function(err, invoices) {
          renderList(res, invoices);
        }); 
      } else {
        db.collection('invoice').find().toArray(function(err, invoices) {
          renderList(res, invoices);
        }); 
      }
    });
  };
};

function renderList(res, invoices) {
  res.render('invoice-list', {
    "invoicelist": invoices
  });
}

exports.addForm = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('customer').find().toArray(function(err, customers) {
        res.render('invoice-add', {customers: customers});
      });
    });
  }
}

exports.add = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('customer').findOne({_id:new ObjectID(req.body.customer)}, {}, function(err, customer) {
        db.collection('person').findOne({_id:new ObjectID(req.body.person)}, {}, function(err, person) {
          req.body.customer = customer;
          req.body.person = person;
          req.body.status = 1;
          req.body.created = new Date();
          req.body.paid = null;
          req.body.items = [];
          db.collection('invoice').insert(req.body, function(err, result) {
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
