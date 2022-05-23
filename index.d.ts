


export declare class ScriptEvalContext {

    constructor(baseContext?: ScriptEvalContext);
    /**
     * register a function or field
     * @param name 
     * @param object 
     */
    public register(name: string, object: any): void;

    public remove(name: string): void;

    public get(name: string): any;

    public get names(): string[];

    public get values(): any[];

    public dispose(): void;
}





export declare abstract class EsayEval {

    public static buildFunction(script: string, argNames?: string[], thisContext?: Object, globalContext?: ScriptEvalContext): Function;

    public static eval<TResult>(script: string, params: Record<string, any>, thisContext?: Object, globalContext?: ScriptEvalContext): TResult;
}

