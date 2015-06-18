/// <reference path='./../typings/node/node.d.ts' />

import item = require('./item');

/**
 * The {{#crossLink "BasicResult"}}{{/crossLink}} Manager callback basic results
 *
 * @class BasicResult
 * @param result {Result}
 * @constructor
 **/
export class BasicResult
{
	/**
	 * Result
	 * 
	 * @property result
	 * @type {Result}
	 * @private
	 */
	private result:Result
	
	constructor(result:Result)
	{
		this.result = result;		
	}
	
	/**
	 * Get result by index
	 * 
	 * @method getResultByIndex
	 * @param index {number}
	 * @returns {any[]}
	 * @public
	 */
	public getResultByIndex(index:number)
	{
		return this.result.getResult(index);
	}
	
	/**
	 * Check all callback given result
	 * 
	 * @method isComplete
	 * @returns {boolean} 
	 * @public
	 */
	public isComplete():boolean
	{
		return this.result.isComplete();
	}
}

/**
 * The {{#crossLink "Result"}}{{/crossLink}} Manager result
 *
 * @class Result
 * @param numItems {number}
 * @constructor
 **/
export class Result
{
	/**
	 * Status for callback
	 * 
	 * @property status
	 * @type {boolean[]}
	 * @default []
	 * @private
	 */
	private status:boolean[] = [];
	/**
	 * Results data
	 * 
	 * @property results
	 * @type {any[][]}
	 * @default []
	 * @private
	 */
	private results:any[][] = [];
	
	public constructor()
	{
		
	}
	
	/**
	 * Get result by index
	 * 
	 * @method getResult
	 * @param index {number}
	 * @returns {any[]}
	 * @public
	 */
	public getResult(index:number):any[]
	{
		if ((typeof this.status[index] === 'undefined') || (!this.status[index])) {
			throw new Error('can`t get result for index: ' + index.toString());
		}
		return this.results[index];
	}
	
	/**
	 * Check all callback given result
	 * 
	 * @method isComplete
	 * @returns {boolean} 
	 * @public
	 */
	public isComplete():boolean
	{
		for (var i=0;i<this.status.length;i++) {
			if ((typeof this.status[i] !== 'boolean') || !this.status[i]) {
				return false;
			}
		}
		
		return true;
	}
	
	/**
	 * Set result by index
	 * 
	 * @method setResult
	 * @param index {number}
	 * @param result {any[]}
	 */
	public setResult(index:number, result:any[])
	{
		if (typeof this.status[index] === 'undefined') {
			throw new Error('can`t set result for undefined item callable');
		}
		this.results[index] = result;
		this.status[index] = true;
	}
	
	/**
	 * Check all results is finished
	 * 
	 * @method checkEnd
	 * @returns {boolean}
	 * @public
	 */
	public checkEnd():boolean
	{
		for (var i=0;i<this.status.length;i++) {
			if (!this.status[i]) {
				return false;
			}
		}
		return true;
	}
	
	/**
	 * Get next index for item
	 * 
	 * @method getNextIndex
	 * @returns {number}
	 * @public
	 */
	public getNextIndex():number
	{
		return this.status.length;
	}
	
	/**
	 * Register next index item
	 * 
	 * @method getNextIndex
	 * @returns {number}
	 * @public
	 */
	public registerNextIndex()
	{
		this.status.push(false);
		this.results.push(undefined);
	}
}

/**
 * The {{#crossLink "Manager"}}{{/crossLink}} Manager class for callbacks, see setOptions for more info
 *
 * @class Manager
 * @param options {[key:string]:any}
 * @constructor
 **/
export class Manager
{
	/**
	 * Results for callback
	 * 
	 * @property status
	 * @type {Result}
	 * @protected
	 */
	protected results:Result;
	/**
	 * List of callable items for execute
	 * 
	 * @property items
	 * @type {ItemAbstract[]}
	 * @default []
	 * @protected
	 */
	protected items:item.ItemAbstract[] = [];
	/**
	 * Global callback for all items
	 * 
	 * @property callback
	 * @type {Function}
	 * @protected
	 */
	protected callback:(results:BasicResult)=>void;
	/**
	 * Result class
	 * 
	 * @property responseClass
	 * @type {Class}
	 * @private
	 */
	private responseClass:new (result:Result) => BasicResult;
	
