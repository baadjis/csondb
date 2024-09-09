import fs from 'fs'
import { findIndexWithCondition, updateDict, applyOptions, isKeyWord, findManyWithConditon ,applyFilter} from './utils/data'
import { readJson, writeJson, updateJson, updateJsonWithArray} from './utils/files'

import { OptionType } from './types'

/**
 * Collection class
 */
class Collection{
    path: string
    /**
     * create a collection given the collection name
     * @param {string} path :collection name
     */
    constructor(path:string){
        this.path=path
    }
    /**
     * insert an element to the collection
     * @param {any} data : the new element
     * @param {boolean}timestamps : check if timestamps
     * @returns {any}:added data
     */
    create(data:any,timestamps:boolean=false): any{
      return updateJson(data,this.path,timestamps)
    }
    /**
     * insert a list of elements to the collection
     * @param {any} data : the new element
     * @param {boolean}timestamps : check if timestamps
     * @returns {any[]}:list of added data
     */
    insertMany(data:any[],timestamps:boolean=false): any{
        return updateJsonWithArray(data,this.path,timestamps)
    }
    /**
     * find all data from the collection
     * @param {OptionType} options : options to apply
     * @returns {any[]|undefined}:list of data or undefined if some errors occured
     */
    find(options?:OptionType): any[] | undefined{
        let data =readJson(this.path)
        return applyOptions(data,options)
    }

     /**
     * find first item from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {any|undefined}: data or undefined if some errors occured
     */
    findOne(condition:any): any | undefined{

        const data =readJson(this.path)||[]
        let res=findIndexWithCondition(data,condition)
        if (res==-1) return Error('Not Found')

        return data[res]
    }

    /**
     * delete first item from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {number|Error}:  index or error if some errors occured
     */
    deleteOne(condition:any): number | Error{

        let data =readJson(this.path)||[]

        let res=findIndexWithCondition(data,condition)
        if (res==-1) return Error('Not Found')

        data.splice(res,1)
        writeJson(data,this.path)
        return res
    }
    /**
     * find element by id from the collection
     * @param {string} id: the id to find 
     * @returns {any|undefined}:return the item or undefined if not find
     */
    findById(id:string): any | undefined{

        return this.findOne({id})
    }
    /**
     * find first item from the collection verifying a condition and update it
     * @param {any} condition: the filter condition
     * @param {any} newData : new data for updating
     * @returns {any|undefined}: data or undefined if some errors occured
     */
    findOneAndUpdate(condition:any,newData:any): any | undefined{

        const data =readJson(this.path)||[]

        let res=findIndexWithCondition(data,condition)
        
        if (res==-1) return Error('Not Found')

        updateDict(data[res], newData)
        writeJson(data,this.path)

        return data[res]
    
    }

    /**
     * find a list of items from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @param {OptionType} options: the options to apply after querying
     * @returns {any[]|undefined}: list of items or undefined if some errors occured
     */
    findMany(condition:any,options?:OptionType): any[]|undefined{
        const data =readJson(this.path)||[]
        let res=findManyWithConditon(data,condition)
        return  applyOptions(res,options)
    }
    
    /**
     * find list of items from the collection verifying a condition annd update
     * @param {any} condition: the filter condition
     * @param {any} newData : new data for updating
     * @returns {any[]|undefined}: list of modified items or undefined if some errors occured
     */
    findManyAndUpdate(condition:any,newData:any): any[] | undefined{
        let data =readJson(this.path)||[]
        let results:any[]=[]
        data.forEach(
            (item:any)=>{
                   if (applyFilter(item,condition))
                   {
                    
                        updateDict(item,newData)
                        results.push(item)
                    }
                }
                
            
        )
        if (results.length>0){
            writeJson(data,this.path)
        }
        return results
    }
    
    /**
     * delete a list of items from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {any[]|undefined}: list of deleted items or undefined if some errors occured
     */
    deleteMany(condition:any): any[] | undefined{
        let data =readJson(this.path)||[]
        let results:any[]=[]
        data.forEach(
            (item:any)=>{
                
                if(applyFilter(item,condition))
                   {
                    
                        data.shift()
                        results.push(item)
                    }
                }
                
            
        )
        if (results.length>0){
            writeJson(data,this.path)
        }
        return results
    }
}
/**
 * schema class 
 */
