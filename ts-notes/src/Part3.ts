import {curry, _} from './Util'

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

1 === _()
1 == _()

1 == ("boo" as unknown)

1 == (2 as unknown)

1 == (<unknown> 2)