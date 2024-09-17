import { isKeyWord } from "./utils/data"

/**
 * schema class 
 */
export class Schema{
    timestamps: boolean
    description: any
    /**
     * create a schema  with  fields definitions
     * @param description 
     */
    constructor(description:any){
        this.description=description
        this.timestamps=false
    }
    setTimestamps(value:boolean){
        this.timestamps=value
    }
}


/**
     * check if a key is defined in the schemas
     * @param {string} key :the key to check
     * @param {any} description :the schemas description
     * @returns {boolean}:result of the test
     */
export const isInSchema=(key:string,description:any): boolean=>{
    /*chek if a key in the schema description*/
    if (!isKeyWord(key)){
    const schemakeys=Object.keys(description)
    if (schemakeys.includes(key)){

    let keys=Object.keys(description[key])
    if (! (keys.includes('type'))){
        for(let k of keys){
            if (!isInSchema(k,description[key])) return false
            }  
     }else{
        return true
        
     }}else{
        
            console.error(`${key} is not defined in the Schema`)
            return false
        
     }

    }
    return true
    

}
/**
 * check if key is required
 * @param{any} description :the schema description
 * @param key{string} : the key description
 * @returns {boolean}
 */
export const isRequired=(description:any,key:string): boolean=>{
    
      if(Object.keys(description).includes(key)){
        const desKeys=Object.keys(description[key])
        // check if it is a nested field
        if (!desKeys.includes("type")){
            // check if there are some required field on nested object
            return desKeys.some((k)=>isRequired(description[key],k))
            
      }else{
        return desKeys.includes('required') && description[key]['required']===true
        
        }
      }
      return false

      }

 /**
 * check if a key in data  is required from the schemas description
 * @param {any}data  :the dictionnary containing the key
 * @param {any} description :the schemas description
 * @returns {boolean}:result of the test
 */
export const checkIsRequired=(data:any,description:any): boolean=>{
    //const dataKeys=Object.keys(data);
    const schemakeys=Object.keys(description);

    const  dataKeys=Object.keys(data)

    for(let key of schemakeys){
        //if(isRequired(description,key) && (data[key]===undefined)) return false
        if (isRequired(description,key)){
        
        if (!Object.keys(description[key]).includes('type')){
            if (dataKeys.includes(key)){
                if (!checkIsRequired(data[key],description[key])) return false

            }else{
                return false
            }
                
      }else {
            
                if (!dataKeys.includes(key)){ 
                    
                        console.error(`key ${key} is required`)
                        return false
                }
            
        }
        }
       
    }
    return  true
}

/**
 * check if a key in data  has the same type defined required from the schemas description
 * @param {data} key :the dictionnary containing the key
 * @param {string} key :the key to check
 * @param {any} description :the schemas description
 * @returns {boolean}:result of the test
 */
export const checkType=(data:any,key:string,description:any): boolean=>{
    if (!isKeyWord(key)){
        

        if (typeof data[key]==='object'){
            for(let k of Object.keys(data[key])){
               if(!checkType(data[key],k,description[key])) return false
            }
        }else{
            if ( description[key]!==undefined && data[key].constructor.name!=description[key]['type'].name){
                console.error(`key should be of type:${description[key]['type'].name}`)
                return false
            }
        }
    }
    
    return true
}

/**
 * check if a key from data is valid regarding  schema description
 * @param data {any}: the data to add
 * @param description {any}: the schema description
 * @param key {string}:the key to check
 * @returns {boolean}:
 */
const isValidKey=(data:any ,description:any ,key:string):boolean=>{
    return (!isKeyWord(key))&&isInSchema(key,description)&& checkType(data,key,description)
}

/**
 * check if data is valid given the schemas
 * @param {any} data :the data to check
 * @returns {boolean}: the result of the test
 */
export const validateData=(data:any,schema:Schema): boolean=>{
     
      const datakeys=Object.keys(data);
      
      const description = schema.description;
      
      return checkIsRequired(data,description) && (datakeys.every((key)=>isValidKey(data,description,key)))
      
}

/**
 * check if condition is valid given the schemas(eg: all keys are in the schemas and have same type)
 * @param {any} condition :the data to check
 * @returns {boolean}: the result of the test
 */
export const validateCondition=(condition:any,schema:Schema): boolean=>{
    const datakeys=Object.keys(condition)
    const description= schema.description
    const specialKeys=['id','createdAt','updatedAt']

    return datakeys.every((key)=> (isInSchema(key,description) && checkType(condition,key,description))||  specialKeys.includes(key) || isKeyWord(key));
    

}