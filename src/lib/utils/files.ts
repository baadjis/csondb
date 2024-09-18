import fs from 'fs';
import crypto from 'crypto';

/**
 * Read a json file and return an array of data if the file exists an empty array if not
 * @param {string} dataPath :the path to the json file
 * @returns {any[]} array of a parsed json data
 */
export const readJson=(dataPath:string):any[]|Error=>{
    if(!fs.existsSync(dataPath)) return Error('No such file')
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
const preInsertData=(data:any,timestamps:boolean=false): any=>{
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
    
    let datar=preInsertData(newData,timestamps)
    let data:any[] =[]
    if(fs.existsSync(dataPath)) data=readJson(dataPath) as any[]
    
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
    if(fs.existsSync(dataPath)) data=readJson(dataPath) as any[]
    let datar=newData.map((item)=>{
        const itemWithId=preInsertData(item,timestamps)
        data.push(itemWithId)
        return itemWithId
    })
    

    writeJson(data,dataPath)
    return datar

}
