/*
 * This module shows example recursion scheme in TS using JsonVal construction
 * See also RecSchemes.test.ts 
 */

import {Map, List} from 'immutable'

export type JsonVal = 
| {type: "object", val: Map<string, JsonVal>}
| {type: "array", val: List<JsonVal>}
| {type: "string", val: string}
| {type: "number", val: number}
| {type: "bool", val: boolean}
| {type: "null"}


export const tstj : JsonVal = {type:"array", val: List([{type: "null"}, {type: "number", val: 5}])}


export type JsonValF<T> = 
| {type: "object", val: Map<string, T>}
| {type: "array", val: List<T>}
| {type: "string", val: string}
| {type: "number", val: number}
| {type: "bool", val: boolean}
| {type: "null"}


const jmap = <T,R> (fn : (a : T)=> R) => (j: JsonValF<T>): JsonValF<R> => {
   switch(j.type) {
      case "object": return {...j, val: j.val.map(fn)}
      case "array": return {...j, val: j.val.map(fn)}
      default: return j
   }
}

/**
 * Strucural typing simplifies Recursion Schemes, this is just identity. 
 */
export const project = (json: JsonVal) : JsonValF<JsonVal> => json

/**
 * Strucural typing simplifies Recursion Schemes, this is just identity.
 */
export const embed = (json: JsonValF<JsonVal>) : JsonVal => json


/**
 * Somewhat simplified implementation if comparared to nominally typed Haskell. 
 * No need to use unFix or project
 */
export const fold = <A> (f: (j: JsonValF<A>) => A) : (j: JsonVal) => A => {
   const res =  (j: JsonVal) :A => f (jmap (res) (j)) //no need to project 'project(j)' replaced with just 'j'
   return res
}

/**
 * Somewhat simplified implementation if comparared to nominally typed Haskell. 
 * No need to use Fix or embed
 */
export const unfold  = <A> (g: (r: A) =>JsonValF<A>) : (j: A) => JsonVal => {
   const res = (j: A): JsonVal => jmap (res) (g(j))  //no need to embed, no need to do 'embed(jmap(res)(g(j)))'
   return res
}

const fromJSCoAlg = (js: any): JsonValF<any> => {
   if(js === null || js === undefined){
      return {type: "null"}
   } else if(Array.isArray(js)) {
      return {type: "array", val: List(js)}
   } else if (typeof js === 'object') {
      const map: Map<string, any> = Map(js).mapKeys(k =>`${k}`)
      return {type: "object", val: map} 
   } else if (typeof js === 'number') {
      return {type: "number", val: js}
   } else if (typeof js === 'string') { 
     return {type: "string", val: js}
   } else if (typeof js === 'boolean') { 
      return {type: "bool", val: js}
   } else {
      return {type: "null"}
   }
}

/**
 * Example unfold converts JS value into JsonVal
 */
export const fromJS: (_: any) => JsonVal = unfold(fromJSCoAlg)

const depthAlg = (j: JsonValF<number>): number => {
   switch(j.type) {
      case "object": return 1 + Math.max(...j.val.values())
      case "array": return 1 + Math.max(...j.val)
      default: return 1
   }
}

/*
* Example fold calulates depth of Json structure
*/
export const depth: (_: JsonVal) => number = fold(depthAlg)