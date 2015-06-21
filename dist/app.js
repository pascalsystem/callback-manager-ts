/// <reference path='./../typings/node/node.d.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var manager = require('./manager');
/**
 * The {{#crossLink "Result"}}{{/crossLink}} Manager callback results
 *
 * @class Result
 * @extends BasicResult
 * @constructor
 **/
var Result = (function (_super) {
    __extends(Result, _super);
    function Result() {
        _super.apply(this, arguments);
    }
    return Result;
})(manager.BasicResult);
exports.Result = Result;
/**
 * The {{#crossLink "Sync"}}{{/crossLink}} Manager synchronous callback
 *
 * @class Sync
 * @extends Manager
 * @param options {[key:string]:any}
 * @constructor
 **/
var Sync = (function (_super) {
    __extends(Sync, _super);
    function Sync(options) {
        _super.call(this, options);
        this.setCallbackResponseClass(Result);
    }
    /**
     * Run synchronous items
     *
     * @method run
     * @protected
     */
    Sync.prototype.run = function () {
        for (var i = 0; i < this.items.length; i++) {
            this.items[i].start();
        }
    };
    /**
     * Set results for item by callback
     *
     * @method setResult
     * @param index {number}
     * @param args {any[]}
     * @public
     */
    Sync.prototype.setResultByIndex = function (index, args) {
        this.saveResult(index, args);
        this.sendResponse();
    };
    return Sync;
})(manager.Manager);
exports.Sync = Sync;
/**
 * The {{#crossLink "Async"}}{{/crossLink}} Manager asynchronous callback
 *
 * @class Async
 * @extends Manager
 * @param options {[key:string]:any}
 * @constructor
 **/
var Async = (function (_super) {
    __extends(Async, _super);
    function Async(options) {
        _super.call(this, options);
        /**
         * Current index for item process
         *
         * @property currentIndex
         * @type {number}
         * @default 0
         * @protected
         */
        this.currentIndex = 0;
        this.setCallbackResponseClass(Result);
    }
    /**
     * Run asynchronous items
     *
     * @method run
     * @protected
     */
    Async.prototype.run = function () {
        this.items[this.currentIndex].start();
    };
    /**
     * Set results for item by callback
     *
     * @method setResult
     * @param index {number}
     * @param args {any[]}
     * @public
     */
    Async.prototype.setResultByIndex = function (index, args) {
        this.saveResult(index, args);
        if (!this.checkEnd()) {
            this.currentIndex++;
            this.items[this.currentIndex].start();
        }
        else {
            this.sendResponse();
        }
    };
    return Async;
})(manager.Manager);
exports.Async = Async;
/**
 * The {{#crossLink "AsyncBreak"}}{{/crossLink}} Manager asynchronous callback with break
 *
 * @class AsyncBreak
 * @extends Async
 * @param options {[key:string]:any}
 * @constructor
 **/
var AsyncBreak = (function (_super) {
    __extends(AsyncBreak, _super);
    function AsyncBreak(options) {
        _super.call(this, options);
        /**
         * Error argument numbers
         *
         * @property errorArgumentNums
         * @type {number[]}
         * @default []
         * @protected
         */
        this.errorArgumentNums = [];
    }
    /**
     * Start execute
     *
     * @method start
     * @param callback {Function} global callback function with all results
     * @param errorCallback {Function} global error callback function with results
     * @public
     */
    AsyncBreak.prototype.start = function (callback, errorCallback) {
        _super.prototype.start.call(this, callback);
        this.errorCallback = errorCallback;
    };
    /**
     * Execute global callback
     *
     * @method executeCallback
     * @protected
     */
    AsyncBreak.prototype.executeCallback = function () {
        if (this.results.isComplete()) {
            return this.callback(this.getCallbackResult());
        }
        if (typeof this.errorCallback === 'function') {
            this.errorCallback(this.getCallbackResult());
        }
    };
    /**
     * Add callable function
     *
     * @method addFunction
     * @param func {Function} function for call
     * @param args {any[]} arguments for function
     * @param callbackArgIndex {number} index for argument which is callback
     * @param errorArgumentIndex {number} error argument index
     * @public
     */
    AsyncBreak.prototype.addFunction = function (func, args, callbackArgIndex, errorArgumentIndex) {
        _super.prototype.addFunction.call(this, func, args, callbackArgIndex);
        this.setErrorArgumentIndex(errorArgumentIndex);
    };
    /**
     * Add callable method for object
     *
     * @method addObjectMethod
     * @param obj {Object} Object with method
     * @param methodName {string} method name for call on object
     * @param args {any[]} arguments for method
     * @param callbackArgIndex {number} index for argument which is callback
     * @param errorArgumentIndex {number} error argument index
     * @public
     */
    AsyncBreak.prototype.addObjectMethod = function (obj, methodName, args, callbackArgIndex, errorArgumentIndex) {
        _super.prototype.addObjectMethod.call(this, obj, methodName, args, callbackArgIndex);
        this.setErrorArgumentIndex(errorArgumentIndex);
    };
    /**
     * Set results for item by callback
     *
     * @method setResult
     * @param index {number}
     * @param args {any[]}
     * @public
     */
    AsyncBreak.prototype.setResultByIndex = function (index, args) {
        this.saveResult(index, args);
        if (this.checkEnd()) {
            this.sendResponse();
            return;
        }
        if ((index < this.errorArgumentNums.length) && (typeof this.errorArgumentNums[index] === 'number')
            && (this.errorArgumentNums[index] < args.length) && args[this.errorArgumentNums[index]]) {
            this.executeCallback();
            return;
        }
        this.currentIndex++;
        this.items[this.currentIndex].start();
    };
    /**
     * Set error argument index
     *
     * @method setErrorArgumentIndex
     * @param errorArgumentIndex {number}
     * @private
     */
    AsyncBreak.prototype.setErrorArgumentIndex = function (errorArgumentIndex) {
        this.errorArgumentNums[this.items.length - 1] = errorArgumentIndex;
    };
    return AsyncBreak;
})(Async);
exports.AsyncBreak = AsyncBreak;