	public constructor(options?:{[key:string]:any})
	{
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
	public addFunction(func:Function, args:any[], callbackArgIndex?:number)
	{
		var nextIndex = this.getNextIndex();
		var element:item.ItemFunction = new item.ItemFunction(func, this, nextIndex, args, callbackArgIndex);
		this.addItemElement(element);
	}
	
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
	public addObjectMethod(obj:Object, methodName:string, args:any[], callbackArgIndex?:number)
	{
		var nextIndex = this.getNextIndex();
		var element:item.ItemObjectMethod = new item.ItemObjectMethod(obj, methodName, this, nextIndex, args, callbackArgIndex);
		this.addItemElement(element);
	}
	
	/**
	 * Start execute
	 * 
	 * @method start
	 * @param callback {Function} global callback function with all results
	 * @public
	 */
	public start(callback?:(results:BasicResult)=>void)
	{
		this.setCallback(callback);
		if (this.items.length === 0) {
			this.sendResponse();
			return;
		}
		this.run();
	}
	
	/**
	 * Set options
	 * 
	 * @method setOptions
	 * @param options {[key:string]:any}
	 * @protected
	 */
	protected setOptions(options:{[key:string]:any})
	{
		
	}
	
	/**
	 * Set callback response class
	 * 
	 * @method setCallbackResponseClass
	 * @param responseClass {Class}
	 * @protected
	 */
	protected setCallbackResponseClass(responseClass:new (result:Result) => BasicResult)
	{
		this.responseClass = responseClass;
	}
	
	/**
	 * Run callable
	 * 
	 * @method run
	 * @protected
	 */
	protected run()
	{
		throw new Error('This method is abstract');
	}
	
	/**
	 * Set results for item by callback
	 * you can override this data, if you set then before callback
	 * 
	 * @method setResult
	 * @param index {number}
	 * @param args {any[]}
	 * @public
	 */
	protected setResultByIndex(index:number, args:any[])
	{
		throw new Error('This method is abstract');
	}
	
	/**
	 * Check is all item finished and call
	 * 
	 * @method checkEnd
	 * @returns {boolean}
	 * @private
	 */
	protected checkEnd():boolean
	{
		return this.results.checkEnd();
	}
	
	/**
	 * Set results for item by callback
	 * 
	 * @method setResult
	 * @param index {number}
	 * @param args {any[]}
	 * @public
	 */
	public setResult(index:number, args:any[])
	{
		this.setResultByIndex(index, args);
	}
	
	/**
	 * Save results from item
	 * 
	 * @method saveResult
	 * @param index {number}
	 * @param results {ResultError|any[]}
	 * @protected
	 */
	protected saveResult(index:number, results:any[])
	{
		this.results.setResult(index, results);
	}
	
	/**
	 * Send response to global callback if get all results
	 * 
	 * @method sendResponse
	 * @protected
	 */
	protected sendResponse()
	{
		if (this.checkEnd()) {
			var response:BasicResult = new this.responseClass(this.results);
			this.callback(response);
		}
	}
	
	/**
	 * Set callback for results
	 * 
	 * @method setCallback
	 * @param callback {Function} global callback function with all results
	 * @private
	 */
	private setCallback(callback?:(results:BasicResult)=>void)
	{
		this.callback = callback
	}
	
	/**
	 * Get next index for item
	 * 
	 * @method getNextIndex
	 * @returns {number}
	 * @private
	 */
	private getNextIndex():number
	{
		return this.results.getNextIndex();
	}
	
	/**
	 * Add item element
	 * 
	 * @method addItemElement
	 * @param element {ItemAbstract}
	 * @private
	 */
	private addItemElement(element:item.ItemAbstract)
	{
		this.items.push(element);
		this.results.registerNextIndex();
	}	
}
