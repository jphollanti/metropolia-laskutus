var common = require('./common.js');

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

pmap = function() {
  var cn = customerResolver.resolve(this.customer); 
  return emit(this._id
              , { id: this._id
	        , firstname: this.firstname
		, lastname: this.lastname
		, title: this.title
		, customerId: this.customer
		, customerName:cn});
};

preduce = function(key, values) {
  return values[0];
};

cmap = function() {
  return emit(this._id, {name: this.name});
};

creduce = function(key, values) {
  return values[0];
};

getCustomerResolver = function(customers) { 
  return {
    data: customers, 
    resolve: function(_id) {
      var value = "";
      this.data.forEach(function(item) {
        if (item._id.equals(_id)) {
          value = item.value.name;
        }
      });
      return value;
    }
  }
}

function joinPersonWithCompany(mongoClient, callback) {
  mongoClient.connect("mongodb://localhost:27017/metropolia-laskutus"
    , function(err, db) {
        if(err) {
          throw err;
        }

        db.collection('customer').mapReduce(
	       cmap
	     , creduce
	     , { out: {inline : 1}}
	     , function(err, customers) {
          
          db.collection('person').mapReduce(
              pmap
            , preduce
            , { out: {inline : 1}
              , scope: { 
                customerResolver: getCustomerResolver(customers)
                }
              }
            , callback 
          );
        }
    );
  });
}

exports.person = function(db) {
  return function(req, res) {
    joinPersonWithCompany(db, function(err, result) {
      res.render('personlist', {
        "personlist": result
      });
    });
  };
};
