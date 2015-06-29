var lib = require('./../dist/app');
var example = require('./asyncCallable');

// sync
describe('Test sync Function', function(){
  it("should return number equal 20", function(done){
    var cb = new lib.Sync();
    cb.addFunction(example.baseCb, [10, 10]);
    cb.start(function(results){
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      var resValue = example.getResultObjectByIndexAndParamNum(0, 0, results);
      if (resValue !== 20) {
        throw new Error('bad value response, expect: 20, given: ' + resValue.toString());
      }
      
      done();
    });
  });
  
  it("should return number equal 20/21/22/23/24", function(done){
    var cb = new lib.Sync();
    cb.addFunction(example.baseCb, [10, 10]);
    cb.addFunction(example.baseCb, [10, 11]);
    cb.addFunction(example.baseCb, [10, 12]);
    cb.addFunction(example.baseCb, [10, 13]);
    cb.addFunction(example.baseCb, [10, 14]);
    cb.start(function(results) {
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      if (example.getResultObjectByIndexAndParamNum(0, 0, results) !== 20) {
        throw new Error('bad value response, expect: 20, in idx 0');
      }
      if (example.getResultObjectByIndexAndParamNum(1, 0, results) !== 21) {
        throw new Error('bad value response, expect: 21, in idx 1');
      }
      if (example.getResultObjectByIndexAndParamNum(2, 0, results) !== 22) {
        throw new Error('bad value response, expect: 22, in idx 2');
      }
      if (example.getResultObjectByIndexAndParamNum(3, 0, results) !== 23) {
        throw new Error('bad value response, expect: 23, in idx 3');
      }
      if (example.getResultObjectByIndexAndParamNum(4, 0, results) !== 24) {
        throw new Error('bad value response, expect: 24, in idx 4');
      }
      
      done();
    });
  });

  it("should return number equal 20 - key index result", function(done){
    var cb = new lib.Sync();
    cb.addFunctionByKey('key1', example.baseCb, [10, 10]);
    cb.start(function(results){
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      var resultsData = results.getResultByKey('key1');
      if (typeof resultsData !== 'object' || typeof resultsData.length !== 'number' || resultsData.length !== 1) {
        throw new Error('response result data is not object with one array elements');
      }
      if (resultsData[0] !== 20) {
        throw new Error('bad value response, expect: 20, given: ' + resultsData[0].toString() + ' for key: key1');
      }
      
      done();
    });
  });
  
  it("should return number equal 20/21/22/23/24 - mixed key index result and without", function(done){
    var cb = new lib.Sync();
    cb.addFunction(example.baseCb, [10, 10]);
    cb.addFunction(example.baseCb, [10, 11]);
    cb.addFunctionByKey('k1', example.baseCb, [10, 12]);
    cb.addFunction(example.baseCb, [10, 13]);
    cb.addFunctionByKey('k2', example.baseCb, [10, 14]);
    cb.start(function(results) {
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      if (example.getResultObjectByIndexAndParamNum(0, 0, results) !== 20) {
        throw new Error('bad value response, expect: 20, in idx 0');
      }
      if (example.getResultObjectByIndexAndParamNum(1, 0, results) !== 21) {
        throw new Error('bad value response, expect: 21, in idx 1');
      }
      if (example.getResultObjectByIndexAndParamNum(3, 0, results) !== 23) {
        throw new Error('bad value response, expect: 23, in idx 3');
      }
      
      var resultsData = results.getResultByKey('k1');
      if (typeof resultsData !== 'object' || typeof resultsData.length !== 'number' || resultsData.length !== 1) {
        throw new Error('response result data is not object with one array elements for k1');
      }
      if (resultsData[0] !== 22) {
        throw new Error('bad value response, expect: 22, given: ' + resultsData[0].toString() + ' for key: k1');
      }

      var resultsData = results.getResultByKey('k2');
      if (typeof resultsData !== 'object' || typeof resultsData.length !== 'number' || resultsData.length !== 1) {
        throw new Error('response result data is not object with one array elements for k2');
      }
      if (resultsData[0] !== 24) {
        throw new Error('bad value response, expect: 24, given: ' + resultsData[0].toString() + ' for key: k2');
      }      
      
      done();
    });
  });
});

