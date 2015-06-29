/// <reference path='./../typings/node/node.d.ts' />
var item = require('./item');
/**
 * The {{#crossLink "BasicResult"}}{{/crossLink}} Manager callback basic results
 *
 * @class BasicResult
 * @param result {Result}
 * @param keys string[]
 * @constructor
 **/
var BasicResult = (function () {
    function BasicResult(result, keys) {
        this.result = result;
        this.keys = keys;
    }
    /**
     * Get result by index
     *
     * @method getResultByIndex
     * @param index {number}
     * @returns {any[]}
     * @public
     */
    BasicResult.prototype.getResultByIndex = function (index) {
        return this.result.getResult(index);
    };
    /**
     * Get result by index key
     *
     * @method getResultByKey
     * @param key {string}
     * @returns {any[]}
     * @public
     */
    BasicResult.prototype.getResultByKey = function (key) {
        var idx = this.keys.indexOf(key);
        if (idx === -1) {
            throw new Error('not defined result key: ' + key);
        }
        return this.getResultByIndex(idx);
    };
    /**
     * Check all callback given result
     *
     * @method isComplete
     * @returns {boolean}
     * @public
     */
    BasicResult.prototype.isComplete = function () {
        return this.result.isComplete();
    };
    /**
     * Get complete callable items
     *
     * @method getCompleteNums
     * @returns {number}
     * @public
     */
    BasicResult.prototype.getCompleteNums = function () {
        return this.result.getCompleteNums();
    };
    return BasicResult;
})();
exports.BasicResult = BasicResult;
/**
 * The {{#crossLink "Result"}}{{/crossLink}} Manager result
 *
 * @class Result
 * @param numItems {number}
 * @constructor
 **/
var Result = (function () {
    function Result() {
        /**
         * Status for callback
         *
         * @property status
         * @type {boolean[]}
         * @default []
         * @private
         */
        this.status = [];
        /**
         * Results data
         *
         * @property results
         * @type {any[][]}
         * @default []
         * @private
         */
        this.results = [];
    }
    /**
     * Get result by index
     *
     * @method getResult
     * @param index {number}
     * @returns {any[]}
     * @public
     */
    Result.prototype.getResult = function (index) {
        if ((typeof this.status[index] === 'undefined') || (!this.status[index])) {
            throw new Error('can`t get result for index: ' + index.toString());
        }
        return this.results[index];
    };
    /**
     * Check all callback given result
     *
     * @method isComplete
     * @returns {boolean}
     * @public
     */
    Result.prototype.isComplete = function () {
        for (var i = 0; i < this.status.length; i++) {
            if ((typeof this.status[i] !== 'boolean') || !this.status[i]) {
                return false;
            }
        }
        return true;
    };
    /**
     * Get number complete callable
     *
     * @method getCompleteNums
     * @returns {number}
     * @public
     */
    Result.prototype.getCompleteNums = function () {
        var res = 0;
        for (var i = 0; i < this.status.length; i++) {
            if ((typeof this.status[i] === 'boolean') && this.status[i]) {
                res++;
            }
        }
        return res;
    };
    /**
     * Set result by index
     *
     * @method setResult
     * @param index {number}
     * @param result {any[]}
     */
    Result.prototype.setResult = function (index, result) {
        if (typeof this.status[index] === 'undefined') {
            throw new Error('can`t set result for undefined item callable');
        }
        this.results[index] = result;
        this.status[index] = true;
    };
    /**
     * Check all results is finished
     *
     * @method checkEnd
     * @returns {boolean}
     * @public
     */
    Result.prototype.checkEnd = function () {
        for (var i = 0; i < this.status.length; i++) {
            if (!this.status[i]) {
                return false;
            }
        }
        return true;
    };
    /**
     * Get next index for item
     *
     * @method getNextIndex
     * @returns {number}
     * @public
     */
    Result.prototype.getNextIndex = function () {
        return this.status.length;
    };
    /**
     * Register next index item
     *
     * @method getNextIndex
     * @returns {number}
     * @public
     */
    Result.prototype.registerNextIndex = function () {
        this.status.push(false);
        this.results.push(undefined);
    };
    return Result;
})();
exports.Result = Result;
/**
 * The {{#crossLink "Manager"}}{{/crossLink}} Manager class for callbacks, see setOptions for more info
 *
 * @class Manager
 * @param options {[key:string]:any}
 * @constructor
 **/
