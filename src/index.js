"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptRunner = exports.ScriptEvalContext = void 0;
var ScriptEvalContext = (function () {
    function ScriptEvalContext(baseContext, initLib) {
        this.registerNames = [];
        this.registerValues = [];
        if (baseContext) {
            this.registerNames = baseContext.names;
            this.registerValues = baseContext.values;
        }
        else if (initLib) {
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
    ScriptEvalContext.prototype.clear = function () {
        this.registerNames.length = 0;
        this.registerValues.length = 0;
    };
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
    ScriptEvalContext.prototype.remove = function (name) {
        var index = this.registerNames.indexOf(name);
        if (index > -1) {
            this.registerNames.splice(index, 1);
            this.registerValues.splice(index, 1);
        }
    };
    ScriptEvalContext.prototype.get = function (name) {
        var index = this.registerNames.indexOf(name);
        if (index > -1)
            return this.registerValues[index];
        return null;
    };
    Object.defineProperty(ScriptEvalContext.prototype, "names", {
        get: function () {
            return this.registerNames.slice();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScriptEvalContext.prototype, "values", {
        get: function () {
            return this.registerValues.slice();
        },
        enumerable: false,
        configurable: true
    });
    return ScriptEvalContext;
}());
exports.ScriptEvalContext = ScriptEvalContext;
var ScriptRunner = (function () {
    function ScriptRunner() {
    }
    ScriptRunner.buildFunction = function (script, argNames, thisContext, globalContext) {
        var globalVars = globalContext ? globalContext.names.join(', ') : '';
        var globalVarValues = globalContext ? globalContext.values : [];
        var funcScript = "function $MAIN______FUNCTION(".concat(argNames ? argNames.join(', ') : '', "){\n").concat(script, "\n}\nreturn $MAIN______FUNCTION;");
        var func = Function(globalVars, funcScript);
        var myFunction = func.apply(void 0, globalVarValues);
        return thisContext ? myFunction.bind(thisContext) : myFunction;
    };
    ScriptRunner.eval = function (script, parameters, thisContext, globalContext) {
        if (parameters == null)
            parameters = {};
        var properties = ScriptRunner.getProperties(parameters);
        var func = this.buildFunction(script, properties.keys, thisContext, globalContext);
        return func.apply(void 0, properties.values);
    };
    ScriptRunner.getProperties = function (parameters) {
        var result = { keys: [], values: [] };
        for (var key in parameters) {
            result.keys.push(key);
            result.values.push(parameters[key]);
        }
        return result;
    };
    return ScriptRunner;
}());
exports.ScriptRunner = ScriptRunner;
//# sourceMappingURL=index.js.map