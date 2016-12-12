const assert = require('assert');

/**
 * need to have mongodb server running via
 npm run mongo
 **/
describe('MongoDB Layer', function() {

  it('should have a mongodb on localhost with tidelocations collection', function(done) {
    var db = require('mongoskin').db('mongodb://localhost:27017/bt');
    db.collection('tidelocations').find().toArray(function(err, result) {
      if (err) {
        throw err;
      }
      assert(result.length > 0);
      done();
    });
  });

});
