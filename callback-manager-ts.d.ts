declare module "callback-manager-ts"
{
    export = CallbackManagerTs;
}

declare module CallbackManagerTs
{
    class BasicResult
	{
		public getResultByIndex(index:number):any;
		public isComplete():boolean;
    }
    export class Result extends BasicResult
    {
        
    }
	class Manager {
		public constructor(options?:{[key:string]:any});
		public addFunction(func:Function, args:any[], callbackArgIndex?:number);
		public addObjectMethod(obj:Object, methodName:string, args:any[], callbackArgIndex?:number);
		public start(callback?:(results:BasicResult)=>void);
	}
	export class Sync extends Manager
	{
		
	}
	export class Async extends Manager
	{
		
	}
}