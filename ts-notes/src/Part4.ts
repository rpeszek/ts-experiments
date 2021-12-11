import {curry, _} from './Util'

import {Either} from './Part1'





// --- Subtyping 

function verifyExtends<T1, T2 extends T1>() {}

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

verifyExtends<FooOrBarOrBuz, FooOrBar>() //compiles, FooOrBar extends FooOrBarOrBuz
//verifyExtends<FooOrBar, FooOrBarOrBuz>() //does not compile, FooOrBarOrBuz does not extend FooOrBar


type FooAndBar = {foo: string, bar: string} //more general
declare function genFooAndBar(): FooAndBar

type FooAndBarAndBaz = {foo: string, bar: string, baz: string} //more specific
declare function genFooAndBarAndBaz(): FooAndBarAndBaz

const fooAndBar: FooAndBar = genFooAndBarAndBaz()  //specific assigned to general is valid assignment
//const fooAndBarAndBuz: FooAndBarAndBaz = genFooAndBar() // will not compile, tries to assign general to specific

verifyExtends<FooAndBar, FooAndBarAndBaz>() //compiles, FooAndBarAndBaz extends FooAndBar
//verifyExtends<FooAndBarAndBaz, FooAndBar>() //does not compile, FooAndBar does not extend FooAndBarAndBaz


// challenge check:
// what does your function return for this value?
const whatIsThat = amIFooOrBar({foo: "foo", bar: "bar"})



// ---- `never` note

const nevr : never = _()


type SameAs<A> = Either<never,A>

const onlyA: SameAs<number> = {type: "right", content:_()}
const impossible: SameAs<number> = {type: "left", content:_()}

// --- higher rank
interface HoleInterface {
    <T>(): T;
  }

const _hk : HoleInterface = _  

declare function _2<T>(): T

const _2hk : HoleInterface = _2

declare function nonPolymorphic (): string
//const _nonPolymorphic : HoleInterface = nonPolymorphic //will not compile

const expectsHoleInterface = <R> (h: HoleInterface): R => h()

expectsHoleInterface(_hk)
expectsHoleInterface(_2hk)

const expectsPolymorphicHole = <R> (h: <T>() => T): R => h()
expectsPolymorphicHole(_)
expectsPolymorphicHole(_2)
//expectsPolymorphicHole(nonPolymorphic) //will not compile

// attempt of using higher rank to protect data 
// Imaginary world without debuggers, JSON.stringify, etc
type Api = {getGoodies: string[]}

declare function login<Password>(p: Password): Api //some login function provides access to API, password needs to be protected

//provide password to a computation that compuatation should be able to use the password but not return it
const secretive = <R> (fn: <Password> (p: Password) => R): R  => {
   const s : any = "topsecret"
   return fn (s)
}

const goodProgram = <Password>(p: Password): string[] => {
    const api = login(p)
    return api.getGoodies
}

const stealPassword = <Password>(p: Password): Password => p

const valid = secretive(goodProgram) //valid: string[]
const invalid = secretive(stealPassword) //invalid: unknown, unfortunately compiles retrieving password as unknown


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


