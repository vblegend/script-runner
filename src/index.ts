/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 脚本的执行上下文环境
 * 被注册的对象可以在脚本中直接以名称访问
 */
 export class ScriptEvalContext {
    private registerNames: string[] = [];
    private registerValues: any[] = [];

    /**
     * 创建一个脚本执行上下文对象
     * @param baseContext 从一个旧的复制所有注册环境
     */
    constructor(baseContext?: ScriptEvalContext) {
        if (baseContext) {
            this.registerNames = baseContext.names;
            this.registerValues = baseContext.values;
        } else {
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

    /**
     * 注册一个变量/对象/函数 到脚本的执行上下文中\
     * 不要注册值类型，值类型只能作为常量 不能修改。
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
     * 移除一个已注册的对象
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
     * 获取一个注册的对象
     */
    public get(name: string): any {
        const index = this.registerNames.indexOf(name);
        if (index > -1) return this.registerValues[index];
        return null;
    }


    /**
     * 获取已注册的所有名字
     */
    public get names(): string[] {
        return this.registerNames.slice();
    }

    /**
     * 获取已注册的所有对象
     */
    public get values(): any[] {
        return this.registerValues.slice();
    }



    public dispose(): void {
        this.registerNames.length = 0;
        this.registerValues.length = 0;
    }


}

/**
 * 支持上下文的脚本执行器工具类
 */
export class EsayEval {

    /**
     * 构建一个脚本方法对象
     * @param script 脚本
     * @param argNames 脚本的参数变量名列表
     * @param thisContext 脚本的this上下文对象
     * @param globalContext 脚本的全局变量对象，上下文中值类型对象在构建后将不可改变。
     * @returns 函数对象
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
     * 执行一个无参数的脚本
     * @param script 脚本
     * @param params 脚本的调用参数
     * @param thisContext 脚本this 上下文对象 
     * @param globalContext 全局上下文对象，上下文中值类型对象在构建后将不可改变。
     * @returns 
     */
    public static eval<TResult>(script: string, params: Record<string, any>, thisContext?: Object, globalContext?: ScriptEvalContext): TResult {
        if (params == null) params = {};
        const func = this.buildFunction(script, Object.keys(params), thisContext, globalContext);
        return func(...Object.values(params));
    }



}