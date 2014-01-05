
/**
 * Module dependencies.
 */

var express = require('express');

var product = require('./routes/invoice/product');
var customer = require('./routes/invoice/customer');
var person = require('./routes/invoice/person');
var invoice = require('./routes/invoice/invoice');
var item = require('./routes/invoice/item');

var http = require('http');
var path = require('path');
var mongo = require('mongodb');

// Retrieve
var mongoClient = mongo.MongoClient;

var app = express();

app.set ('view engine', 'jade');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Main menu
app.get('/', invoice.index());

// Product
app.get('/invoice/product/list', product.list(mongoClient));
app.get('/invoice/product/add', product.addForm(mongoClient));
app.post('/invoice/product/add', product.add(mongoClient));
app.get('/invoice/product/remove', product.remove(mongoClient));

// Customer
app.get('/invoice/customer/list', customer.list(mongoClient));
app.get('/invoice/customer/add', customer.addForm());
app.post('/invoice/customer/add', customer.add(mongoClient));
app.get('/invoice/customer/delete', customer.delete(mongoClient));

// Contact person
app.get('/invoice/person/list', person.list(mongoClient));
app.get('/invoice/person/add', person.addForm(mongoClient));
app.post('/invoice/person/add', person.add(mongoClient));
app.get('/invoice/person/delete', person.delete(mongoClient));

// Invoices
app.get('/invoice/list', invoice.list(mongoClient));
app.get('/invoice/add', invoice.addForm(mongoClient));
app.post('/invoice/add', invoice.add(mongoClient));
app.get('/invoice/remove', invoice.remove(mongoClient));

// Invoice items
app.get('/invoice/item/list', item.list(mongoClient));
app.get('/invoice/item/add', item.addForm(mongoClient));
app.post('/invoice/item/add', item.add(mongoClient));
app.get('/item/remove', item.remove(mongoClient));

// JSON data for client side JS.
app.get('/invoice/people', invoice.people(mongoClient));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



