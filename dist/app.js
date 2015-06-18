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
         * @private
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
