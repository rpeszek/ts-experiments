import { depth, fromJS } from "./RecSchemes";
import {Map, List} from 'immutable'

test("sanity", () => {
  const x = {
    a: {
      1: "foo",
      2: "bar",
    },
    b: [
      {
        3: 3,
        4: "baz",
      },
    ],
  }

  const expectedJson = {
    type: "object",
    val: Map ({
      a: {
        type: "object",
        val: Map ({
          "1": { type: "string", val: "foo" },
          "2": { type: "string", val: "bar" },
        }),
      },
      b: {
        type: "array",
        val: List([
          {
            type: "object",
            val: Map({
              "3": { type: "number", val: 3 },
              "4": { type: "string", val: "baz" },
            }),
          },
        ]),
      },
    }),
  }

  expect(fromJS(x)).toStrictEqual(expectedJson);
});


test("test depth", () => {
    const x = { //level 1
        a: { //level 2
          1: "foo",
          2: "bar",
        },
        b: [ //level 2
          { //level 3
            3: 3, //level 4
            4: "baz",
          },
        ],
      }

    expect(depth(fromJS(x))).toEqual(4)
});