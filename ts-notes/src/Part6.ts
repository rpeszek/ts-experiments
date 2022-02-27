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
