var common = require('./common.js');
var ObjectID = require('mongodb').ObjectID;

exports.addForm = function(mongoClient) {
  return function(req, res) {
    res.render('person-add', {
      "customer": req.query.customer
    });
  }
}

exports.add = function(mongoClient) {
  return function(req, res) {
    common.connect(mongoClient, function(err, db) {
      db.collection('person').insert(req.body, function(err, result) {
        res.render('person-added', {
          
        });
      });
    });
  }
}

exports.list = function(mongoClient) {
  return function(req, res) {
    //var customer = req.query.customer;
    //console.log("customer: " + customer);
    //var cid = new ObjectID(req.query.customer);

    common.connect(mongoClient, function(err, db) {
      db.collection('person').find({customer:req.query.customer}).toArray(function(err, people) {
        db.collection('customer').find({_id: {$in: getCustomerIds(people)}}, {}).toArray(function(err, customers) {
          res.render('personlist', {
            "personlist": mergePeopleAndCustomers(people, customers)
          });
        });
      });
    });
  };
};

function getCustomerIds(people) {
  var customerIds = new Array();
  for (var i=0; i<people.length; i++) {
    customerIds.push(new ObjectID(people[i].customer));
  }
  return customerIds;
}

function mergePeopleAndCustomers(people, customers) {
  var personList = new Array();
  people.forEach(function(person) {
    customers.forEach(function(customer) {
      if (person.customer == customer._id) {
        personList.push(getNewPersonMergedWithCustomer(person, customer));
      }
    });
  });
  return personList;
}

function getNewPersonMergedWithCustomer(person, customer) {
  return { _id: person._id,
           firstname: person.firstname, 
           lastname: person.lastname,
           customer: person.customer,
           customerName: customer.name
         }
}

exports.delete = function(mongoClient) {
  return function(req, res) {
    var delPerson = req.query.delete;
    if (typeof delPerson == 'undefined' ||
        delPerson === null || 
        delPerson === '') {
      throw new Error("Document to delete has not been specified.");
    }
    common.connect(mongoClient, function(err, db) {
      var pid = new ObjectID(delPerson);
      db.collection('person').remove({_id: pid}, {w:1}, function(err, result) {
        res.render('person-removed');
      });
    });
  };
};



