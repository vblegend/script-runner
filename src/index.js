"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
exports.__esModule = true;
exports.ScriptRunner = exports.ScriptEvalContext = void 0;
/**
 * 脚本的执行上下文环境
 * 被注册的对象可以在脚本中直接以名称访问
 */
var ScriptEvalContext = /** @class */ (function () {
    /**
     * 创建一个脚本执行上下文对象
     * @param baseContext 从一个旧的复制所有注册环境
     */
    function ScriptEvalContext(baseContext) {
        this.registerNames = [];
        this.registerValues = [];
        if (baseContext) {
            this.registerNames = baseContext.names;
            this.registerValues = baseContext.values;
        }
        else {
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
    ScriptEvalContext.prototype.register = function (name, object) {
        var index = this.registerNames.indexOf(name);
        if (index > -1) {
            console.warn("ScriptEvalContext => The keyword \u201C".concat(name, "\u201D already exists, the original record is overwritten."));
            this.registerValues[index] = object;
        }
        else {
            this.registerNames.push(name);
            this.registerValues.push(object);
        }
    };
    /**
     * 移除一个已注册的对象
     * @param name
     */
    ScriptEvalContext.prototype.remove = function (name) {
        var index = this.registerNames.indexOf(name);
        if (index > -1) {
            this.registerNames.splice(index, 1);
            this.registerValues.splice(index, 1);
        }
    };
    /**
     * 获取一个注册的对象
     */
    ScriptEvalContext.prototype.get = function (name) {
        var index = this.registerNames.indexOf(name);
        if (index > -1)
            return this.registerValues[index];
        return null;
    };
    Object.defineProperty(ScriptEvalContext.prototype, "names", {
        /**
         * 获取已注册的所有名字
         */
        get: function () {
            return this.registerNames.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScriptEvalContext.prototype, "values", {
        /**
         * 获取已注册的所有对象
         */
        get: function () {
            return this.registerValues.slice();
        },
        enumerable: false,
        configurable: true
    });
    ScriptEvalContext.prototype.dispose = function () {
        this.registerNames.length = 0;
        this.registerValues.length = 0;
    };
    return ScriptEvalContext;
}());
exports.ScriptEvalContext = ScriptEvalContext;
/**
 * 支持上下文的脚本执行器工具类
 */
var ScriptRunner = /** @class */ (function () {
    function ScriptRunner() {
    }
    /**
     * 构建一个脚本方法对象
     * @param script 脚本
     * @param argNames 脚本的参数变量名列表
     * @param thisContext 脚本的this上下文对象
     * @param globalContext 脚本的全局变量对象，上下文中值类型对象在构建后将不可改变。
     * @returns 函数对象
     */
    ScriptRunner.buildFunction = function (script, argNames, thisContext, globalContext) {
        var globalVars = globalContext ? globalContext.names.join(', ') : '';
        var globalVarValues = globalContext ? globalContext.values : [];
        var funcScript = "function $MAIN______FUNCTION(".concat(argNames ? argNames.join(', ') : '', "){\n").concat(script, "\n}\nreturn $MAIN______FUNCTION;");
        var func = Function(globalVars, funcScript);
        var myFunction = func.apply(void 0, globalVarValues);
        return thisContext ? myFunction.bind(thisContext) : myFunction;
    };
    /**
     * 执行一个无参数的脚本
     * @param script 脚本
     * @param params 脚本的调用参数
     * @param thisContext 脚本this 上下文对象
     * @param globalContext 全局上下文对象，上下文中值类型对象在构建后将不可改变。
     * @returns
     */
    ScriptRunner.eval = function (script, params, thisContext, globalContext) {
        if (params == null)
            params = {};
        var func = this.buildFunction(script, Object.keys(params), thisContext, globalContext);
        return func.apply(void 0, Object.values(params));
    };
    return ScriptRunner;
}());
exports.ScriptRunner = ScriptRunner;
