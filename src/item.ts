/// <reference path='./../typings/node/node.d.ts' />

import manager = require('./manager');

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
export class ItemAbstract
{
	/**
	 * Callback manager
	 * 
	 * @property manager
	 * @type {Manager}
	 * @protected
	 */
	protected manager:manager.Manager;
	/**
	 * Index for item
	 * 
	 * @property manager
	 * @type {number}
	 * @protected
	 */
	protected index:number;
	/**
	 * Arguments for callable
	 * 
	 * @property args
	 * @type {any[]}
	 * @protected
	 */
	protected args:any[];
	/**
	 * Callable function
	 * 
	 * @property callableFunc
	 * @type {Function}
	 * @protected
	 */
	protected callableFunc:Function;
	
	public constructor(manager:manager.Manager, index:number, args:any[], callbackArgIndex?:number)
	{
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
		var self:ItemAbstract = this;
		this.args[callbackArgIndex] = (...args:any[]) => {
			self.manager.setResult(self.index, args);
		};
	}
	
	/**
	 * Start item execute
	 * 
	 * @method start
	 * @public
	 */
	public start():void
	{
		throw new Error('This method is abstract');
	}
}

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
export class ItemFunction extends ItemAbstract
{
	/**
	 * Callable function
	 * 
	 * @property func
	 * @type {Function}
	 * @private
	 */
	private func:Function;
	
	constructor(func:Function, manager:manager.Manager, index:number, args:any[], callbackArgIndex?:number)
	{
		super(manager, index, args, callbackArgIndex);
		this.func = func;
	}

	/**
	 * Start item execute
	 * 
	 * @method start
	 * @public
	 */
	public start()
	{
		this.func.apply(this, this.args);
	}
}

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
export class ItemObjectMethod extends ItemAbstract
{
	/**
	 * Callable object
	 * 
	 * @property obj
	 * @type {Object}
	 * @protected
	 */
	private obj:Object;
	/**
	 * Callable Method
	 * 
	 * @property method
	 * @type {Object}
	 * @private
	 */
	private methodName:string;
	
	constructor(obj:Object, methodName:string, manager:manager.Manager, index:number, args:any[], callbackArgIndex?:number)
	{
		super(manager, index, args, callbackArgIndex);
		this.obj = obj;
		this.methodName = methodName;
	}
	
	/**
	 * Start item execute
	 * 
	 * @method start
	 * @public
	 */
	public start()
	{
		this.obj[this.methodName].apply(this.obj, this.args);
	}
}
