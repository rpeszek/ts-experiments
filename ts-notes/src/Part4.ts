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

// export const bodyScope2: <T>(_: T | undefined | null) => void = value => {
//     if(value) {
//         const t: T = value
//     }
// }

// type lever unknown guards

type IsUnknown<T> = unknown extends T? true: false

export function isUnknown<T>(t: T): IsUnknown<T> {
   return true as any //incorrect runtime value, but we do not care
}

const unk: unknown = {}
const test: IsUnknown<typeof unk> = {} as any
const test2: true = isUnknown(unk)


export function verifyUnknown<T>(p: IsUnknown<T>, t: T): T {
    return t
}


//does not compile
verifyUnknown(false, "test")
//does not compile
//verifyUnknown(false, unk)
verifyUnknown(true, unk)

const whyWhyWhy = async (item: Office.MessageRead): Promise<void> => {
    
    const body =  verifyUnknown(false, await officePromise (curry(item.body.getAsync)(Office.CoercionType.Html)))

    const crazyConfig : (_: Office.AsyncResult<string>) => void = x => ""
    
    //note need to put true to compile
    const body4 = verifyUnknown(true, await officePromise (curry3(item.body.getAsync)(Office.CoercionType.Html)(crazyConfig))) 
}  

export const verifyUnknownCallback: <T, R>(p: IsUnknown<T>, fn: (_: T) => R) => (_: T) => R 
    = (p, fn) => {
   return fn
}

//note need to put true to compile
verifyUnknownCallback(true, curry(curry)({} as any))


// --- higher rank

//examples with generic callbacks
declare function fn1<T> (f:(t:T)=> void): void 
declare function fn2(f: <T>(t:T)=> void): void 

const useStr = (s:string): void => {}
const useNum = (n:number): void => {}
const getCallback = <T>(t:T): void => {}


fn1(useStr)
//fn2(useStr)
fn2(getCallback)


//examples using generic thunks
declare function fn3<P,T> (f:()=> T): void 
declare function fn4(f: <T>() => T): void

const strThunk = () => "boo"
const numThunk = () => 1
declare function typeHole<T>():T 


fn3(strThunk)
//fn4(strThunk)
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

function existencialFactory(t: <T extends Foo>(_:T) => void): void {
    t(new MyFoo())
}
function nonExistencialFactory<T extends Foo> (t:(_:T) => void): void {
    //Compilation Error
    //Argument of type 'MyFoo' is not assignable to parameter of type 'T'.
    // 'MyFoo' is assignable to the constraint of type 'T', but 'T' could be instantiated with a different subtype of constraint 'Foo'.ts(2345)
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


secretive(goodProgram)
secretive(stealPassword)

const valid = verifyUnknown(false, secretive(goodProgram)) //valid: string[]
const invalid_ = secretive(stealPassword) //invalid: unknown, unfortunately compiles retrieving password as unknown

//const invalid = verifyUnknown(false,secretive(stealPassword)) //does not compile!



// interface based approach
interface ExistentialCallback<R> {
    <T>(t: T): R;
  }


const secretive2 = <R> (fn: ExistentialCallback<R>): R  => {
    const s : any = "topsecret"
    return fn (s)
 }

const stealPassword2 : ExistentialCallback<unknown> = stealPassword

secretive2(stealPassword2)


//-- preventing subtyping

type Same<P,T> = P extends T? (T extends P? true: false): false

type Hello = {hello: string}

const proofHello = <T> (t: T): Same<Hello,T> => {
    return {} as any //does not matter
 }

//hover over to see 'const phello1: true' and 'const phello2: false'
const phello1 = proofHello({hello: "world"})
const phello2 = proofHello({hello: "world", since : 2020})



const verifyHello = <T> (_: Same<Hello,T>, t:T): T => t

verifyHello(true, {hello: "world"})
verifyHello(false, {hello: "world", since : 2020})

const verifySame = <P> () => <T> (_: Same<P,T>, t:T): T => t

verifySame<Hello>()(true, {hello: "world"})
verifySame<Hello>()(false, {hello: "world", since : 2020})
//verifySame<Hello>()(true, {hello: "world", since : 2020})

//Note to get safety I end up with casting
const safePush = <P, T> (_: Same<P,T>, ps: P[], t: T): number => ps.push(t as any)


const intlist: number[] = [1,2,3]
const list: unknown[] = intlist
list.push("not a number") //unsafe TS push

safePush(true, intlist, 1)  //this is safe
safePush(false, list, 1)    //this is risky and will not compile with true
safePush(false, list, "not a number") //this is risky (here wrong) and will not compile with true

//This is easier on TS to type check than a tuple
type Pair<A,B> = {fst: A, snd: B}

//--- attempt to crate existential safePush with only one top level type variable
const safePush2 = <P> (ps: P[], fn: <T> () => Pair<Same<P,T>, T>): number => {
    const res = fn().snd
    return ps.push(res as any)
}

//Sadly, this does not want to compile
// Note this is still rank-2 (not higher), the position of quantification counts, 
// not the position of quantified variable

// safePush2(intlist, () => {
//     return {fst: true, snd: 1}
// })



// --- Phantom types

// People use classes / interfaces to accomplish similar things
// see also https://github.com/microsoft/TypeScript/issues/21625

type Person<T> = {firstNm: string, lastNm: string}  //adding value level representation `phantom?: T` 

const createPerson : <T>(fst: string, lst: string) => Person<T> = (fst, lst) => {
    return {firstNm: fst, lastNm: lst}
} 

type Validated = {type: "validated"}
type ValidationError = string

declare function validate<T>(p: Person<T>):  ValidationError | Person<Validated> 

declare function doSomethingValidated(p: Person<Validated>): void

function validatedOrNot<T>(p:Person<T>): void{
    doSomethingValidated(p)
}

type ClearlyNotValidated = {type: "notvalidated"}

function notValidated (p:Person<ClearlyNotValidated>): void {
    doSomethingValidated(p)
}

function validated(p:Person<Validated>): void {
    doSomethingValidated(p)
}



// Phantom apptempt that works:

type Person1<T> = {firstNm: string, lastNm: string, t?: T}  //adding value level representation t: T as a filed would fix this

const testP1 : <T>(fst: string, lst: string) => Person1<T> = (fst, lst) => {
    return {firstNm: fst, lastNm: lst}
} 

declare function validate1<T>(p: Person1<T>):  ValidationError | Person1<Validated> 

declare function doSomethingValidated1(p: Person1<Validated>): void

// NO loger compile!

// function validatedOrNot1<T>(p:Person1<T>): void{
//     doSomethingValidated1(p)
// }

// function notValidated1 (p:Person1<ClearlyNotValidated>): void{
//     doSomethingValidated1(p)
// }

// Does not compile!
// verifyExtends<Person1<number>, Person1<1>>()


interface Comparator<T> {
    compare (o1: T, o2: T): number
}

class MyClass implements Comparator<MyClass> {
    num: number
    constructor (num: number) {this.num = num}
    compare (o1: MyClass, o2: MyClass): number {return o1.num - o2.num}
}

type SortStatus = "ascending" | "descending" | "none"
type List<T, Status> = {type: "empty"} | {type: "cons", head: T, tail: List<T, Status>}

declare function sortAscending<T extends Comparator<T>, Status>(list: List<T, Status>):  List<T, "ascending">

declare function doSomethingWithSortedList<T extends Comparator<T>>(list: List<T, "ascending">): void

const testList : List<MyClass, unknown> = _()
sortAscending(testList)


