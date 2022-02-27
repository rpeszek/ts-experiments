import { Person } from './Part1';
import {curry, unify, verifyExtends, _} from './Util'

// --- switch exhaustive check
export const contrived = (n: 1 | 2): number => {
    if(n === 1) {
       return 1;
    } else if (n === 2) {
        return 2;
    } 
    else {
        return 3; // contrived will not compile if I comment this line
    }
}

export const contrived_better = (n: 1 | 2): number => {
    switch(n) {
       case 1:
        return n
       case 2:
        return n 
    } 
}

//Function lacks ending return statement and return type does not include 'undefined'.ts(
// export const contrived_better_ = (n: 1 | 2 | 3): number => {
//     switch(n) {
//        case 1:
//         return n
//        case 2:
//         return n 
//     } 
// }

export const contrived_better2 = (n: 1 | 2): number => {
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




// --- on complexity of types

// _() + _()
// _() * _()
// _() / _()

// --- === semantics, rejected overlap

function testEqSemantics(a: {bye: string}, b: {hello: string}): boolean {
   //This condition will always return 'false' since the types '{ bye: string; }' and '{ hello: string; }' have no overlap.
   //return a === b
   //return a == b
   return true
}

const helloBye = {bye:"world!", hello:"world!"}
testEqSemantics(helloBye, helloBye)
helloBye === helloBye

verifyExtends<typeof helloBye, {bye: string}>()
verifyExtends<typeof helloBye, {hello: string}>()
verifyExtends<typeof helloBye, {bye: string} & {hello: string}>()
verifyExtends<{bye: string} & {hello: string}, typeof helloBye>()


// --- === semantics, what’s an overlap?

const helloDolly: {hello: string} = {hello: "Dolly!"}
const datedHello: {hello: string, since: number} = {hello: "world!", since:2022}
const one = 1 //const one: 1
const two = 2 //const two: 2
const onenum: number  = 1
const twonum: number  = 2
const world: string = "world"

// //fails, different literal types do not overlap
// "Dolly!" ===  "world!"
// //fails, different literal types do not overlap
// one === two
// //fails, string and number do not overlap
// one === world

//compilies, note both have the same type
onenum === twonum
//compiles, note 'typeof datedHello' extends 'typeof helloDolly' 
helloDolly === datedHello

verifyExtends<typeof datedHello, typeof helloDolly>()

//compiles, the overlap seems to be the 'Person' type
function tst (x: number | Person, y: string | Person) {
    return x === y
}



//compiles, the overlap seems to be `{hello: string, since: number}` 
function testEqSemantics2(a: {hello: string} | 1, b: "boo" | {hello: string, since: number}): boolean {
    return a === b
}

//doing a 'cross design' on `extends` in a union works 
function testEqSemantics3(a: {hello: string} | {bye: string, on: number}, b:  {bye: string} | {hello: string, since: number}): boolean {
    return a === b
}

//extends on one variant of the union still works
function testEqSemantics4(a: {hello: string | 1} | 1, b: "boo" | {hello: string, since: number}): boolean {
    return a === b
}

//Does not compile
function testEqSemantics5(a: {hello: 1 | "boo"} , b: "boo" | {frstNm:string}): boolean {
    //return a === b
    return true
}

//Other interesting, not in the post:
const fn1 = () => {return 1}
const fn2 = (a: number) => {return 2}
fn1 === fn1 
fn1 === fn2

//All compile
1 === null

1 === undefined

function tst2 (x: 1, y: null) {
    return x === y
}


// --- Hidden blooper (side note)


const helloDolly_ = {hello: "Dolly!"}
const datedHello_ = {hello: "world!", since:2022}

helloDolly_ === datedHello_ //still compiles



// --- DIY equality

function eq<T>(t1: T, t2: T): boolean {
    return t1 === t2
}

//type holes shows a string as expected!
eq("foo", _())
//type holes shows unknown, Another unexpected 'uknown' widening issue? 
eq(_(), "foo")



eq(1 as 1, _())
eq(_(), 1 as 1)
eq(1 as 1, null)
eq(1, 2)
eq(1 as 1, 2 as 2)
eq({bye: "world"}, {hello: "world"})
eq(helloDolly, datedHello)


//Will not compile
//eq(1, "boo")
//eq(1, {hello: "world"})
//eq("boo", {hello: "world"})


// --- Subtyping

unify(1 as 1, 2 as 2)
unify(1 as 1, null)

//Even this does not compile (not shown in the post)
//unify(1 as 1, "boo")



const booone : 1 | "boo" = "boo"
const oneboo : 1 | "boo" = 1

//Argument of type '1' is not assignable to parameter of type '"boo"'.ts(2345)
//eq(booone, oneboo) //still does not compile!
eq<(1 | "boo")>(booone, oneboo)

verifyExtends<Person, (number | Person) & (string | Person)>()
verifyExtends<(number | Person) & (string | Person), Person>()

//Another weird example not shown in the blog, this does not compile:
//unify (1, helloDolly)

verifyExtends<1, 1 | 2>()

verifyExtends<1, 1 | "boo">()
verifyExtends<"boo", 1 | "boo">()

//Type '(1 | "boo") & ("boo" | Person)' does not satisfy the constraint '"boo"'.
//  Type '1 & Person' is not assignable to type '"boo"'.ts(2344)
//verifyExtends<(1 | "boo") & ("boo" | Person), "boo">()

// --- Variance Problems


const bye = {bye: "world"}
const hello = {hello: "world"}

declare function eqArrays<T>(t1: T[], t2: T[]): boolean

eqArrays([{bye: "world"}], [{hello: "world"}])

//Fails to compile:
//eqArrays([bye], [hello])


interface Payload<T> {payload: T}
type Payload1<T> = {payload: T}  //could replace Payload in the examples below
declare function eqPayloads<T>(t1: Payload<T>, t2: Payload<T>): boolean


// Compilation error:
// Property 'bye' is missing in type '{ hello: string; }' but required in type '{ bye: string; }'.ts(2741)
// Part3.ts(214, 14): 'bye' is declared here.
// Part3.ts(210, 20): The expected type comes from property 'payload' which is declared here on type 'Payload<{ bye: string; }>'
//eqPayloads({payload: bye}, {payload: hello})

// Wild widening of the arguments makes this compile:
//(property) payload: {
//     bye: string;
//     hello?: undefined;
// } | {
//     hello: string;
//     bye?: undefined;
// }
eqPayloads({payload: {bye: "world"}}, {payload: {hello: "world"}})


// Payload can be used in contravariant ways, TS should not assume it is not
interface Fun<T,R> extends Payload<T> {
    apply(): R 
}

class MyFun<T,R> implements Fun<T,R> {
    fn: (_:T) => R
    payload: T
    constructor(fn: (_:T) => R, defPayload: T){
       this.fn = fn
       this.payload = defPayload
    }
    apply() {
        return this.fn(this.payload)
    }
}

//example of covariance bug
const myfn: MyFun<string, number> = new MyFun(s => s.length, "")
const myfn2: Payload<unknown> = myfn
const applyNumToFn = myfn2.payload = 2
const lengthOf2 = myfn.apply()


//adding string to a list of numbers
const intlist: number[] = [1,2,3]
const list: unknown[] = intlist
list.push("not a number")

verifyExtends<typeof datedHello[], typeof helloDolly[]>()

verifyExtends<Payload<typeof datedHello>, Payload<typeof helloDolly>>()
verifyExtends<Payload<typeof datedHello>, Payload<object>>()

const wrongtyping: Payload<object> = {} as Payload<typeof helloDolly>