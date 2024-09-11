
import { OptionType} from '../types';


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
 * chek if variable is an Error's instance
 * @param err 
 * @returns {boolean}
 */
export const isError = (err: unknown): err is Error => err instanceof Error;


/**
 * apply operation to data and resturn true or false given 
 * @param x {any}:data to test
 * @param op {string}: the operation
 * @param y {any}:the value to run operation on
 * @returns {boolean} :the test result
 */


export const applyOperator=(x:any,op:string,y:any):boolean|Error=>{
    switch(op){
        case '$lt': return  x<y
        case '$gt':return  x>y
        case '$lte': return x<=y
        case '$gte':return x>=y
        case '$isin': return (!Array.isArray(y))?Error('$isin should be followed by array')
             : y.includes(x)
        default: return Error('unknown operator') 

    }

}
/**
 * run multiple logics operation for runing filter on data
 * @param {any} data : the item to test
 * @param {any} condition : the filter criteria dictionnary
 * @returns {any}: the test result
 */
export const applyFilter=(data:any,condition:any):boolean|Error=>{
    let test=true ;
    for (let key  of Object.keys(condition)){
        if (key=='$or'){
            if (!Array.isArray(condition[key])){
            
                return Error('$or operator should be followed by error')
            }else{
                let res=false
                for (let k of condition[key]){
                  let appfilter=applyFilter(data,k)
                  if (isError(appfilter) )return appfilter
                  res= res|| appfilter
                }
                test=test && res

            }
        }else if( Object.keys(data).includes(key)){
            if(typeof condition[key]=='object'){
                const cond=condition[key]  
                const op =Object.keys(cond)[0]
                if (isKeyWord(op)){
                    
                    const appOperator=applyOperator(data[key],op,cond[op])
                    if (isError(appOperator)) return appOperator
                    test =test && appOperator
                }else{
                  
                  const appfilter2=applyFilter(data[key],condition[key])
                  if (isError(appfilter2) )return appfilter2
                
                  test=test && appfilter2
                }
                   
            }else{
             
             test= test && data[key]===condition[key]
           }


        }else{
            return false
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
export const findManyWithConditon=(data:any[],condition:any): any[]=>{
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
 * @returns {any[]|Error}:list of data after applying options or Error if somme errors occured
 */
export const applyOptions=(data:any[],options?:OptionType): any[]|Error=>{
    const OptionsKeyWords=['limit','skip','sort'];
    if (options){
        for (let k of Object.keys(options)){
            if(!OptionsKeyWords.includes(k)) return Error(`unknown options keyword ${k}`)
        }
    }
    
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
    
              return Error(`key ${key} is not in data`)
          }
          
          if (options.sort[key]!==1 && options.sort[key]!==1 ){
            
              return Error(`sort value should be 1 or -1`)
          }
          let keyvalue=options.sort[key]
          data.sort((a,b)=>a[key]>b[key] ? keyvalue:(a[key]===b[key]?0:-keyvalue))
  
        }
      }
      
       
    }

    if (options?.skip) {
        start=options.skip
    }
    if (options?.limit){
       limit=options.limit
    }
    data = data.slice(start,limit+start)

    return data
}


