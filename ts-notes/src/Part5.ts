import {curry, curry3, officePromise, verifyExtends, _} from './Util'

import {Either} from './Part1'

// --- See List.ts for Recursive List example  

// --- See RecSchemes.ts for Recursion Scheme example


// --- Type Level programming

type HasContent<C> = {content: C}

type GetContent<T> = T extends HasContent <infer C> ? C: T

const getContent = <C, T extends HasContent<C>> (t: T): GetContent<T> => {
   //return t.content //compiler error:  Type 'C' is not assignable to type 'GetContent<T>'
   return t.content as any
}

type Flatten<Type> = Type extends Array<infer Item> ? Item: Type;

const head = <T> (t: T[]): Flatten<T[]> => {
    return t[0]
}

const generalHead = <T> (t: T): Flatten<T> => {
    if(Array.isArray(t)) 
        return t[0]
    else 
        // return t //Type 'T' is not assignable to type 'Flatten<T>'
        return t as any
}


// --- Subtyping 


//more specific, fewer variants
type FooOrBar =  
| {foo: string} 
| {bar: string}

//a challenge, implement this function:
declare function amIFooOrBar(o: FooOrBar): "foo" | "bar"

declare function genFooOrBar(): FooOrBar

//more general, more variants
type FooOrBarOrBuz =
| {foo: string} 
| {bar: string}
| {baz: string}
declare function genFooOrBarOrBuz(): FooOrBarOrBuz

const fooOrBarOrBuz: FooOrBarOrBuz = genFooOrBar() //compiles assigns specific to more general 
//const fooOrBar: FooOrBar = genFooOrBarOrBuz() //will not compile tries to assign general to more specific

verifyExtends<FooOrBar, FooOrBarOrBuz>() //compiles, FooOrBar extends FooOrBarOrBuz
//verifyExtends<FooOrBar, FooOrBarOrBuz>() //does not compile, FooOrBarOrBuz does not extend FooOrBar


type FooAndBar = {foo: string, bar: string} //more general
declare function genFooAndBar(): FooAndBar

type FooAndBarAndBaz = {foo: string, bar: string, baz: string} //more specific
declare function genFooAndBarAndBaz(): FooAndBarAndBaz

const fooAndBar: FooAndBar = genFooAndBarAndBaz()  //specific assigned to general is valid assignment
//const fooAndBarAndBuz: FooAndBarAndBaz = genFooAndBar() // will not compile, tries to assign general to specific

verifyExtends<FooAndBarAndBaz, FooAndBar>() //compiles, FooAndBarAndBaz extends FooAndBar
//verifyExtends<FooAndBar, FooAndBarAndBaz>() //does not compile, FooAndBar does not extend FooAndBarAndBaz


// challenge check:
// what does your function return for this value?
const whatIsThat = amIFooOrBar({foo: "foo", bar: "bar"})

// unknown is like Java Object
verifyExtends<1, unknown>()
verifyExtends<FooAndBar, unknown>()
verifyExtends<never, unknown>()



//-- Thunks, callbacks, never, unknown

export const _never = (): never => {
    throw new Error("hole"); 
}

export const _hole = <T>(): T =>  _never() 


export const __hole = <T>(): T => {
    throw new Error("hole"); 
}

export const __neverFn1 = (): never => __hole()

export const __neverFn2: () => never =  __hole


declare function someUnknownCallback(t: unknown): void 
const overbar: <T>(_:T) => void =  someUnknownCallback

declare function someOverbar<T>(t:T): void
const unknownCallback: (_: unknown) => void = someOverbar


// -- using overbar as a typehole to check types of expressions, hover over 'overbar'

overbar(_() === _())
overbar("" + _())

// --- Yoneda lemma

type Yoneda<T> = () => <R>(f: (_: T) => R) => R
type Thunk<T> = () => T

const toYoneda = <T> (th: Thunk<T>): Yoneda<T> => {
   const res = () => <R> (f: (_: T) => R): R => f(th())
   return res
}

const fromYoneda = <T> (y: Yoneda<T>): Thunk<T> => {
    const res = (): T => y()(x => x)
    return res
 }

declare function yoneda1 <T, R> (f: (_: T) => R): R
declare function yoneda2 <T> (): (<R>(f: (_: T) => R) => R)


//Side note (not in the post)
//classes are structually typed too
class Bye {
    constructor() {
        this.bye = "1"
    }
    bye: string
}

class Bye2 {
    constructor() {
        this.bye = "2"
    }
    bye: string 
}

declare function useBye(b: Bye): void 

useBye(new Bye2())