import { Person } from './Part1';
import {curry, unify, _} from './Util'

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


const someBool = (): boolean => true

_() ? "foo": "bar"           //1
someBool() ? "foo": _()      //2
someBool() ? _(): "bar"      //3  

const s: string = someBool() ? _(): _() //4



declare function ternary<T>(p: boolean, t1: T, t2: T): T

ternary(true, "foo", _())
ternary(true, _(), "foo")

ternary(true, 1, 2)
ternary(true, 1 as 1, 2 as 2)
ternary(true, 1, null)
ternary(true, {bye: "world"}, {hello: "world"})

// ternary(true, 1, "boo")
// ternary(true, "boo", 1)
// ternary(true, 1, {hello: "world"})
// ternary(true, "boo", {hello: "world"})

type NumOrString = number | string
ternary(true, 1, "boo" as NumOrString)

type NumOrObject = number | object
ternary(true, 1, {hello: "world"} as NumOrObject)


_() === _()
_() == _()

1 === _()
1 == _()

1 == ("boo" as unknown)

1 == (2 as unknown)

1 == (<unknown> 2)

//will not type check
//1 === 2
//1 == 2 

const one = 1
const two = 2

//one === two

const one_ : number = 1
const two_ : number = 2

one_ === two_

function tst (x: number | Person, y: string | Person) {
    return x === y
}


1 === (2 as unknown)
1 == (2 as unknown)

1 === null
1 == null 

function tst2 (x: 1, y: null) {
    return x === y
}

1 === undefined
1 == undefined

null === undefined 

//"world" === "dolly!"

const hello1 = {hello: "world"}
const hello2 = {hello: "dolly!"}
const helloPlus = {hello: "world!", since:"2022"}

hello1 === hello2
hello2 === helloPlus


const unknown2 : unknown = 2

1 === unknown2

const fn1 = () => {return 1}
const fn2 = (a: number) => {return 2}
fn1 === fn1 
fn1 === fn2


//declare function eq<T>(t1: T, t2: T): boolean
function eq<T>(t1: T, t2: T): boolean {
    return t1 === t2
}


//type holes shows a string as expected!
eq("foo", _())
//type holes shows unknown, Another unexpected 'uknown' widening issue? 
eq(_(), "foo")


const bye = {bye: "world"}
//bye === {hello: "world"}

eq(1 as 1, _())
eq(_(), 1 as 1)
eq(1 as 1, null)
eq(1, 2)
eq(1 as 1, 2 as 2)
eq({bye: "world"}, {hello: "world"})
eq(hello1, hello2)
eq(hello2, helloPlus)
//eq(1, "boo")
//eq(1, {hello: "world"})
//eq("boo", {hello: "world"})

unify(1 as 1, 2 as 2)
unify(1 as 1, null)
// unify(1 as 1, "boo")



const booone : 1 | "boo" = "boo"
const oneboo : 1 | "boo" = 1

//Argument of type '1' is not assignable to parameter of type '"boo"'.ts(2345)
//eq(booone, oneboo) //still does not compile!
eq<(1 | "boo")>(booone, oneboo)



const hello = {hello: "there"}
//unify (1, hello)

function verifyExtends<T2 extends T1, T1>() {}
verifyExtends<1, 1 | 2>()

verifyExtends<1, 1 | "boo">()
verifyExtends<"boo", 1 | "boo">()


//Object is of type 'unknown'
//const x = _() + 1;