class Schema{
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
 * class for creating models
 */
class Model {
    colletion: Collection
    schema: Schema
    /**
     * create model given the collection and the schema
     * @param {Collection} colletion : the model collection
     * @param {Schema} schema : the model schema
     */
    constructor(colletion:Collection,schema:Schema){
        this.colletion=colletion
        this.schema=schema

    }
    /**
     * check if a key is defined in the schemas
     * @param {string} key :the key to check
     * @param {any} description :the schemas description
     * @returns {boolean}:result of the test
     */
    isInSchema(key:string,description:any): boolean{
        /*chek if a key in the schema description*/
        if (!isKeyWord(key)){
        let keys=Object.keys(description[key])
        if (! (keys.includes('type'))){
            for(let k of keys){
                if (!this.isInSchema(k,description[key])) return false
                }  
         }else{
            const schemakeys=Object.keys(description)
            if (!schemakeys.includes(key)){
                console.error(`${key} is not defined in the Schema`)
                return false
            }
         }
        }
        return true
        

    }
     /**
     * check if a key in data  is required from the schemas description
     * @param {data} key :the dictionnary containing the key
     * @param {string} key :the key to check
     * @param {any} description :the schemas description
     * @returns {boolean}:result of the test
     */
    checkIsRequired(data:any,key:string,description:any): boolean{
        if (!isKeyWord(key)){
        if (typeof data[key]==='object'){

            for(let k of Object.keys(data[key])){
                if (!this.checkIsRequired(data[key],k,description[key])) return false
                }  
      }
        else {
            if(description[key]!==undefined && description[key]['required']!=undefined && description[key]['required']===true && data[key]==undefined){
                console.error(`key ${key} is required`)
                return false
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
    checkType(data:any,key:string,description:any): boolean{
        if (!isKeyWord(key)){
            

            if (typeof data[key]==='object'){
                for(let k of Object.keys(data[key])){
                   if(!this.checkType(data[key],k,description[key])) return false
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
     * check if data is valid given the schemas
     * @param {any} data :the data to check
     * @returns {boolean}: the result of the test
     */
    validateData(data:any): boolean{
         
          const datakeys=Object.keys(data);
          
          const description = this.schema.description;
          let inSchemacheck = datakeys.every((key)=>this.isInSchema(key,description))
          let check = datakeys.every((key)=>this.checkIsRequired(data,key,description)&& this.checkType(data,key,description));
          return  inSchemacheck && check 
          
    }
   
    /**
     * check if condition is valid given the schemas(eg: all keys are in the schemas and have same type)
     * @param {any} condition :the data to check
     * @returns {boolean}: the result of the test
     */
    validateCondition(condition:any): boolean{
        const datakeys=Object.keys(condition)
        const description= this.schema.description

        return datakeys.every((key)=> (this.isInSchema(key,description) && this.checkType(condition,key,description))||  (key=='id') || isKeyWord(key));
        

    }

     /**
     * insert an element to the collection
     * @param {any} data : the new element
     * @returns {any}:added data
     */
    create(data:any): any{
        if (!this.validateData(data)) return Error('Ivalide data for schema')
        
        return this.colletion.create(data,this.schema.timestamps)
    }
    /**
     * insert a list of elements to the collection
     * @param {any} data : the new element
     * @returns {any[]|Error}:list of added data or Error
     */
    insertMany(data:any[]): any[]|Error{
        for(let item of data){
            if (!this.validateData(item)) {
                console.log(item)
                return Error('Ivalide data for schema')}
        }
        return this.colletion.insertMany(data,this.schema.timestamps)

    }
    
    /**
     * find all data from the collection
     * @param {OptionType} options : options to apply
     * @returns {any[]|undefined}:list of data or undefined if some errors occured
     */
    find(options?:OptionType): any[] | undefined{
        return this.colletion.find(options)
    }


   
    findMany(condition:any,options?:OptionType){
        if(!this.validateCondition(condition)) return Error('Invalid condition')
        return this.colletion.findMany(condition,options)
    }

      /**
     * find first item from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {any|undefined}: data or undefined if some errors occured
     */
    findOne(condition:any): any | undefined{
        if(!this.validateCondition(condition)) return Error('Invalid condition')

        return this.colletion.findOne(condition)
    }
    /**
     * find elemnt by id 
     * @param {string} id :the id
     * @returns {any} :the found item
     */
    findById(id:string): any{
        return this.colletion.findById(id)
    }

     /**
     * find first item from the collection verifying a condition and update it 
     * @param {any} condition: the filter condition
     * @param {any} newData: the new data for updating
     * @returns {number|Error}:  index or error if some errors occured
     */
    findOneAndUpdate(condition:any,newData:any): number | Error{

        if(!this.validateCondition(condition)) return Error('Invalid condition');
        if(!this.validateCondition(newData)) return Error('Invalid new Data entries');
        if (this.schema.timestamps==true){
            newData={updatedAt: new Date() ,...newData}
        }
        return this.colletion.findOneAndUpdate(condition,newData)
    }


     /**
     * find list of items from the collection verifying a condition and update 
     * @param {any} condition: the filter condition
     * @param {any} newData: the new data for updating
     * @returns {any[]|undefined|Error}:  list of updated items or error if some errors occured
     */
    findManyAndUpdate(condition:any,newData:any): any[] | undefined|Error{

        if(!this.validateCondition(condition)) return Error('Invalid condition');
        if(!this.validateCondition(newData)) return Error('Invalid new Data entries');
        if (this.schema.timestamps==true){
            newData={updatedAt: new Date(),...newData}
        }
        return this.colletion.findManyAndUpdate(condition,newData)
    }
     /**
     * delete first item from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {number|Error}:  index or error if some errors occured
     */
    deleteOne(condition:any): number | Error{
        if(!this.validateCondition(condition)) return Error('Invalid condition');
        return this.colletion.deleteOne(condition)
    }
    /**
     * delete list of items from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {any[]|undefined|Error}:  list index or error if some errors occured
     */
    deleteMany(condition:any): any[] | undefined|Error{
        if(!this.validateCondition(condition)) return Error('Invalid condition');
        return this.colletion.deleteMany(condition)
    }

}
/**
 * create a model
 * @param {string} name :model name
 * @param {Schema}schema :the schema
 * @returns {Model}:created model
 */
const createModel=(name:string,schema:Schema)=>{

    const dir=process.cwd()+'/csondb/data/'
    const path =dir+name+'.json'
    
    if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true,
        
    })
    
    
    
    
    const collection = new Collection(path)
    
    console.log(schema.timestamps)
    return new Model(collection,schema)
}
module.exports={Collection,Model,Schema,createModel}
