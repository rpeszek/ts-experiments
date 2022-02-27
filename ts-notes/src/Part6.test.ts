import { partialFun, mystrlength } from "./Part6";


test("check nonsense", () => {
    const nonsense = partialFun(mystrlength)
    console.log(nonsense);
    expect(nonsense).toStrictEqual(undefined)
})