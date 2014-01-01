exports.connect = function(mongoClient, callback) {
  mongoClient.connect("mongodb://localhost:27017/metropolia-laskutus", function(err, db) {
    if (err) {
      throw err;
    }
    callback(err, db);
  });
}

