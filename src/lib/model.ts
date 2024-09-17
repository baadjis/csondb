import fs from 'fs'
import { Collection } from "./collection"
import { Schema, validateCondition, validateData } from "./schema"
import { OptionType } from './types'
import { writeJson } from './utils/files'

/**
 * class for creating models
 */
export class Model {
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
     * insert an element to the collection
     * @param {any} data : the new element
     * @returns {any}:added data
     */
    create(data:any): any{
        if (!validateData(data,this.schema)) return Error('Ivalide data for schema')
        
        return this.colletion.create(data,this.schema.timestamps)
    }
    /**
     * insert a list of elements to the collection
     * @param {any} data : the new element
     * @returns {any[]|Error}:list of added data or Error
     */
    insertMany(data: any[]): any[]|Error{
        for(let item of data){
            if (!validateData(item,this.schema)) {
                console.log(item)
                return Error('Ivalide data for schema')}
        }
        return this.colletion.insertMany(data,this.schema.timestamps)

    }
    
    /**
     * find all data from the collection
     * @param {OptionType} options : options to apply
     * @returns {any[]|Error}:list of data or undefined if some errors occured
     */
    find(options?:OptionType): any[] | Error{
        return this.colletion.find(options)
    }


    /**
     * find a list of items from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @param {OptionType} options: the options to apply after querying
     * @returns {any[]|Error}: list of items or Error if some errors occured
     */
    findMany(condition:any,options?:OptionType): any[] | Error{
        if(!validateCondition(condition,this.schema)) return Error('Invalid condition')
        return this.colletion.findMany(condition,options)
    }

      /**
     * find first item from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {any|Error}: data or undefined if some errors occured
     */
    findOne(condition:any): any | Error{
        if(!validateCondition(condition,this.schema)) return Error('Invalid condition')

        return this.colletion.findOne(condition)
    }
    /**
     * find elemnt by id 
     * @param {string} id :the id
     * @returns {any|Error} :the found item
     */
    findById(id:string): any|Error{
        return this.colletion.findById(id)
    }

     /**
     * find first item from the collection verifying a condition and update it 
     * @param {any} condition: the filter condition
     * @param {any} newData: the new data for updating
     * @returns {any|Error}:  index or error if some errors occured
     */
    findOneAndUpdate(condition:any,newData:any): any | Error{

        if(!validateCondition(condition,this.schema)) return Error('Invalid condition');
        if(!validateCondition(newData,this.schema)) return Error('Invalid new Data entries');
        if (this.schema.timestamps==true){
            newData={updatedAt: new Date() ,...newData}
        }
        return this.colletion.findOneAndUpdate(condition,newData)
    }


     /**
     * find list of items from the collection verifying a condition and update 
     * @param {any} condition: the filter condition
     * @param {any} newData: the new data for updating
     * @returns {any[]|Error}:  list of updated items or error if some errors occured
     */
    findManyAndUpdate(condition:any,newData:any): any[] |Error{

        if(!validateCondition(condition,this.schema)) return Error('Invalid condition');
        if(!validateCondition(newData,this.schema)) return Error('Invalid new Data entries');
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
        if(!validateCondition(condition,this.schema)) return Error('Invalid condition');
        return this.colletion.deleteOne(condition)
    }
    /**
     * delete list of items from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {any[]|Error}:  list index or error if some errors occured
     */
    deleteMany(condition:any): any[] |Error{
        if(!validateCondition(condition,this.schema)) return Error('Invalid condition');
        return this.colletion.deleteMany(condition)
    }

    /**
     * delete all elements from a collection
     
     */
    delete(){
        this.colletion.delete()
    }

}
/**
 * create a model
 * @param {string} name :model name
 * @param {Schema}schema :the schema
 * @returns {Model}:created model
 */
export const createModel=(name:string,schema:Schema): Model=>{
    const dir=process.cwd()+'/csondb/data/'
    const path =dir+name+'.json'
    
    if(!fs.existsSync(dir)){
        fs.mkdirSync(dir,{recursive:true,
        
        })
        //fs.writeFileSync(path,'');


    } 
    const collection = new Collection(path)
    return new Model(collection,schema)
}