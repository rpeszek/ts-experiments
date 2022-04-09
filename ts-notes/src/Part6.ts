export interface NumFun<T> {
    param: T
    apply(): number 
}

export class MyNumFun<T> implements NumFun<T> {
    fn: (_:T) => number
    param: T
    constructor(fn: (_:T) => number, defPayload: T){
       this.fn = fn
       this.param = defPayload
    }
    apply() {
        return this.fn(this.param)
    }
}

export const partialFun: (_: NumFun<unknown>) => number = fn => {
    fn.param = 2
    return fn.apply()
}

export const mystrlength: MyNumFun<string> = new MyNumFun(s => s.length, "")

const nonsense = partialFun(mystrlength) //will return unknown


//-- Enums vs Unions, both appear to offer the same safety

enum FooBar {
    Foo = "foo",
    Bar = "bar",
}

enum FooBar2 {
    Foo = "foo",
    Bar = "bar",
}  


const switchEnum = (n: FooBar): number => {
    switch(n) {
       case FooBar.Foo:
        return 1
       case FooBar.Bar: //removing this case would result in compilation error
        return 2 
    } 
}

const switchEnum2 = (n: FooBar): number => {
    switch(n) {
       case FooBar.Foo:
        return 1
       case FooBar.Bar: //removing this case would result in compilation error
        return 2 
    //    case FooBarBaz.Foo: TS knows it is a problem
    //     return 3
    } 
}

const switchEnum4 = (n: FooBar | 1): number => {
    switch(n) {
       case FooBar.Foo:
        return 1
       case FooBar.Bar: //removing this case would result in compilation error
        return 2 
       case 1: 
        return 3
    } 
}

const switchNum = (n: 1 | 2): number => {
    switch(n) {
       case 1:
        return 1
       case 2: //removing this case would result in compilation error
        return 2 
       //case 3: //error
        return 2  
    } 
}


