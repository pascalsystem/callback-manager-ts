var lib = require('./../dist/app');
var example = require('./asyncCallable');

describe('Test async Function with break on error', function(){
  it("should return number equal 6/8/10/12/14", function(done){
    var cb = new lib.Sync();
    cb.addFunction(example.baseCbError, [5, 1]);
    cb.addFunction(example.baseCb, [5, 3]);
    cb.addFunction(example.baseCb, [5, 5]);
    cb.addFunction(example.baseCb, [5, 7]);
    cb.addFunction(example.baseCb, [5, 9]);
    cb.start(function(results) {
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      if (example.getResultObjectByIndexAndParamNum(0, 0, results) !== 6) {
        throw new Error('bad value response, expect: 6, in idx 0');
      }
      if (example.getResultObjectByIndexAndParamNum(1, 0, results) !== 8) {
        throw new Error('bad value response, expect: 8, in idx 1');
      }
      if (example.getResultObjectByIndexAndParamNum(2, 0, results) !== 10) {
        throw new Error('bad value response, expect: 10, in idx 2');
      }
      if (example.getResultObjectByIndexAndParamNum(3, 0, results) !== 12) {
        throw new Error('bad value response, expect: 12, in idx 3');
      }
      if (example.getResultObjectByIndexAndParamNum(4, 0, results) !== 14) {
        throw new Error('bad value response, expect: 14, in idx 4');
      }
      
      done();
    });
  });
});
