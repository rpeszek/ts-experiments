import {curry, _} from './Util'

// ---- Can I trust the types

const item = Office.context.mailbox.item //check item type

type CurryType =  typeof curry
type CurryReturn = ReturnType<typeof curry>

// ---- 'any' is crazy

const sadAny: any = "emptyness and sadness"
const sadVoid: void = sadAny
const sadUndefined: undefined = sadAny

const myCallback = (n: number):void => {
    return sadVoid;
}
