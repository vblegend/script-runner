export declare class ScriptEvalContext {
    private registerNames;
    private registerValues;
    constructor(baseContext?: ScriptEvalContext, initLib?: boolean);
    clear(): void;
    register(name: string, object: any): void;
    remove(name: string): void;
    get(name: string): any;
    get names(): string[];
    get values(): any[];
}
export declare class ScriptRunner {
    static buildFunction(script: string, argNames?: string[], thisContext?: Object, globalContext?: ScriptEvalContext): Function;
    static eval<TResult>(script: string, parameters: Record<string, any>, thisContext?: Object, globalContext?: ScriptEvalContext): TResult;
    private static getProperties;
}
