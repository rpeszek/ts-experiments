//polymoprhic bottom function
// export declare function _<T>(): T

//polymoprhic bottom function
export const _ = <T>(): T => {
    throw new Error("hole"); 
}


export const curry = <T1, T2, R> (fn: (ax: T1, bx: T2) => R): (a: T1) => (b: T2) => R => {
    const res = (a: T1) => (b: T2) => fn(a, b)
    return res
 }

const addtst = (a:number, b: number) => a + b
const tst = curry(addtst)(1) //const tst: (b: number) => number
const tst2 = curry(addtst)(1)(2) //tst2 = 3
//const willnotcompile = curry(_())

export const curry3 = <T1, T2, T3, R> (fn: (ax: T1, bx: T2, cx: T3) => R): (a: T1) => (b: T2) => (c: T3) =>  R => {
    const res = (a: T1) => (b: T2) => (c: T3) => fn(a, b, c)
    return res
 }