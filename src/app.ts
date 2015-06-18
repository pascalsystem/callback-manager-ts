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
	 * @private
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