describe('Test sync Object', function(){
  it("should return number equal 20", function(done){
    var obj = new example.objCb(10);
    var cb = new lib.Sync();
    cb.addObjectMethod(obj, 'get', [10, undefined], 1);
    cb.start(function(results){
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      var resValue = example.getResultObjectByIndexAndParamNum(0, 0, results);
      if (resValue !== 20) {
        throw new Error('bad value response, expect: 20, given: ' + resValue.toString());
      }
      
      done();
    });
  });
  
  it("should return number equal 20 - object key", function(done){
    var obj = new example.objCb(10);
    var cb = new lib.Sync();
    cb.addObjectMethodByKey('k1', obj, 'get', [10, undefined], 1);
    cb.start(function(results){
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      var resultsData = results.getResultByKey('k1');
      if (typeof resultsData !== 'object' || typeof resultsData.length !== 'number' || resultsData.length !== 1) {
        throw new Error('response result data is not object with one array elements for k1');
      }
      if (resultsData[0] !== 20) {
        throw new Error('bad value response, expect: 20, given: ' + resultsData[0].toString() + ' for key: k1');
      }      

      done();
    });
  });
  
  it("should return number equal 20 - object key not exists", function(done){
    var obj = new example.objCb(10);
    var cb = new lib.Sync();
    cb.addObjectMethodByKey('k1', obj, 'get', [10, undefined], 1);
    cb.start(function(results){
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      var resultsData = results.getResultByKey('k1');
      if (typeof resultsData !== 'object' || typeof resultsData.length !== 'number' || resultsData.length !== 1) {
        throw new Error('response result data is not object with one array elements for k1');
      }
      if (resultsData[0] !== 20) {
        throw new Error('bad value response, expect: 20, given: ' + resultsData[0].toString() + ' for key: k1');
      }
      
      try {
        results.getResultByKey('k22');
      } catch (err) {
        done();
        return;
      }
      
      throw new Error('not throw error for key results k22');
    });
  });
  
  it("should return number equal 20/21/22/23/24", function(done){
    var obj = new example.objCb(10);
    var cb = new lib.Sync();
    cb.addObjectMethod(obj, 'get', [11, undefined], 1);
    cb.addObjectMethod(obj, 'get', [12]);
    cb.addObjectMethod(obj, 'get', [13]);
    cb.start(function(results) {
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      if (example.getResultObjectByIndexAndParamNum(0, 0, results) !== 21) {
        throw new Error('bad value response, expect: 21, in idx 0');
      }
      if (example.getResultObjectByIndexAndParamNum(1, 0, results) !== 22) {
        throw new Error('bad value response, expect: 22, in idx 1');
      }
      if (example.getResultObjectByIndexAndParamNum(2, 0, results) !== 23) {
        throw new Error('bad value response, expect: 23, in idx 2');
      }
      done();
    });
  });
});

// async
describe('Test async Function', function(){
  it("should return number equal 20", function(done){
    var cb = new lib.Async();
    cb.addFunction(example.baseCb, [10, 10]);
    cb.start(function(results){
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      var resValue = example.getResultObjectByIndexAndParamNum(0, 0, results);
      if (resValue !== 20) {
        throw new Error('bad value response, expect: 20, given: ' + resValue.toString());
      }
      
      done();
    });
  });
  
  it("should return number equal 20/21/22/23/24", function(done){
    var cb = new lib.Async();
    cb.addFunction(example.baseCb, [10, 10]);
    cb.addFunction(example.baseCb, [10, 11]);
    cb.addFunction(example.baseCb, [10, 12]);
    cb.addFunction(example.baseCb, [10, 13]);
    cb.addFunction(example.baseCb, [10, 14]);
    cb.start(function(results) {
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      if (example.getResultObjectByIndexAndParamNum(0, 0, results) !== 20) {
        throw new Error('bad value response, expect: 20, in idx 0');
      }
      if (example.getResultObjectByIndexAndParamNum(1, 0, results) !== 21) {
        throw new Error('bad value response, expect: 21, in idx 1');
      }
      if (example.getResultObjectByIndexAndParamNum(2, 0, results) !== 22) {
        throw new Error('bad value response, expect: 22, in idx 2');
      }
      if (example.getResultObjectByIndexAndParamNum(3, 0, results) !== 23) {
        throw new Error('bad value response, expect: 23, in idx 3');
      }
      if (example.getResultObjectByIndexAndParamNum(4, 0, results) !== 24) {
        throw new Error('bad value response, expect: 24, in idx 4');
      }
      
      done();
    });
  });
});

