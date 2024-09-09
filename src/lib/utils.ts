import fs from 'fs';
import crypto from 'crypto';
import { OptionType} from './types';

/**
 * Read a json file and return an array of data if the file exists an empty array if not
 * @param {string} dataPath :the path to the json file
 * @returns {any[]} array of a parsed json data
 */
export const readJson=(dataPath:string):any[]=>{
   
    const rawData = fs.readFileSync(dataPath);
    
    try{
         const data=JSON.parse(rawData as unknown as string) 
         return data

    } catch(err){
        
        return []

    }
}

/**
 * write data to json file
 * @param {any} data  :the data to write
 * @param {string} dataPath : path to the json file
 */
export const writeJson=(data:any,dataPath:string)=>{
    let rawData=JSON.stringify(data,null,4)
    fs.writeFileSync(dataPath,rawData);
}
/**
 * add id and timestamps(if necessary) to data before writing to json file
 * @param {any} data : the data
 * @param {boolean}timestamps : boolean param allowing to add or not timestamps 
 * @returns {any}: the modified data
 */
const addIdToData=(data:any,timestamps:boolean=false): any=>{
    let newData={id:crypto.randomUUID(),...data};
    if (timestamps) newData={createdAt:new Date(),...newData}
    return newData

}
/**
 * Add new data to a json file
 * @param {any} newData : the data to add
 * @param {string} dataPath : path to json file
 * @param timestamps :boolean param allowing to add or not timestamps 
 * @returns {any}: the added data
 */

export const updateJson=(newData:any,dataPath:string,timestamps:boolean=false): any=>{
    
    let datar=addIdToData(newData,timestamps)
    let data:any[] =[]
    if(fs.existsSync(dataPath)) data=readJson(dataPath)
    
    data.push(datar)

    writeJson(data,dataPath)
    return datar

}

/**
 * Add new array of data to a json file
 * @param {any[]} newData : array of data to add
 * @param {string} dataPath : path to json file
 * @param timestamps :boolean param allowing to add or not timestamps 
 * @returns {any[]}: array of added data
 */
export const updateJsonWithArray=(newData:any[],dataPath:string,timestamps:boolean=false): any[]=>{
    
    let data:any[] =[]
    if(fs.existsSync(dataPath)) data=readJson(dataPath)
    let datar=newData.map((item)=>{
        const itemWithId=addIdToData(item,timestamps)
        data.push(itemWithId)
        return itemWithId
    })
    

    writeJson(data,dataPath)
    return datar

}

//data logic 


const KeyWords=[
        '$gt',
        '$lte',
        '$gte',
        '$isin',
        '$or'
]
/**
 * check if key is from KeyWords list
 * @param {string} key : the key to check
 * @returns {boolean}:the results
 */
export const isKeyWord=(key:string):boolean=>KeyWords.includes(key);
/**
 * apply operation to data and resturn true or false given 
 * @param x {any}:data to test
 * @param op {string}: the operation
 * @param y {any}:the value to run operation on
 * @returns {boolean} :the test result
 */
const applyOperator=(x:any,op:string,y:any):boolean=>{
    switch(op){
        case '$lt': return  x<y
        case '$gt':return  x>y
        case '$lte': return x<=y
        case '$gte':return x>=y
        case '$isin': if(!Array.isArray(y)){console.error('$isin should be followed by array')
             return false } return y.includes(x)
        default:console.error('unknown operator') 
        return false
    }

}
/**
 * run multiple logics operation for runing filter on data
 * @param {any} data : the item to test
 * @param {any} condition : the filter criteria dictionnary
 * @returns {any}: the test result
 */
export const applyFilter=(data:any,condition:any):boolean=>{
    let test=true ;
    for (let key  of Object.keys(condition)){
        if (key=='$or'){
            if (!Array.isArray(condition[key])){
                console.error('$or operator should be followed by error')
                return false
            }else{
                let res=false
                for (let k of condition[key]){
            
                res= res|| applyFilter(data,k)
                }
                test=test && res

            }
        }else if( Object.keys(data).includes(key)){
            if(typeof condition[key]=='object'){
                   let cond=condition[key]  
                   const op =Object.keys(cond)[0]
                   test =test && applyOperator(data[key],op,cond[op])
            }else{
             test= test && (data[key]==condition[key])
           }

        }

    }
    return test
}
/**
 * find the first index of item verifying a condition
 * @param {any[]}data :the array of data
 * @param {any} condition : condition dictionnary
 * @returns {number}: the index
 */
export const findIndexWithCondition=(data:any[],condition:any): number=>{
    let res=data.findIndex(
        (item)=>applyFilter(item,condition)
    )
    return res
}

/**
 * find list of items from array verifying condition 
 * @param {any[]}data : the list of data
 * @param {any} condition :the condition dictionnary
 * @returns {any[]}: the list of items
 */
export const findManyWithConditon=(data:any[],condition:any)=>{
    return data.filter(

        (item:any)=>applyFilter(item,condition)
    )
}

/**
 * update an object with new data
 * @param {any} dict :the data to modify
 * @param {any} newData :the new data
 */
export const updateDict=(dict:any,newData:any)=>{
    let keys=Object.keys(newData);
    for(let key of keys){
        dict[key]=newData[key]
    }
    
}
/**
 * aply options after querying data (eg: sort ,apply limit ,skip)
 * @param {any[]} data: the list of data
 * @param {OptionType} options :options to apply
 * @returns {any[]|undefined}:list of data after applying options or undefined if somme errors occured
 */
export const applyOptions=(data:any[],options?:OptionType): any[]|undefined=>{

    let start=0;
    let limit=data.length;
    if (options?.sort){
       
      if (typeof options.sort ==="function"){
          data.sort((options.sort))
      }else{
        let sortKeys:string[]=Object.keys(options.sort)
        let dataKeys= Object.keys(data[0])
        for(let key of sortKeys){
          
          if (! dataKeys.includes(key)){
              console.error(`key ${key} is not in data`)
              return
          }
          
          if (options.sort[key]!==1 && options.sort[key]!==1 ){
              console.error(`sort value should be 1 or -1`)
              return
          }
          let keyvalue=options.sort[key]
          data.sort((a,b)=>a[key]>b[key] ? keyvalue:-keyvalue)
  
        }
      }
      
       
    }

    if (options?.skip) {
        start=options.skip
    }
    if (options?.limit){
       limit=options.limit
    }
    data= data.slice(start,limit+start)

    return data
}


