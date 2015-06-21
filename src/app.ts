/// <reference path='./../typings/node/node.d.ts' />

import manager = require('./manager');

/**
 * The {{#crossLink "Result"}}{{/crossLink}} Manager callback results
 *
 * @class Result
 * @extends BasicResult
 * @constructor
 **/
export class Result extends manager.BasicResult
{
	
}

/**
 * The {{#crossLink "Sync"}}{{/crossLink}} Manager synchronous callback
 *
 * @class Sync
 * @extends Manager
 * @param options {[key:string]:any}
 * @constructor
 **/
export class Sync extends manager.Manager
{
	public constructor(options?:{[key:string]:any})
	{
		super(options);
		this.setCallbackResponseClass(Result);
	}
	
	/**
	 * Run synchronous items
	 * 
	 * @method run
	 * @protected
	 */
	protected run()
	{
		for (var i=0;i<this.items.length;i++) {
			this.items[i].start();
		}
	}
	
	/**
	 * Set results for item by callback
	 * 
	 * @method setResult
	 * @param index {number}
	 * @param args {any[]}
	 * @public
	 */
	protected setResultByIndex(index:number, args:any[]) {
		this.saveResult(index, args);
		this.sendResponse();
	}
}

/**
 * The {{#crossLink "Async"}}{{/crossLink}} Manager asynchronous callback
 *
 * @class Async
 * @extends Manager
 * @param options {[key:string]:any}
 * @constructor
 **/
export class Async extends manager.Manager
{
	/**
	 * Current index for item process
	 * 
	 * @property currentIndex
	 * @type {number}
	 * @default 0
	 * @protected
	 */
	protected currentIndex:number = 0;
	
	public constructor(options?:{[key:string]:any})
	{
		super(options);
		this.setCallbackResponseClass(Result);
	}
	
	/**
	 * Run asynchronous items
	 * 
	 * @method run
	 * @protected
	 */
	protected run()
	{
		this.items[this.currentIndex].start();
	}
	
	/**
	 * Set results for item by callback
	 * 
	 * @method setResult
	 * @param index {number}
	 * @param args {any[]}
	 * @public
	 */
	protected setResultByIndex(index:number, args:any[])
	{
		this.saveResult(index, args);
		if (!this.checkEnd()) {
			this.currentIndex++;
			this.items[this.currentIndex].start();
		} else {
			this.sendResponse();
		}
	}
}

/**
 * The {{#crossLink "AsyncBreak"}}{{/crossLink}} Manager asynchronous callback with break
 *
 * @class AsyncBreak
 * @extends Async
 * @param options {[key:string]:any}
 * @constructor
 **/
export class AsyncBreak extends Async
{
	/**
	 * Error argument numbers
	 * 
	 * @property errorArgumentNums
	 * @type {number[]}
	 * @default []
	 * @protected
	 */
	protected errorArgumentNums:number[] = [];
	/**
	 * Error callback
	 * 
	 * @property errorCallback
	 * @type {Function}
	 * @protected
	 */
	protected errorCallback:Function;
	
	public constructor(options?:{[key:string]:any})
	{
		super(options);
	}
	
	/**
	 * Start execute
	 * 
	 * @method start
	 * @param callback {Function} global callback function with all results
	 * @param errorCallback {Function} global error callback function with results
	 * @public
	 */
	public start(callback?:(results:manager.BasicResult)=>void, errorCallback?:(results:manager.BasicResult)=>void)
	{
		super.start(callback);
		this.errorCallback = errorCallback;
	}
	
	/**
	 * Execute global callback
	 * 
	 * @method executeCallback
	 * @protected
	 */
	protected executeCallback()
	{
		if (this.results.isComplete()) {
			return this.callback(this.getCallbackResult());
		}
		if (typeof this.errorCallback === 'function') {
			this.errorCallback(this.getCallbackResult());
		}
	}
	
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
	public addFunction(func:Function, args:any[], callbackArgIndex?:number, errorArgumentIndex?:number)
	{
		super.addFunction(func, args, callbackArgIndex);
		this.setErrorArgumentIndex(errorArgumentIndex);
	}
	
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
	public addObjectMethod(obj:Object, methodName:string, args:any[], callbackArgIndex?:number, errorArgumentIndex?:number)
	{
		super.addObjectMethod(obj, methodName, args, callbackArgIndex);
		this.setErrorArgumentIndex(errorArgumentIndex);
	}
	
	/**
	 * Set results for item by callback
	 * 
	 * @method setResult
	 * @param index {number}
	 * @param args {any[]}
	 * @public
	 */
	protected setResultByIndex(index:number, args:any[])
	{
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
	}
	
	/**
	 * Set error argument index
	 * 
	 * @method setErrorArgumentIndex
	 * @param errorArgumentIndex {number}
	 * @private
	 */
	private setErrorArgumentIndex(errorArgumentIndex?:number)
	{
		this.errorArgumentNums[this.items.length-1] = errorArgumentIndex;
	}	
}