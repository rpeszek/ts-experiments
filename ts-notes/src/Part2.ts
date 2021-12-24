import {curry, _} from './Util'
import {Person, NullablePerson} from './Part1'


/*
Code examples supporting my blog post
*/

// ---- Can I trust the types

const item = Office.context.mailbox.item //check item type

type CorrectedOfficeItem = Office.MessageRead | Office.MessageCompose | Office.AppointmentCompose | Office.AppointmentRead 

const correctedItem : CorrectedOfficeItem | undefined = item


const propetyUndefinedAtRuntime = (item: Office.MessageRead): void => {
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


// ---- casting fixes 

export const isMessageRead = (item: CorrectedOfficeItem): item is Office.MessageRead => {
    const d: any = item //internal reassignment to any is slightly more type safe than exposing 'any` in the type
    return (item.itemType === Office.MailboxEnums.ItemType.Message) && d.getAttachmentsAsync === undefined
} 
  
export const isMessageCompose = (item: CorrectedOfficeItem): item is Office.MessageCompose => {
    const d: any = item //internal reassignment to any is slightly more type safe
    return (item.itemType === Office.MailboxEnums.ItemType.Message) && d.getAttachmentsAsync !== undefined 
} 

declare function doSomethingWithViewedEmail(item: Office.MessageRead): void
declare function doSomethingWithComposedEmail(item: Office.MessageCompose): void
declare function onlyEmailEntriesAreSupported(): void

const correctedOfficeProgram = (item: CorrectedOfficeItem): void => {
    if(isMessageRead(item)) {
        //doSomethingWithComposedEmail(item) //this will not type check!
        doSomethingWithViewedEmail(item)    
      } else if (isMessageCompose(item)) {
        //doSomethingWithViewedEmail(item) //this will not type check!
        doSomethingWithComposedEmail(item)  
      } else {   
        onlyEmailEntriesAreSupported()
      } 
}


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

// see Part1 for blooper examples 

const res = _() === _();
(1 as 1) === _()
_() === (1 as 1)

declare function eqeqeq(a: unknown, b: unknown): boolean
eqeqeq("some email body", 1) //compiles

//this one is 'any' based
JSON.stringify(_())

