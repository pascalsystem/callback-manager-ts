/**
 * Assynchrous example method
 */

var baseCb = function(param1, param2, cb) {
	var res = param1 + param2;
	setTimeout(function(){
		cb(res);
	}, Math.round(Math.random()* 100));
};

var objCb = function(param1) {
	this.param1 = param1;
}
objCb.prototype.get = function(param2, cb) {
	var res = this.param1 + param2;
	setTimeout(function(){
		cb(res);
	}, Math.round(Math.random()* 100));
}

module.exports = {
	baseCb: baseCb,
	objCb: objCb
};