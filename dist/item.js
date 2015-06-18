/// <reference path='./../typings/node/node.d.ts' />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
 * The {{#crossLink "ItemAbstract"}}{{/crossLink}} Item callable abstract
 *
 * @class ItemAbstract
 * @param manager {Manager}
 * @param index {number}
 * @param args {any[]}
 * @param callbackArgIndex {number}
 * @constructor
 **/
var ItemAbstract = (function () {
    function ItemAbstract(manager, index, args, callbackArgIndex) {
        if (typeof callbackArgIndex === 'undefined') {
            callbackArgIndex = args.length;
        }
        if (callbackArgIndex < 0) {
            throw new Error('arguments for callback is less then 0 for index: ' + index.toString() + ', not supported');
        }
        if ((typeof callbackArgIndex !== 'number') || (args.length < callbackArgIndex) || (typeof args[callbackArgIndex] !== 'undefined')) {
            throw new Error('arguments for callback index: ' + index.toString() + ' is defined, please set `undefined`');
        }
        this.manager = manager;
        this.index = index;
        this.args = args;
        var self = this;
        this.args[callbackArgIndex] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            self.manager.setResult(self.index, args);
        };
    }
    /**
     * Start item execute
     *
     * @method start
     * @public
     */
    ItemAbstract.prototype.start = function () {
        throw new Error('This method is abstract');
    };
    return ItemAbstract;
})();
exports.ItemAbstract = ItemAbstract;
/**
 * The {{#crossLink "ItemFunction"}}{{/crossLink}} Item callable function
 *
 * @class ItemFunction
 * @extends ItemAbstract
 * @param func {Function}
 * @param manager {Manager}
 * @param index {number}
 * @param args {any[]}
 * @param callbackArgIndex {number}
 * @constructor
 **/
var ItemFunction = (function (_super) {
    __extends(ItemFunction, _super);
    function ItemFunction(func, manager, index, args, callbackArgIndex) {
        _super.call(this, manager, index, args, callbackArgIndex);
        this.func = func;
    }
    /**
     * Start item execute
     *
     * @method start
     * @public
     */
    ItemFunction.prototype.start = function () {
        this.func.apply(this, this.args);
    };
    return ItemFunction;
})(ItemAbstract);
exports.ItemFunction = ItemFunction;
/**
 * The {{#crossLink "ItemFunction"}}{{/crossLink}} Item callable object method
 *
 * @class ItemObjectMethod
 * @extends ItemAbstract
 * @param manager {Manager}
 * @param index {number}
 * @param args {any[]}
 * @param callbackArgIndex {number}
 * @param obj {Object}
 * @param methodName {string}
 * @constructor
 **/
var ItemObjectMethod = (function (_super) {
    __extends(ItemObjectMethod, _super);
    function ItemObjectMethod(obj, methodName, manager, index, args, callbackArgIndex) {
        _super.call(this, manager, index, args, callbackArgIndex);
        this.obj = obj;
        this.methodName = methodName;
    }
    /**
     * Start item execute
     *
     * @method start
     * @public
     */
    ItemObjectMethod.prototype.start = function () {
        this.obj[this.methodName].apply(this.obj, this.args);
    };
    return ItemObjectMethod;
})(ItemAbstract);
exports.ItemObjectMethod = ItemObjectMethod;
