import fs from 'fs'
import { readJson, writeJson, updateJson, findWithCondition, updateDict, updateJsonWithArray } from './utils'


class Collection{
    path: string
    constructor(path:string){
        this.path=path
    }

    create(data:any,timestamps:boolean=false){
      return updateJson(data,this.path,timestamps)
    }
    insertMany(data:any[],timestamps:boolean=false){
        return updateJsonWithArray(data,this.path,timestamps)
    }

    find(){
        const data =readJson(this.path)
        return data
    }

    findOne(condition:any){

        const data =readJson(this.path)||[]
        let res=findWithCondition(data,condition)
        if (res==-1) return Error('Not Found')

        return data[res]
    }

    deleteOne(condition:any){

        let data =readJson(this.path)||[]

        let res=findWithCondition(data,condition)
        if (res==-1) return Error('Not Found')

        data.splice(res,1)
        writeJson(data,this.path)
        return res
    }

    findById(id:string){

        return this.findOne({id})
    }

    findOneAndUpdate(condition:any,newData:any){

        const data =readJson(this.path)||[]

        let res=findWithCondition(data,condition)
        
        if (res==-1) return Error('Not Found')

        updateDict(data[res], newData)
        writeJson(data,this.path)

        return data[res]
    
    }

    findMany(condition:any){
        const data =readJson(this.path)||[]
        let res=data.filter(

            (item:any)=>{
                let conditionKeys=Object.keys(condition)
                return (conditionKeys.every(key=>(item[key]!=undefined && item[key]==condition[key])))
                
            }
        )
        return res
    }

    findManyAndUpdate(condition:any,newData:any){
        let data =readJson(this.path)||[]
        let results:any[]=[]
        data.forEach(
            (item:any)=>{
                let conditionKeys=Object.keys(condition)
                if (conditionKeys.every(key=>(item[key]!=undefined && item[key]==condition[key])))
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
    
    deleteMany(condition:any){
        let data =readJson(this.path)||[]
        let results:any[]=[]
        data.forEach(
            (item:any)=>{
                let conditionKeys=Object.keys(condition)
                if (conditionKeys.every(key=>(item[key]!=undefined && item[key]==condition[key])))
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

class Schema{
    timestamps: boolean
    description: any
    constructor(description:any){
        this.description=description
        this.timestamps=false
    }
    setTimestamps(value:boolean){
        this.timestamps=value
    }
}

class Model {
    colletion: Collection
    schema: Schema
    constructor(colletion:Collection,schema:Schema){
        this.colletion=colletion
        this.schema=schema

    }
    isInSchema(key:string){
        /*chek if a key in the schema description*/
        const schemakeys=Object.keys(this.schema.description)
        if (!schemakeys.includes(key)){
            console.error(`${key} is not defined in the Schema`)
            return false
        }
        return true
        

    }
    checkIsRequired(data:any,key:string){
        
        if(this.schema.description[key]['required']!=undefined && this.schema.description[key]['required']===true && data[key]==undefined){
            console.error(`key ${key} is required`)
            return false
        }
        return  true
    }
    checkType(data:any,key:string){
        if (data[key].constructor.name!=this.schema.description[key]['type'].name){
            console.error(`key should be of type:${this.schema.description[key]['type'].name}`)
            return false
        }
        return true
       
    }
    validateData(data:any){
          const schemakeys=Object.keys(this.schema.description)
          const datakeys=Object.keys(data)
          let check= schemakeys.every((key)=>this.checkIsRequired(data,key)&& this.checkType(data,key));
          return check && datakeys.every((key)=>this.isInSchema(key))
          
    }
    validateCondition(condition:any){
        const datakeys=Object.keys(condition)
        return datakeys.every((key)=> (this.isInSchema(key) && this.checkType(condition,key))||  (key=='id'));
        

    }

    create(data:any){
        if (!this.validateData(data)) return Error('Ivalide data for schema')
        
        return this.colletion.create(data,this.schema.timestamps)
    }
    insertMany(data:any[]){
        for(let item of data){
            if (!this.validateData(item)) return Error('Ivalide data for schema')
        }
        return this.colletion.insertMany(data,this.schema.timestamps)

    }
    find(){
        return this.colletion.find()
    }
    findMany(condition:any){
        if(!this.validateCondition(condition)) return Error('Invalid condition')
        return this.colletion.findMany(condition)
    }

    findOne(condition:any){
        if(!this.validateCondition(condition)) return Error('Invalid condition')

        return this.colletion.findOne(condition)
    }
    findById(id:string){
        return this.colletion.findById(id)
    }

    findOneAndUpdate(condition:any,newData:any){

        if(!this.validateCondition(condition)) return Error('Invalid condition');
        if(!this.validateCondition(newData)) return Error('Invalid new Data entries');
        if (this.schema.timestamps==true){
            newData={updatedAt: new Date() ,...newData}
        }
        return this.colletion.findOneAndUpdate(condition,newData)
    }

    findManyAndUpdate(condition:any,newData:any){

        if(!this.validateCondition(condition)) return Error('Invalid condition');
        if(!this.validateCondition(newData)) return Error('Invalid new Data entries');
        if (this.schema.timestamps==true){
            newData={updatedAt: new Date(),...newData}
        }
        return this.colletion.findManyAndUpdate(condition,newData)
    }

    deleteOne(condition:any){
        if(!this.validateCondition(condition)) return Error('Invalid condition');
        return this.colletion.deleteOne(condition)
    }

    deleteMany(condition:any){
        if(!this.validateCondition(condition)) return Error('Invalid condition');
        return this.colletion.deleteMany(condition)
    }

}
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