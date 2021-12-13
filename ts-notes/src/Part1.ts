import {_, curry, curry3, officePromise} from './Util'

/*
General code examples supporting my blog post
*/

// ---- Introduction 


type Person = {firstNm: string, lastNm: string} | null

const getName = (p:Person): string => {
    //const tst1 = p.firstNm //will not compile
    if(p===null){
        //const tst2 = p.firstNm //will not compile
        return "John Smith"
    } else {
        return p.firstNm + " " + p.firstNm //compiles
    }
}


export type Either<A,B> = 
| {type: "left", content: A}
| {type: "right", content: B}

let x: Either<number, string> = {type: "left", content: 1}
//let wrong: Either<number, string> = {type: "left", content: "one"} // will not compile

const x1: Either<number, string> = {type: "left", content: _()}

const y: Either<number, string> = {"type": "left", "content": 1}
//let wrong: Either<number, string> = {"type": "left", "content": "one"} // will not compile

type JsonVal = 
| {type: "object", val: Map<string, JsonVal>}
| {type: "array", val: JsonVal[]}
| {type: "string", val: string}
| {type: "number", val: number}
| {type: "bool", val: boolean}
| {type: "null"}


const tstj: JsonVal = {type:"array", val:[{type: "null"}, {type: "number", val: 5}]} //compiles
const wrong: JsonVal = {type: "number", val: {type: "string", val: "5"}} //does not compile, number cannot a nested string
//const wrong2: {type: "object",  val:[{type: "null"}, {type: "number", val: 5}]} //does not compile, object is not an array


//office.js
export type OfficeCallack<T> = (x: Office.AsyncResult<T>) => void

export const example1 = async (item: Office.MessageRead): Promise<string> => {  
    const bodyType = Office.CoercionType.Html
    
    const partiallyAppliedBodyFn = (fn: ((res: Office.AsyncResult<string>) => void)) => 
        item.body.getAsync(bodyType, fn) 
    
    //more readable version:
    const partiallyAppliedBodyFn2 = (fn: OfficeCallack<string>) => item.body.getAsync(Office.CoercionType.Html, fn)
    const partiallyAppliedBodyFn3: (_: OfficeCallack<string>) => void = 
       fn => item.body.getAsync(Office.CoercionType.Html, fn)
    const body = await officePromise<string> (partiallyAppliedBodyFn) // body: string
    return body
}


// Bumps on path

const willNotCompile = async (item: Office.MessageRead): Promise<string> => {
    const emptyConfig: Office.AsyncContextOptions = {}
    //const body3  = await officePromise (curry3(item.body.getAsync)(Office.CoercionType.Html)(emptyConfig)) 
    return "no luck"
}   


const whyWhyWhy = async (item: Office.MessageRead): Promise<unknown> => {
    const emptyConfig: any = {}
    //body4 has 'unknown' type,  officePromise<string> would make it a string but there is enough of info
    //in item.body.getAsync to infer it
    const body4  = await officePromise (curry3(item.body.getAsync)(Office.CoercionType.Html)(emptyConfig)) 
    
    //the same is true for body4b
    const crazyConfig : (_: Office.AsyncResult<string>) => void = x => ""
    const body4b = await officePromise (curry3(item.body.getAsync)(Office.CoercionType.Html)(crazyConfig)) 

    //hover over _() to see the type, IntelliSense shows completely wrong type
    const body3b  = await officePromise (curry3 (item.body.getAsync)(Office.CoercionType.Html)(_())) 
    return body4
}  

const body3 = officePromise (curry3(({} as Office.MessageRead).body.getAsync)(Office.CoercionType.Html)({} as any)) 
type WhatIsBody3 = typeof body3 //Promise<unknown>


// --- Happy path

const example2 = async (item: Office.MessageRead): Promise<string> => 
   await officePromise (curry(item.body.getAsync)(Office.CoercionType.Html)) 



// --- Leveling Bumps

const typeApplied = async (item: Office.MessageRead): Promise<string> => {
    const emptyConfig: Office.AsyncContextOptions = {}
    const body3  = await officePromise<string> (
      curry3<Office.CoercionType, Office.AsyncContextOptions, OfficeCallack<string>, void> 
        (item.body.getAsync)
        (Office.CoercionType.Html)
        (emptyConfig)
    ) 

    //hover over _() to see the type 
    const body3b  = await officePromise<string> (
        curry3<Office.CoercionType, Office.AsyncContextOptions, OfficeCallack<string>, void> 
          (item.body.getAsync)
          (Office.CoercionType.Html)
          (_())
      )  
   return body3
}

// --- Leveling Bumps - type holes
const str = "Hello " + _()
const testaa = curry(_()) //compilation error 
const test = curry({} as any)


// --- Type Checking Bloopers

const bloopers = async (item: Office.MessageRead): Promise<void> => {
    const good: (a: Office.CoercionType) 
            => (b: ((asyncResult: Office.AsyncResult<string>) => void)) 
            => void
        = curry (item.body.getAsync)

    //compiles but it should not, compiles even with type anotation
    const nonsense1: (a: Office.CoercionType) 
            => (b: ((asyncResult: Office.AsyncResult<string>) => void)) 
            => void
        = curry (curry (item.body.getAsync)) 

    //compiles but it should not
    const nonsense2 = curry(curry) 

    const nonsense3 = curry(curry3)

    const nonsense4 = curry(curry(curry))
}

const nonsense2 = curry(curry)

type WhatTheHeck = typeof nonsense2
