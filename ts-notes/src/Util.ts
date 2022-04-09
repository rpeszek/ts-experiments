//polymoprhic bottom function
// export declare function _<T>(): T

//polymoprhic bottom function
export const _ = <T>(): T => {
    throw new Error("hole"); 
}

export declare function unify<T>(t1: T, t2: T) : T


export function verifyExtends<T2 extends T1, T1>() {}

export const curry = <T1, T2, R> (fn: (ax: T1, bx: T2) => R): (a: T1) => (b: T2) => R => {
    const res = (a: T1) => (b: T2) => fn(a, b)
    return res
 }

const addtst = (a:number, b: number):number => a + b
const curriedAdd = curry(addtst) //const curriedAdd: (a: number) => (b: number) => numbers
const tst1 = curry(addtst)(1) //const tst1: (b: number) => number
const tst12 = curry(addtst)(1)(2) //tst12:number = 3
//const willnotcompile = curry(_())

const addtstB = (a:number | string, b: string):string => a + b
const tstB1 = curry(addtstB)(1) //const tstB1: (b: number) => number
const tstB1one =  curry(addtstB)(1)("one") //tstB1one: string = "1one"

export const curry3 = <T1, T2, T3, R> (fn: (ax: T1, bx: T2, cx: T3) => R): (a: T1) => (b: T2) => (c: T3) =>  R => {
    const res = (a: T1) => (b: T2) => (c: T3) => fn(a, b, c)
    return res
 }

const add3tst = (a:number, b: string, c: number | string) :string => a + b + c
const curriedAdd3 = curry3(add3tst) //curriedAdd3: (a: number) => (b: string) => (c: string | number) => string
const tst3 =  curry3(add3tst)(1) //const tst3: (b: string) => (c: string | number) => string
const tst3one = curry3(add3tst)(1)("one") //const tst3one: (c: string | number) => string

export const officePromise = <T> (getasync: (fx: (r: Office.AsyncResult<T>) => void) => void): Promise<T> => {
    return new Promise((resolve, reject) => {
      getasync((res: Office.AsyncResult<T>) => {
        if(res.status===Office.AsyncResultStatus.Succeeded){
          resolve(res.value)
      } else
          reject(res.error)
      })
   })
  }


