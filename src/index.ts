/**
* The execution context of the script
* Registered objects can be accessed directly by name in scripts
 */
export class ScriptEvalContext {
    private registerNames: string[] = [];
    private registerValues: any[] = [];

    /**
     * Create a script execution context object
     * @param baseContext Copy all registered environments from an old one
     * @param initLib Initialize the default library
     */
    constructor(baseContext?: ScriptEvalContext, initLib?: boolean) {
        if (baseContext) {
            this.registerNames = baseContext.names;
            this.registerValues = baseContext.values;
        } else if (initLib) {
            this.register('$floor', Math.floor);
            this.register('$random', Math.random);
            this.register('$max', Math.max);
            this.register('$min', Math.min);
            this.register('$round', Math.round);
            this.register('$abs', Math.abs);
            this.register('$pow', Math.pow);
            this.register('$log', console.log);
            this.register('$error', console.error);
            this.register('$warn', console.warn);
            this.register('$vars', {});
        }
    }


    public clear(): void {
        this.registerNames.length = 0;
        this.registerValues.length = 0;
    }

    /**
     * Register a variable/object/function into the execution context of the script \
     * Do not register value types. Value types can only be treated as constants and cannot be modified.
     * @param name 名字
     * @param object 对象
     */
    public register(name: string, object: any): void {
        const index = this.registerNames.indexOf(name);
        if (index > -1) {
            console.warn(`ScriptEvalContext => The keyword “${name}” already exists, the original record is overwritten.`);
            this.registerValues[index] = object;
        } else {
            this.registerNames.push(name);
            this.registerValues.push(object);
        }
    }

    /**
     * Removes a registered object
     * @param name 
     */
    public remove(name: string): void {
        const index = this.registerNames.indexOf(name);
        if (index > -1) {
            this.registerNames.splice(index, 1);
            this.registerValues.splice(index, 1);
        }
    }

    /**
     * Gets a registered object
     */
    public get(name: string): any {
        const index = this.registerNames.indexOf(name);
        if (index > -1) return this.registerValues[index];
        return null;
    }

    /**
     * Gets all registered names
     */
    public get names(): string[] {
        return this.registerNames.slice();
    }

    /**
     * Gets all registered objects
     */
    public get values(): any[] {
        return this.registerValues.slice();
    }
}

/**
 * Context-enabled script executor
 */
export class ScriptRunner {

    /**
     * Build a script method object
     * @param script script
     * @param argNames A list of parameter variable names for the script
     * @param thisContext This context object for the script
     * @param globalContext The global variable object of the script, the context value type object will be immutable after the build.
     * @returns The function object
     */
    public static buildFunction(script: string, argNames?: string[], thisContext?: Object, globalContext?: ScriptEvalContext): Function {
        const globalVars = globalContext ? globalContext.names.join(', ') : '';
        const globalVarValues = globalContext ? globalContext.values : [];
        const funcScript = `function $MAIN______FUNCTION(${argNames ? argNames.join(', ') : ''}){\n${script}\n}\nreturn $MAIN______FUNCTION;`
        const func = Function(globalVars, funcScript);
        const myFunction = func(...globalVarValues);
        return thisContext ? myFunction.bind(thisContext) : myFunction;
    }


    /**
     * Execute a script with no arguments
     * @param script script
     * @param parameters The call parameters of the script
     * @param thisContext This context object for the script 
     * @param globalContext The global context object, the context value type object will be immutable after construction.
     * @returns execution result
     */
    public static eval<TResult>(script: string, parameters: Record<string, any>, thisContext?: Object, globalContext?: ScriptEvalContext): TResult {
        if (parameters == null) parameters = {};
        const properties = ScriptRunner.getProperties(parameters);
        const func = this.buildFunction(script, properties.keys, thisContext, globalContext);
        return func(...properties.values);
    }


    private static getProperties(parameters: Record<string, any>): { keys: string[], values: any[] } {
        const result: { keys: string[], values: any[] } = { keys: [], values: [] };
        for (const key in parameters) {
            result.keys.push(key);
            result.values.push(parameters[key]);
        }
        return result;
    }

}