import fs from 'fs';
import {expect} from 'chai';
import { Schema } from '../../src/lib/schema';
import { createModel } from '../../src/lib/model';
import { readJson } from '../../src/lib/utils/files';

describe('Test create model',()=>{
  
   
const TestSchema = new Schema({
    firstname:{
        type:String,
        required:true
    }
    ,
    lastname:{
        type:String,
        required:true
    },
    address:{
       rue:{
        type:String,
        required:true
       },
       codepostal:{
           type:Number,
           required:true
       }
    }
    });
    
    const dir=process.cwd()+'/csondb';
    //const path =dir+'/data/testschema.json';

    it('should return true',()=>{
        const Person=createModel('testschema',TestSchema);
        const val= fs.existsSync(dir)
        //fs.rmSync(dir,{recursive:true,force:true})

        expect(val).to.be.true
    })


})


describe('Model test one',()=>{

const TestSchema = new Schema({
    firstname:{
        type:String,
        required:true
    }
    ,
    lastname:{
        type:String,
        required:true
    },
    address:{
       rue:{
        type:String,
        required:true
       },
       codepostal:{
           type:Number,
           required:true
       }
    }
})
const dir=process.cwd()+'/csondb'
const path = dir+'/data/testschema.json'
    //const path=__dirname+'/testcollection.json'
const Person=createModel('testschema',TestSchema);

    const data={firstname:'cnd',
        lastname:'baadji',
        address:{
        rue:'18 rue liné',
        codepostal:75005
        }
       }

    //test create 
    it('it should return true',()=>{
       Person.create(data)
       
       const val=fs.existsSync(path)

       expect(val).to.be.true
    })

    // test find
    it('should return true',()=>{
        const val=Person.find() as any[]
        const test= val.length>0;
        expect(test).to.be.true
    })
    // test find by id
    it('should be throw',()=>{
        const val=Person.findById('1') 

        expect(val).to.be.throw
    })
    //test find one
    it('should return true',()=>{
         const val=Person.findOne({firstname:'cnd'})
         const test = val['firstname']==='cnd'
         expect(test).to.be.true
    })

    it('should be throw',()=>{
        const val=Person.findOne({firstname:'cnd1'})
    
        expect(val).to.be.throw
   })

   // test findOneAndUpdate
   it('should return true',()=>{
    const val=Person.findOneAndUpdate({firstname:'cnd'},{ $set:{lasstname:'baadjic'}})
    const val1=Person.findOne({firstname:'cnd'})
    //check lastname changed
    const test = val1['lastname']==='baadjic'
    expect(test).to.be.throw
   })
   //test deleteOne
   it('should be throw',()=>{
    const val=Person.deleteOne({firstname:'cnd'})
    const val1=Person.findOne({firstname:'cnd'})
    //check  delete firstname cnd

    expect(val1).to.be.throw

   })
    
    if(fs.existsSync(path)){
        fs.unlinkSync(path)
        
    }

    //fs.rmSync(dir,{recursive:true,force:true})


})

describe('Model test many',()=>{
    //const path =__dirname+'/testcollection.json'

const TestSchema = new Schema({
    firstname:{
        type:String,
        required:true
    }
    ,
    lastname:{
        type:String,
        required:true
    },
    address:{
       rue:{
        type:String,
        required:true
       },
       codepostal:{
           type:Number,
           required:true
       }
    }
})
     const dir=process.cwd()+'/csondb'
    const path =dir+'/data/testschema.json'
    const Person=createModel('testschema',TestSchema);

    const data=[{firstname:'cnd',
        lastname:'baadji',
        address:{
        rue:'18 rue linéa',
        codepostal:75005
        }
       },
       {firstname:'cnd1',
        lastname:'baadjic',
        address:{
        rue:'18 rue linéb',
        codepostal:75005
        }
       },
       {firstname:'cnd2',
        lastname:'baadjis',
        address:{
        rue:'18 rue linéc',
        codepostal:75005
        }
       },
    
    ]
    it('should return true',()=>{
         Person.insertMany(data)
         const res=readJson(path) as any[];
         // check  if data is inserted
         const test=res.length >=data.length;
         expect(test).to.be.true
    })
    // test find many
    it('should return true',()=>{
        const res=Person.findMany({firstname:{$isin:['cnd1','cnd']}})as any[]
    
        // check  if found
        const test=res.length>0

        expect(test).to.be.true
   })
   // find many and update
   it('should return true',()=>{
         const datar= Person.findManyAndUpdate({lastname:'baadjis'},{$set:{firstname:'cndb'}}) as any[];
         const res= Person.findMany({lastname:'baadjis'}) as any[];
         const test=res.every((item)=>item['firstname']==='cndb');

         expect(test).to.be.true

   })

   it('should return true',()=>{
    const datar= Person.deleteMany({firstname:'cndb'}) as any[];
    const res= Person.findMany({firstname:'cndb'}) as any[];
    // check no item got firstname==='cndb'
    const test=res.length===0

    expect(test).to.be.true

})
it('should return true',()=>{
    Person.update({$set:{firstname:'cnd'}});
    const data= Person.find() as any[]
    const test= data.every((item:any)=>item['firstname']==='cnd');
    expect(test).to.be.true
})
//test count 
it('should return true',()=>{
    const data= Person.find() as any[]
    const counts = Person.count();
    const test= counts==data.length
    expect(test).to.be.true
})

it('should return true',()=>{
    const data= Person.findMany({firstname:'cnd'}) as any[]
    const counts = Person.count({firstname:'cnd'})
    const test= counts==data.length
    expect(test).to.be.true
})
it('should return true',()=>{
    Person.delete();
    
    const res = Person.find() as any[];
    // check that all the data is deleted
    const test=res.length===0;
    

    fs.rmSync(dir,{recursive:true,force:true})

    expect(test).to.be.true

})

    if(fs.existsSync(path)){
        fs.unlinkSync(path)

    }
})