import fs from 'fs';
import {expect} from 'chai';
import { addDefault, checkIsRequired, checkType, isInSchema, isRequired, Schema, validateCondition, validateData } from '../../src/lib/schema';

describe('Test add default',()=>{
    const accountSchema = new Schema({
        firstname:{
            type:String,
            required:true
        },
        amount:{type:Number,
            default:0
        }

    
    })
    let data:any={firstname:'cnd'};
    it('should return true',()=>{
        addDefault(data,accountSchema.description);
        const test=data['amount']===0;
        expect(test).to.be.true

    })
    

})

describe('Test validator',()=>{
    const accountSchema = new Schema({
        firstname:{
            type:String,
            required:true
        },
        amount:{type:Number,
            validator:(x:number)=> (x>=0 && x<1000)
        }

    
    })
    let data:any={firstname:'cnd',
        amount:1500
    };
    it('should return false',()=>{
        
        const test=validateData(data,accountSchema);
        expect(test).to.be.false

    })
    

})
describe('Test isInSchema',()=>{

    const personSchema = new Schema({
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
    it('should return true',()=>{
        const val= isInSchema('address',personSchema.description);
        expect(val).to.be.true
    })
    it('should return false',()=>{
        const val = isInSchema('phone',personSchema.description);
        expect(val).to.be.false
    })

})

describe('Test isRequired',()=>{

    const personSchema = new Schema({
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
    const data={firstname:'cnd',
        lastname:'baadji',
        address:{
        rue:'18 rue linéa',
        codepostal:'75005'
        }
       }
       const data2={firstname:'cnd',
    
        address:{
        rue:'18 rue linéb',
        codepostal:'75005'
        }
       }
    it('should return true',()=>{
        const val= checkIsRequired(data,personSchema.description);
        expect(val).to.be.true
    })
    it('should return false',()=>{
        const val = checkIsRequired(data2,personSchema.description);
        expect(val).to.be.false
    })

})


describe('Test checkType',()=>{
    const personSchema = new Schema({
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
    const data={firstname:'cnd',
        lastname:'baadji',
        address:{
        rue:'18 rue linéa',
        codepostal:'75005'
        }
       }
       const data2={firstname:'cnd',
        lastname:123,
        address:{
        rue:'18 rue linéb',
        codepostal:'75005'
        }
       }
       it('should return true',()=>{
        const val= checkType(data,'lastname',personSchema.description);
        expect(val).to.be.true
    })
    it('should return false',()=>{
        const val = checkType(data2,'lastname',personSchema.description);
        expect(val).to.be.false
    })
})

describe('Test validateData',()=>{
    const personSchema = new Schema({
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
    const data={firstname:'cnd',
        lastname:'baadji',
        address:{
        rue:'18 rue linéa',
        codepostal:75005
        }
       }

    const data1={
        firstname:'cnd',
        lastname:'baadji'
       }
    const data2={
        firstname:'cnd',
        lastname:'baadji',
        address:{
        rue:'18 rue linéb'
        }
    }
    it('shoul return true',()=>{
        const val= validateData(data,personSchema)
        expect(val).to.be.true
    })
    
    it('shoul return false',()=>{
        const val= validateData(data1,personSchema);
        expect(val).to.be.false
    })
    // check one required field is missing from nested field
    it('shoul return false',()=>{
        const val=isRequired(data2,personSchema.description);
        expect(val).to.be.false
    })
})


describe('Test validateCondition',()=>{
    const personSchema = new Schema({
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
    const condition={firstname:'cnd',
        lastname:'baadji'
        
       }

    const condition1={
        
        age:12
       }
    const condition2={
        firstname:{$isin:["baadjis","baadjic"]}
    }
    it('shoul return true',()=>{
        const val= validateCondition(condition,personSchema)
        expect(val).to.be.true
    })

    it('shoul return false',()=>{
        const val= validateCondition(condition1,personSchema);
        expect(val).to.be.false
    })
    it('shoul return true',()=>{
        const val= validateCondition(condition2,personSchema);
        expect(val).to.be.true
    })
})