describe('Test async Object', function(){
  it("should return number equal 20", function(done){
    var obj = new example.objCb(10);
    var cb = new lib.Async();
    cb.addObjectMethod(obj, 'get', [10, undefined], 1);
    cb.start(function(results){
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      var resValue = example.getResultObjectByIndexAndParamNum(0, 0, results);
      if (resValue !== 20) {
        throw new Error('bad value response, expect: 20, given: ' + resValue.toString());
      }
      done();
    });
  });
  
  it("should return number equal 20/21/22/23/24", function(done){
    var obj = new example.objCb(10);
    var cb = new lib.Async();
    cb.addObjectMethod(obj, 'get', [11, undefined], 1);
    cb.addObjectMethod(obj, 'get', [12]);
    cb.addObjectMethod(obj, 'get', [13]);
    cb.start(function(results) {
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      if (example.getResultObjectByIndexAndParamNum(0, 0, results) !== 21) {
        throw new Error('bad value response, expect: 21, in idx 0');
      }
      if (example.getResultObjectByIndexAndParamNum(1, 0, results) !== 22) {
        throw new Error('bad value response, expect: 22, in idx 1');
      }
      if (example.getResultObjectByIndexAndParamNum(2, 0, results) !== 23) {
        throw new Error('bad value response, expect: 23, in idx 2');
      }
      done();
    });
  });
});

// null result pass to callback
describe('Test Empty', function(){
  it("Sync empty", function(done){
    var testFunction = function(x1, x2, cb){
      var res = x1 + x2;
      setTimeout(function(){
        if (res == 10) {
          return cb(null);
        }
        cb(res);
      }, 100);
    };
    var cb = new lib.Sync();
    cb.addFunction(testFunction, [5,5]);
    cb.addFunction(testFunction, [5,10]);
    cb.start(function(results){
      var res1 = example.getResultObjectByIndexAndParamNum(0, 0, results);
      var res2 = example.getResultObjectByIndexAndParamNum(1, 0, results);
      
      if (res1 !== null) {
        throw new Error('result from idx 0 is not equal null');
      }
      if (res2 !== 15) {
        throw new Error('result from idx 1 is not equal 15');
      }
      
      done();
    });
  });
});

// empty
describe('Test Empty', function(){
  it("Sync empty", function(done){
    var cb = new lib.Sync();
    cb.start(function(results){
      done();
    });
  });
  
  it("Async empty", function(done){
    var cb = new lib.Async();
    cb.start(function(results){
      done();
    });
  });
});

//async break
describe('Test async Function with break on error', function(){
  it("should return number equal 5 / Error and break queue", function(done){
    var cb = new lib.AsyncBreak();
    cb.addFunction(example.baseCbError, [4, 1, undefined], 2, 0);
    cb.addFunction(example.baseCbError, [4, 2, undefined], 2, 0);
    cb.addFunction(example.baseCbError, [4, 3, undefined], 2, 0);
    cb.start(function(results){
      throw new Error('not expect success callback');
    },function(results) {
      if (results.isComplete() !== false) {
        throw new Error('this results expect not complete, but given completed');
      }
      if (results.getCompleteNums() !== 2) {
        throw new Error('this results expect only two callable complete');
      }
      
      var args1 = results.getResultByIndex(0);
      var args2 = results.getResultByIndex(1);
      if ((args1.length !== 2) || (args2.length !== 2)) {
        throw new Error('results required two arguments');
      }
      if ((args1[0] !== null) || (args1[1] !== 5)) {
        throw new Error('first result required object [null, 5]');
      }
      if (!(args2[0] instanceof Error) || (args2[1] !== null)) {
        throw new Error('first result required object [Error, null]');
      }
      
      done();
    });
  });

  it("should return number equal 10/11/12", function(done){
    var cb = new lib.AsyncBreak();
    cb.addFunction(example.baseCbError, [5, 5, undefined], 2, 0);
    cb.addFunction(example.baseCbError, [5, 6, undefined], 2, 0);
    cb.addFunction(example.baseCbError, [5, 7, undefined], 2, 0);
    cb.start(function(results) {
      if (results.isComplete() !== true) {
        throw new Error('not completed response results');
      }
      if (example.getResultObjectByIndexAndParamNum(0, 1, results) !== 10) {
        throw new Error('result for first callable diffrent then 10');
      }
      if (example.getResultObjectByIndexAndParamNum(1, 1, results) !== 11) {
        throw new Error('result for first callable diffrent then 11');
      }
      if (example.getResultObjectByIndexAndParamNum(2, 1, results) !== 12) {
        throw new Error('result for first callable diffrent then 12');
      }
      
      done();
    }, function(results) {
      throw new Error('not expect error callback');
    });
  });
});
