var lib = require('./../dist/app');
var example = require('./asyncCallable');

var getResultObjectByIndex = function(idx, res) {
  if (!(res instanceof lib.Result)) {
    throw new Error('callback required object Result, given another: ' + res);
  }
  return res.getResultByIndex(idx);
};

var getResultObjectByIndexAndParamNum = function(idx, argNumber, res) {
  var res = getResultObjectByIndex(idx, res);
  if ((typeof res !== 'object') || !(res instanceof Array)) {
    throw new Error('callback given not object list for idx: '
      + idx.toString() + ' in response');
  }
  if (res.length <= argNumber) {
    throw new Error('callback given to small arguments in response idx: '
      + idx.toString() + ' given arguments: '
      + res.length.toString() + ' required: '
      + argNumber.toString());
  }
  return res[argNumber];
}

// sync
describe('Test sync Function', function(){
  it("should return number equal 20", function(done){
    var cb = new lib.Sync();
    cb.addFunction(example.baseCb, [10, 10]);
    cb.start(function(results){
      if (!results.isComplete()) {
        throw new Error('problem with isComplete method');
      }
      var resValue = getResultObjectByIndexAndParamNum(0, 0, results);
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
      if (getResultObjectByIndexAndParamNum(0, 0, results) !== 20) {
        throw new Error('bad value response, expect: 20, in idx 0');
      }
      if (getResultObjectByIndexAndParamNum(1, 0, results) !== 21) {
        throw new Error('bad value response, expect: 21, in idx 1');
      }
      if (getResultObjectByIndexAndParamNum(2, 0, results) !== 22) {
        throw new Error('bad value response, expect: 22, in idx 2');
      }
      if (getResultObjectByIndexAndParamNum(3, 0, results) !== 23) {
        throw new Error('bad value response, expect: 23, in idx 3');
      }
      if (getResultObjectByIndexAndParamNum(4, 0, results) !== 24) {
        throw new Error('bad value response, expect: 24, in idx 4');
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
      var resValue = getResultObjectByIndexAndParamNum(0, 0, results);
      if (resValue !== 20) {
        throw new Error('bad value response, expect: 20, given: ' + resValue.toString());
      }
      done();
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
      if (getResultObjectByIndexAndParamNum(0, 0, results) !== 21) {
        throw new Error('bad value response, expect: 21, in idx 0');
      }
      if (getResultObjectByIndexAndParamNum(1, 0, results) !== 22) {
        throw new Error('bad value response, expect: 22, in idx 1');
      }
      if (getResultObjectByIndexAndParamNum(2, 0, results) !== 23) {
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
      var resValue = getResultObjectByIndexAndParamNum(0, 0, results);
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
      if (getResultObjectByIndexAndParamNum(0, 0, results) !== 20) {
        throw new Error('bad value response, expect: 20, in idx 0');
      }
      if (getResultObjectByIndexAndParamNum(1, 0, results) !== 21) {
        throw new Error('bad value response, expect: 21, in idx 1');
      }
      if (getResultObjectByIndexAndParamNum(2, 0, results) !== 22) {
        throw new Error('bad value response, expect: 22, in idx 2');
      }
      if (getResultObjectByIndexAndParamNum(3, 0, results) !== 23) {
        throw new Error('bad value response, expect: 23, in idx 3');
      }
      if (getResultObjectByIndexAndParamNum(4, 0, results) !== 24) {
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
      var resValue = getResultObjectByIndexAndParamNum(0, 0, results);
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
      if (getResultObjectByIndexAndParamNum(0, 0, results) !== 21) {
        throw new Error('bad value response, expect: 21, in idx 0');
      }
      if (getResultObjectByIndexAndParamNum(1, 0, results) !== 22) {
        throw new Error('bad value response, expect: 22, in idx 1');
      }
      if (getResultObjectByIndexAndParamNum(2, 0, results) !== 23) {
        throw new Error('bad value response, expect: 23, in idx 2');
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