var Manager = (function () {
    function Manager(options) {
        /**
         * List of callable items for execute
         *
         * @property items
         * @type {ItemAbstract[]}
         * @default []
         * @protected
         */
        this.items = [];
        /**
         * Keys data
         *
         * @property keys
         * @type {string[]}
         * @private
         */
        this.keys = [];
        this.results = new Result();
        if (typeof options === 'undefined') {
            options = {};
        }
        this.setOptions(options);
    }
    /**
     * Add callable function
     *
     * @method addFunction
     * @param func {Function} function for call
     * @param args {any[]} arguments for function
     * @param callbackArgIndex {number} index for argument which is callback
     * @public
     */
    Manager.prototype.addFunction = function (func, args, callbackArgIndex) {
        this.addFunctionByKey(undefined, func, args, callbackArgIndex);
    };
    /**
     * Add callable function with index
     *
     * @method addFunction
     * @param key {string}
     * @param func {Function} function for call
     * @param args {any[]} arguments for function
     * @param callbackArgIndex {number} index for argument which is callback
     * @public
     */
    Manager.prototype.addFunctionByKey = function (key, func, args, callbackArgIndex) {
        var nextIndex = this.getNextIndex();
        var element = new item.ItemFunction(func, this, nextIndex, args, callbackArgIndex);
        this.addItemElement(element);
        this.registerKeyIndex(key);
    };
    /**
     * Add callable method for object
     *
     * @method addObjectMethod
     * @param obj {Object} Object with method
     * @param methodName {string} method name for call on object
     * @param args {any[]} arguments for method
     * @param callbackArgIndex {number} index for argument which is callback
     * @public
     */
    Manager.prototype.addObjectMethod = function (obj, methodName, args, callbackArgIndex) {
        this.addObjectMethodByKey(undefined, obj, methodName, args, callbackArgIndex);
    };
    /**
     * Add callable method for object with key
     *
     * @method addObjectMethod
     * @param key {string}
     * @param obj {Object} Object with method
     * @param methodName {string} method name for call on object
     * @param args {any[]} arguments for method
     * @param callbackArgIndex {number} index for argument which is callback
     * @public
     */
    Manager.prototype.addObjectMethodByKey = function (key, obj, methodName, args, callbackArgIndex) {
        var nextIndex = this.getNextIndex();
        var element = new item.ItemObjectMethod(obj, methodName, this, nextIndex, args, callbackArgIndex);
        this.addItemElement(element);
        this.registerKeyIndex(key);
    };
    /**
     * Start execute
     *
     * @method start
     * @param callback {Function} global callback function with all results
     * @public
     */
    Manager.prototype.start = function (callback) {
        if (typeof callback === 'undefined') {
            callback = function (results) { };
        }
        this.setCallback(callback);
        if (this.items.length === 0) {
            this.sendResponse();
            return;
        }
        this.run();
    };
    /**
     * Set options
     *
     * @method setOptions
     * @param options {[key:string]:any}
     * @protected
     */
    Manager.prototype.setOptions = function (options) {
    };
    /**
     * Set callback response class
     *
     * @method setCallbackResponseClass
     * @param responseClass {Class}
     * @protected
     */
    Manager.prototype.setCallbackResponseClass = function (responseClass) {
        this.responseClass = responseClass;
    };
    /**
     * Run callable
     *
     * @method run
     * @protected
     */
    Manager.prototype.run = function () {
        throw new Error('This method is abstract');
    };
    /**
     * Set results for item by callback
     * you can override this data, if you set then before callback
     *
     * @method setResult
     * @param index {number}
     * @param args {any[]}
     * @public
     */
    Manager.prototype.setResultByIndex = function (index, args) {
        throw new Error('This method is abstract');
    };
    /**
     * Check is all item finished and call
     *
     * @method checkEnd
     * @returns {boolean}
     * @private
     */
    Manager.prototype.checkEnd = function () {
        return this.results.checkEnd();
    };
    /**
     * Set results for item by callback
     *
     * @method setResult
     * @param index {number}
     * @param args {any[]}
     * @public
     */
    Manager.prototype.setResult = function (index, args) {
        this.setResultByIndex(index, args);
    };
    /**
     * Save results from item
     *
     * @method saveResult
     * @param index {number}
     * @param results {ResultError|any[]}
     * @protected
     */
    Manager.prototype.saveResult = function (index, results) {
        this.results.setResult(index, results);
    };
    /**
     * Send response to global callback if get all results
     *
     * @method sendResponse
     * @protected
     */
    Manager.prototype.sendResponse = function () {
        if (this.checkEnd()) {
            this.executeCallback();
        }
    };
    /**
     * Execute global callback
     *
     * @method executeCallback
     * @protected
     */
    Manager.prototype.executeCallback = function () {
        this.callback(this.getCallbackResult());
    };
    /**
     * Get callback results with items value
     *
     * @method getCallbackResult
     * @returns {BasicResult}
     * @protected
     */
    Manager.prototype.getCallbackResult = function () {
        var response = new this.responseClass(this.results, this.keys);
        return response;
    };
    /**
     * Set callback for results
     *
     * @method setCallback
     * @param callback {Function} global callback function with all results
     * @private
     */
    Manager.prototype.setCallback = function (callback) {
        this.callback = callback;
    };
    /**
     * Get next index for item
     *
     * @method getNextIndex
     * @returns {number}
     * @private
     */
    Manager.prototype.getNextIndex = function () {
        return this.results.getNextIndex();
    };
    /**
     * Add item element
     *
     * @method addItemElement
     * @param element {ItemAbstract}
     * @private
     */
    Manager.prototype.addItemElement = function (element) {
        this.items.push(element);
        this.results.registerNextIndex();
    };
    /**
     * Add result key index
     *
     * @method registerKeyIndex
     * @param key {string}
     * @private
     */
    Manager.prototype.registerKeyIndex = function (key) {
        if (typeof key === 'string') {
            if (this.keys.indexOf(key) !== -1) {
                throw new Error('result key index: ' + key + ' exists before');
            }
            this.keys.push(key);
        }
        else {
            this.keys.push(undefined);
        }
    };
    return Manager;
})();
exports.Manager = Manager;
