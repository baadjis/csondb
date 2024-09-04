import fs from 'fs';
import crypto from 'crypto';

export const readJson=(dataPath:string)=>{
   
    const rawData = fs.readFileSync(dataPath);
    
    try{
         const data=JSON.parse(rawData as unknown as string) 
         return data

    } catch(err){
        
        return []

    }
}


export const writeJson=(data:any,dataPath:string)=>{
    let rawData=JSON.stringify(data,null,4)
    fs.writeFileSync(dataPath,rawData);
}
const addIdToData=(data:any,timestamps:boolean=false)=>{
    let newData={id:crypto.randomUUID(),...data};
    if (timestamps) newData={createdAt:new Date(),...newData}
    return newData

}
export const updateJson=(newData:any,dataPath:string,timestamps:boolean=false)=>{
    
    let datar=addIdToData(newData,timestamps)
    let data:any[] =[]
    if(fs.existsSync(dataPath)) data=readJson(dataPath)
    
    data.push(datar)

    writeJson(data,dataPath)
    return datar

}

export const updateJsonWithArray=(newData:any[],dataPath:string,timestamps:boolean=false)=>{
    
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


export const findWithCondition=(data:any[],condition:any)=>{
    let res=data.findIndex(
        (item)=>{
          for (var key in condition){
                if(item[key]===undefined || item[key]!=condition[key]) return false
            }
            return true
        }
    )
    return res
}

export const updateDict=(dict:any,newData:any)=>{
    let keys=Object.keys(newData);
    for(let key of keys){
        dict[key]=newData[key]
    }
    
}

