var lib = require('./../dist/app');

var baseCb = function(param1, param2, cb) {
	var res = param1 + param2;
	setTimeout(function(){
		cb(res);
	}, Math.round(Math.random()* 100));
};

var baseCbError = function(param1, param2, cb) {
	var res = param1 + param2;
	setTimeout(function(){
    if (res == 6) {
      return cb(new Error('result is equal 6'), null);
    }
    cb(null, res);
	}, Math.round(Math.random()* 100));
};

var objCb = function(param1) {
	this.param1 = param1;
};
objCb.prototype.get = function(param2, cb) {
	var res = this.param1 + param2;
	setTimeout(function(){
		cb(res);
	}, Math.round(Math.random()* 100));
};

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

module.exports = {
	baseCb: baseCb,
  baseCbError: baseCbError,
	objCb: objCb,
	getResultObjectByIndexAndParamNum: getResultObjectByIndexAndParamNum
};
