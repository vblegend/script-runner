Script Runner
=======

Make your eval pass parameters and specify this context when executing the script, and you can register global functions and variables for him.

License: MIT


`install`
```
npm install script-eval-js


import { ScriptRunner } from 'script-eval-js';
```



`examples`
``` typescript
const result = ScriptRunner.eval(`1+1`);
console.log(result);
```

``` typescript
const result = ScriptRunner.eval(`console.log(this);`);
console.log(result);
```

``` typescript
const result = ScriptRunner.eval(`console.log(id+name);`, { id: 100,  name: 'script runner' });
console.log(result);
```
``` typescript
const func = ScriptRunner.buildFunction(`console.log(this); return id + name;`, ['id','name'],this);
const result = func(100,'script runner');
console.log(result);
```



`typescript typing`
```
/**
* global context
*/
export declare class ScriptEvalContext {

    constructor(baseContext?: ScriptEvalContext){
        // this.registerNames = [];
        // this.registerValues = [];
        // if (baseContext) {
        //     this.registerNames = baseContext.names;
        //     this.registerValues = baseContext.values;
        // }
        // else {
        //     this.register('$floor', Math.floor);
        //     this.register('$random', Math.random);
        //     this.register('$max', Math.max);
        //     this.register('$min', Math.min);
        //     this.register('$round', Math.round);
        //     this.register('$abs', Math.abs);
        //     this.register('$pow', Math.pow);
        //     this.register('$log', console.log);
        //     this.register('$error', console.error);
        //     this.register('$warn', console.warn);
        //     this.register('$vars', {});
        // }
    }

    public register(name: string, object: any): void;

    public remove(name: string): void;

    public get(name: string): any;

    public get names(): string[];

    public get values(): any[];

    public dispose(): void;
}


export declare abstract class ScriptRunner {

    public static buildFunction(script: string, argNames?: string[], thisContext?: Object, globalContext?: ScriptEvalContext): Function;

    public static eval<TResult>(script: string, params: Record<string, any>, thisContext?: Object, globalContext?: ScriptEvalContext): TResult;
}
```