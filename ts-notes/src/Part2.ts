import {curry, _} from './Util'
import {Person, NullablePerson} from './Part1'

// ---- Can I trust the types

const item = Office.context.mailbox.item //check item type

const typeApplied = (item: Office.MessageRead): void => {
    const exists = item.body.getTypeAsync
}

type CurryType =  typeof curry
type CurryReturn = ReturnType<typeof curry>

// ---- 'any' is crazy

const sad: any = "emptyness and sadness"
const sadVoid: void = sad
const sadUndefined: undefined = sad

const myCallback = (n: number):void => {
    return sadVoid;
}

const sassy: any = {worth: "billion dollars", popularity: "celebrity"}
const sassyNull: null = sassy

const p: Person | null = sassyNull

// ----

// ---- unknown

export const safeParseJSON : (_: string) => unknown = JSON.parse

const isPerson = (p: any): p is Person => 
        typeof p.firstNm === 'string' && typeof p.lastNm === 'string'

const possiblyPerson = safeParseJSON('"John Smith"') 

if (isPerson(possiblyPerson)) {
    console.log(possiblyPerson.firstNm)
} else {
    // console.log(possiblyPerson.firstNm) //does not compile
}

("some email body" as unknown) === 1


const res = _() === _()
(1 as 1) === _()
_() === (1 as 1)

declare function eqeqeq(a: unknown, b: unknown): boolean
eqeqeq("some email body", 1) //compiles


JSON.stringify(_())


