import {_} from './Util'

/*
General code examples supporting my blog post
*/


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


type Either<A,B> = 
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


const tstj : JsonVal = {type:"array", val:[{type: "null"}, {type: "number", val: 5}]} //compiles
//const wrong : JsonVal = {type:"array", val:[{type: "number", val: {type: "string", val: "5"}}]} //does not compile, number cannot a nested string
//const wrong2 : {type: "object",  val:[{type: "null"}, {type: "number", val: 5}]} //does not compile, object is not an array

const str = "Hello " + _()

export const contrived = (n: 1 | 2) : number => {
    if(n === 1) {
       return 1;
    } else if (n === 2) {
        return 2;
    } 
    else {
        return 3; // contrived will not compile if I comment this line
    }
}

export const contrived_better = (n: 1 | 2) : number => {
    switch(n) {
       case 1:
        return n
       case 2:
        return n 
    } 
}

export const contrived_better2 = (n: 1 | 2) : number => {
    let res
    switch(n) {
       case 1:
        res = n
        break
       case 2:
        res = n
        break
    }
    return res 
}

type HasContent<C> = {content: C}

type GetContent<T> = T extends HasContent <infer C> ? C : T

const getContent = <C, T extends HasContent<C>> (t: T) : GetContent<T> => {
   //return t.content //compiler error:  Type 'C' is not assignable to type 'GetContent<T>'
   return t.content as any
}

type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;

const head = <T> (t: T[]) : Flatten<T[]> => {
    return t[0]
}

const generalHead = <T> (t: T) : Flatten<T> => {
    if(Array.isArray(t)) 
        return t[0]
    else 
        // return t //Type 'T' is not assignable to type 'Flatten<T>'
        return t as any
}


//_any_ is crazy

const sadAny : any = "emptyness and sadness"
const sadVoid : void = sadAny
const sadUndefined : undefined = sadAny

const myCallback = (n: number):void => {
    return sadVoid;
}


const someBool = (): boolean => true

_() ? "foo" : "bar"           //1
someBool() ? "foo" : _()      //2
someBool() ? _() : "bar"      //3  

const whoAmI = someBool() ? "foo" : 2

someBool() ? ("foo" as string) : _() //4   

const s : string = someBool() ? ("foo" as string) : _() //5

1 === _()
1 == _()

1 == ("boo" as unknown)

1 == (2 as unknown)

