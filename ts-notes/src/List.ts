


export type List<T> = 
| {type: "nil"} 
| {type: "cons", head: T, tail: List<T>}


//as const makes this a list
const ul_123  = {type: "cons", head: 1, tail: {type: "cons", head: 2, tail: {type: "cons", head: 3, tail: {type: "nil"}}}} as const

export const l_123a: List<number> = ul_123  //compiler error without as const in the above definition

const l_123b: List<number> = {type: "cons", head: 1, tail: {type: "cons", head: 2, tail: {type: "cons", head: 3, tail: {type: "nil"}}}}

const empty = {type: "nil"} as const //as const makes this a list
const x: List<number> = empty 

export const toArray = <T>(i:number, l: List<T>): T[] => {
    if (i === 0) {
        return [] 
    } else {
        switch(l.type) {
            case "nil": return []
            case "cons": return [l.head, ... toArray(i-1, l.tail)]
        }
    }
}

//const tst_123 = toArray(2, ul_123) //compiler error: Argument of type ... is not assignable to type ...
const tst_123 = toArray(2, l_123a) 

export const repeat = <T> (t:T): List<T> => {
    return {type:"cons", head:t , tail:repeat(t)}
}

const txx = {type: "boo"}

