import * as L from './List'

test('check add', () => {
    console.log(L.l_123)
    console.log(L.toArray(2,L.l_123))
    console.log("start")
    //console.log(L.toArray(2,L.repeat(1)))//maximum callstack exceeded
    console.log("done")
    expect (1).toStrictEqual(1)


 });