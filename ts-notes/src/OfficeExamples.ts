
import {_, curry, curry3} from './Util'

export const officePromise = <T> (getasync: ((fx: ((r: Office.AsyncResult<T>) => void)) => void)): Promise<T> => {
    return new Promise((resolve, reject) => {
      getasync((res: Office.AsyncResult<T>) => {
        if(res.status===Office.AsyncResultStatus.Succeeded){
          resolve(res.value)
      } else
          reject(res.error)
      })
   })
  }


export type OfficeCallack<T> = (x: Office.AsyncResult<T>) => void

export const example1 = async (item: Office.MessageRead) : Promise<string> => {  
    const bodyType = Office.CoercionType.Html
    
    const partiallyAppliedBodyFn = (fn: ((res: Office.AsyncResult<string>) => void)) => 
        item.body.getAsync(bodyType, fn) 
    
    //more readable version:
    const partiallyAppliedBodyFn2 = (fn: OfficeCallack<string>) => item.body.getAsync(Office.CoercionType.Html, fn)
    
    const body = await officePromise<string> (partiallyAppliedBodyFn) // body: string
    return body
}




export const example2 = async (item: Office.MessageRead) : Promise<string> => 
   await officePromise (curry(item.body.getAsync)(Office.CoercionType.Html)) 


const willNotCompile = async (item: Office.MessageRead) : Promise<string> => {
    const emptyConfig : Office.AsyncContextOptions = {}
    //const body3  = await officePromise (curry3(item.body.getAsync)(Office.CoercionType.Html)(emptyConfig)) 
    return "no luck"
}   




const whyWhyWhy = async (item: Office.MessageRead) : Promise<unknown> => {
    const emptyConfig : any = {}
    const body3  = await officePromise (curry3(item.body.getAsync)(Office.CoercionType.Html)(emptyConfig)) 
    
    //hover over _() to see the type
    const body3b  = await officePromise (curry3 (item.body.getAsync)(Office.CoercionType.Html)(_())) 
    return body3
}   

const typeApplied = async (item: Office.MessageRead) : Promise<string> => {
    const emptyConfig : Office.AsyncContextOptions = {}
    const body3  = await officePromise<string> (
      curry3<Office.CoercionType, Office.AsyncContextOptions, OfficeCallack<string>, void> 
        (item.body.getAsync)
        (Office.CoercionType.Html)
        (emptyConfig)
    ) 

    //hover over _() to see the type 
    const body3b  = await officePromise<string> (
        curry3<Office.CoercionType, Office.AsyncContextOptions, OfficeCallack<string>, void> 
          (item.body.getAsync)
          (Office.CoercionType.Html)
          (_())
      )  
   return body3
}


//Bloopers:

const bloopers = async (item: Office.MessageRead) : Promise<void> => {
    const good : (a: Office.CoercionType) 
            => (b: ((asyncResult: Office.AsyncResult<string>) => void)) 
            => void
        = curry (item.body.getAsync)

    //compiles but it should not, compiles even with type anotation
    const nonsense1 : (a: Office.CoercionType) 
            => (b: ((asyncResult: Office.AsyncResult<string>) => void)) 
            => void
        = curry (curry (item.body.getAsync)) 

    //compiles but it should not
    const nonsense2 = curry(curry) 

    const nonsense3 = curry(curry3)

    const nonsense4 = curry(curry(curry))
}

