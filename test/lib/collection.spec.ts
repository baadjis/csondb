import fs from 'fs';
import {expect} from 'chai';
import { Collection } from '../../src/lib/collection';
import { readJson } from '../../src/lib/utils/files';

describe('Collection test one',()=>{
    const path=__dirname+'/testcollection.json'
    const testCollection= new Collection(path)
    const data={firstname:'cnd',
        lastname:'baadji',
        address:{
        rue:'18 rue linéa',
        codepostal:'75005'
        }
       }

    //test create 
    it('it should return true',()=>{
       testCollection.create(data,true)
       const val=fs.existsSync(path)

       expect(val).to.be.true
    })

    // test find
    it('should return true',()=>{
        const val=testCollection.find() as any[]
        const test= val.length>0;
        expect(test).to.be.true
    })
    // test find by id
    it('should be throw',()=>{
        const val=testCollection.findById('1') 

        expect(val).to.be.throw
    })
    //test find one
    it('should return true',()=>{
         const val=testCollection.findOne({firstname:'cnd'})
         const test = val['firstname']==='cnd'
         expect(test).to.be.true
    })

    it('should be throw',()=>{
        const val=testCollection.findOne({firstname:'cnd1'})
    
        expect(val).to.be.throw
   })

   // test findOneAndUpdate
   it('should return true',()=>{
    const val=testCollection.findOneAndUpdate({firstname:'cnd'},{lasstname:'baadjic'})
    const val1=testCollection.findOne({firstname:'cnd'})
    //check lastname changed
    const test = val['lastname']==='baadjic'
    expect(test).to.be.throw
   })
   //test deleteOne
   it('should be throw',()=>{
    const val=testCollection.deleteOne({firstname:'cnd'})
    const val1=testCollection.findOne({firstname:'cnd'})
    //check  delete firstname cnd

    expect(val1).to.be.throw
   })
    
    if(fs.existsSync(path)){
        fs.unlinkSync(path)
        
    }


})

describe('Collection test many',()=>{
    const path =__dirname+'/testcollection.json'
    const testCollection= new Collection(path)
    const data=[{firstname:'cnd',
        lastname:'baadji',
        address:{
        rue:'18 rue linéa',
        codepostal:'75005'
        }
       },
       {firstname:'cnd1',
        lastname:'baadjic',
        address:{
        rue:'18 rue linéb',
        codepostal:'75005'
        }
       },
       {firstname:'cnd2',
        lastname:'baadjis',
        address:{
        rue:'18 rue linéb',
        codepostal:'75005'
        }
       },
    
    ]
    it('should return true',()=>{
         testCollection.insertMany(data,true)
         const res=readJson(path) as any[];
         // check  if data is inserted
         const test=res.length >=data.length;
         expect(test).to.be.true
    })
    // test find many
    it('should return true',()=>{
        const res=testCollection.findMany({firstname:{$isin:['cnd1','cnd']}})as any[]
    
        // check  if found
        const test=res.length>0

        expect(test).to.be.true
   })
   // find many and update
   it('should return true',()=>{
         const datar= testCollection.findManyAndUpdate({lastname:'baadjis'},{firstname:'cndb'}) as any[];
         const res= testCollection.findMany({lastname:'baadjis'}) as any[];
         const test=res.every((item)=>item['firstname']==='cndb');

         expect(test).to.be.true

   })

   it('should return true',()=>{
    const datar= testCollection.deleteMany({firstname:'cndb'}) as any[];
    const res= testCollection.findMany({firstname:'cndb'}) as any[];
    // check no item got firstname==='cndb'
    const test=res.length===0

    expect(test).to.be.true

})

it('should return true',()=>{
    testCollection.delete();
    const res = testCollection.find() as any[];
    // check that all the data is deleted
    const test=res.length===0;
    fs.unlinkSync(path)

    expect(test).to.be.true

})

    if(fs.existsSync(path)){
        fs.unlinkSync(path)

    }
})