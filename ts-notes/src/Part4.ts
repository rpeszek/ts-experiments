import {curry, curry3, officePromise, verifyExtends, _} from './Util'

import {Either} from './Part1'

// --- scoping

export const bodyScope = <T>(value: T | undefined | null): void => {
    if(value) {
        const t: T = value
        const t2: T = {} as any
        const myFn: (_:T) => void = _ => {}
    }
  }


// type lever unknown guards

type IsUnknown<T> = unknown extends T? 1: 0

export function isUnknown<T>(t: T): IsUnknown<T> {
   return 1 as any //incorrect runtime value, but we do not care
}

const unk: unknown = {}
const test: IsUnknown<typeof unk> = {} as any
const test2: 1 = isUnknown(unk)


export function verifyUnknown<T>(p: IsUnknown<T>, t: T): T {
    return t
}

verifyUnknown(1, unk)
//does not compile
//verifyUnknown(0, unk)

const whyWhyWhy = async (item: Office.MessageRead): Promise<void> => {
    
    const body =  verifyUnknown(0, await officePromise (curry(item.body.getAsync)(Office.CoercionType.Html)))

    const crazyConfig : (_: Office.AsyncResult<string>) => void = x => ""
    
    const body4 = verifyUnknown(1, await officePromise (curry3(item.body.getAsync)(Office.CoercionType.Html)(crazyConfig))) 
}  

export const verifyUnknownCallback: <T, R>(p: IsUnknown<T>, fn: (_: T) => R) => (_: T) => R 
    = (p, fn) => {
   return fn
}

verifyUnknownCallback(1, curry(curry)({} as any))


// --- higher rank

declare function fn1<T> (f:(t:T)=> void): void 
declare function fn2(f: <T>(t:T)=> void): void 

const useStr = (s:string): void => {}
const useNum = (n:number): void => {}
const getCallback = <T>(t:T): void => {}


fn1(useStr)
//fn2(useStr)
fn2(getCallback)

declare function fn3<P,T> (f:()=> T): void 
declare function fn4(f: <T>() => T): void

const strThunk = () => "boo"
const numThunk = () => 1
declare function typeHole<T>():T 


fn3(strThunk)
//fn4(strThunk, numThank)
fn4(typeHole)

//Factory pattern replacement
interface Foo {
    foo: string
}
class MyFoo implements Foo{
    foo: string
    constructor() {
        this.foo = "bar"
    }
}

function existencialFactory(t: <T extends Foo>(t:T) => void): void {
    t(new MyFoo())
}
function nonExistencialFactory<T extends Foo> (t:(t:T) => void): void {
    //t(new MyFoo()) //does not compile
}

//Alternative apporach to create existential types:
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

const valid = verifyUnknown(0, secretive(goodProgram)) //valid: string[]
const invalid_ = secretive(stealPassword) //invalid: unknown, unfortunately compiles retrieving password as unknown

//const invalid = verifyUnknown(0,secretive(stealPassword)) //does not compile!

// interface attempt also allows type escape
interface ExistentialCallback<R> {
    <T>(t: T): R;
  }


const secretive2 = <R> (fn: ExistentialCallback<R>): R  => {
    const s : any = "topsecret"
    return fn (s)
 }

const stealPassword2 : ExistentialCallback<unknown> = stealPassword

secretive2(stealPassword2)


 

// --- Phantom types

// People use classes / interfaces to accomplish similar things
// see also https://github.com/microsoft/TypeScript/issues/21625

type Person0<T> = {firstNm: string, lastNm: string}  //adding value level representation t: T as a filed would fix this

const testP0 : <T>(fst: string, lst: string) => Person0<T> = (fst, lst) => {
    return {firstNm: fst, lastNm: lst}
} 

type NotValidated = {type: "notvalidated"}
type Validated = {type: "validated"}

declare function validate0(p: Person0<NotValidated>):  Person0<Validated> 

declare function doSomethingValidated0(p: Person0<Validated>): void

function validatedOrNot0<T>(p:Person0<T>): void{
    doSomethingValidated0(p)
}

function notValidated0 (p:Person0<NotValidated>): void{
    doSomethingValidated0(p)
}



// Phantom apptempt that works:

type Person1<T> = {firstNm: string, lastNm: string, t?: T}  //adding value level representation t: T as a filed would fix this

const testP1 : <T>(fst: string, lst: string) => Person1<T> = (fst, lst) => {
    return {firstNm: fst, lastNm: lst}
} 

declare function validate1(p: Person1<NotValidated>):  Person1<Validated> 

declare function doSomethingValidated1(p: Person1<Validated>): void

// NO loger compile!

// function validatedOrNot1<T>(p:Person1<T>): void{
//     doSomethingValidated1(p)
// }

// function notValidated1 (p:Person1<NotValidated>): void{
//     doSomethingValidated1(p)
// }

// Does not compile!
// verifyExtends<Person1<number>, Person1<1>>()





//-- never vs type hole

export const _never = (): never => {
    throw new Error("hole"); 
}

export const _hole = <T>(): T =>  _never() 


export const __hole = <T>(): T => {
    throw new Error("hole"); 
}

export const __never = (): never => __hole()



// ---- `never` note

const nevr : never = _()


type SameAs<A> = Either<never,A>

const onlyA: SameAs<number> = {type: "right", content:_()}
const impossible: SameAs<number> = {type: "left", content:_()}

// --- undefined callbacks

declare function someUnknownCallback(t: unknown): void 
const overbar: <T>(_:T) => void =  someUnknownCallback

declare function someOverbar<T>(t:T): void
const unknownCallback: (_: unknown) => void = someOverbar

const overbar2: <T>(_:T) => void = t => {}
const unknownCallback2: (_: unknown) => void = t => {}

overbar(_() === _())
overbar("" + _())


const overbar3: <T>(_:T) => void =  _()
//export const underbar: <T>() => T = someOverbar //this obviously does not compile

// declare function unk<R>(t: unknown): R 
// const top = <T,R>(t:T): R => unk(t)

// declare function top2<T,R>(t:T): R
// const unk2 = <R>(t: unknown): R => top(t)



//Extras
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