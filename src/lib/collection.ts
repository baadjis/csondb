
import { findIndexWithCondition, updateDict, applyOptions, findManyWithConditon ,applyFilter, isError} from './utils/data'
import { readJson, writeJson, updateJson, updateJsonWithArray} from './utils/files'

import { OptionType, UpdateType } from './types'

/**
 * Collection class
 */
export class Collection{
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
     * @returns {any[]|Error}:list of data or Error if some errors occured
     */
    find(options?:OptionType): any[] | Error{
        let data =readJson(this.path)
        if (isError(data)) return data
        return applyOptions(data,options)
    }

     /**
     * find first item from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {any|Error}: data or Error if some errors occured
     */
    findOne(condition:any): any | Error{

        const data =readJson(this.path)
        if (isError(data)) return data; 
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
        if(isError(data)) return data
        let res=findIndexWithCondition(data,condition)
        if (res==-1) return Error('Not Found')

        data.splice(res,1)
        writeJson(data,this.path)
        return res
    }
    /**
     * find element by id from the collection
     * @param {string} id: the id to find 
     * @returns {any|Error}:return the item or Error if not find
     */
    findById(id:string): any | Error{

        return this.findOne({id})
    }
    /**
     * find first item from the collection verifying a condition and update it
     * @param {any} condition: the filter condition
     * @param {UpdateType} newData : new data for updating
     * @param {boolean} timestamps: add timestamps(uppdatedAt) or no
     * @returns {any|Error}: data or Error if some errors occured
     */
    findOneAndUpdate(condition:any,newData:UpdateType,timestamps?:boolean): any | Error{

        const data =readJson(this.path)
        if (isError(data)) return data

        let res=findIndexWithCondition(data,condition)
        
        if (res==-1) return Error('Not Found')

        updateDict(data[res], newData,timestamps)
        writeJson(data,this.path)

        return data[res]
    
    }

    /**
     * find a list of items from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @param {OptionType} options: the options to apply after querying
     * @returns {any[]|Error}: list of items or Error if some errors occured
     */
    findMany(condition:any,options?:OptionType): any[]|Error{
            
            const data =readJson(this.path) ;
            if (isError(data)) return data;
            let res=findManyWithConditon(data,condition)
            return  applyOptions(res,options)
       
    }
    
    /**
     * find list of items from the collection verifying a condition annd update
     * @param {any} condition: the filter condition
     * @param {UpdateType} newData : new data for updating
     * @param {boolean} timestamps:add timestamps(updatedAt fields) or no 
     * @returns {any[]|Error}: list of modified items or Error if some errors occured
     */
    findManyAndUpdate(condition:any,newData:UpdateType,timestamps?:boolean): any[] | Error{
        let data =readJson(this.path)
        if(isError(data)) return data;
        let results:any[]=[]
        data.forEach(
            (item:any)=>{
                   if (applyFilter(item,condition))
                   {
                    
                        updateDict(item,newData,timestamps)
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
     * update all data
     * @param {any} newData 
     * @param {boolean} timestamps:add timestamps(updatedAt fields) or no 

     * @returns {any[]|Error}
     */
    update(newData:UpdateType,timestamps?:boolean):any[]|Error {
        let data =readJson(this.path)
        if(isError(data)) return data;
        data.forEach((item)=>{
           updateDict(item,newData,timestamps)  
        })
        writeJson(data,this.path)
        return data

    }
    /**
     * delete all elements from a collection
     
     */
    delete(){
        writeJson([],this.path)
    }
    /**
     * delete a list of items from the collection verifying a condition
     * @param {any} condition: the filter condition
     * @returns {any[]|Error}: list of deleted items or Error if some errors occured
     */
    deleteMany(condition:any): any[] | Error{
        let data =readJson(this.path)||[]
        if(isError(data)) return data;
        let results:any[]=[]
        let filteredData:any[]=[]
        data.forEach(
            (item:any)=>{
                
                if(applyFilter(item,condition))
                   {
                    
                        
                        results.push(item)
                    }
                else{
                    filteredData.push(item)
                }

                }
                
            
        )
        if (results.length>0){
            writeJson(filteredData,this.path)
        }
        return results
    }
}