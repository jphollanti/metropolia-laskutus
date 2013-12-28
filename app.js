
/**
 * Module dependencies.
 */

var express = require('express');

var invoice = require('./routes/invoice');
var person = require('./routes/invoice/person');
var customer = require('./routes/invoice/customer');

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

app.get('/', invoice.index());
app.get('/invoice/person', person.person(mongoClient));
app.get('/invoice/invoice', invoice.invoice(mongoClient));
app.get('/invoice/product', invoice.product(mongoClient));

app.get('/invoice/customer/list', customer.list(mongoClient));
app.get('/invoice/customer/add', customer.addForm());
app.post('/invoice/customer/add', customer.add(mongoClient));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
