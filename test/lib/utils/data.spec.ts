import { applyFilter, applyOperator, applyOptions, findIndexWithCondition, findManyWithConditon, isKeyWord } from '../../../src/lib/utils/data';
import {expect} from 'chai';

describe('is keyword test',()=>{
    it('should return false',()=>{
        const val=isKeyWord('firstname')
        expect(val).to.be.false
    })

    it('should return true',()=>{
        const val=isKeyWord('$or')
        expect(val).to.be.true
    })
})


describe('apply operator test',()=>{
    it('should return false',()=>{
        const val=applyOperator(1,'$gte',2)
        expect(val).to.be.false
    })

    it('should return true',()=>{
        const val=applyOperator(1,'$lte',2)
        expect(val).to.be.true
    })

    it('should return true',()=>{
        const val=applyOperator(1,'$isin',[1,2])
        expect(val).to.be.true
    })

    it('should return error',()=>{
        const val=applyOperator(1,'$l',2)
        expect(val).to.be.Throw
    })

})

describe('apply filter test',()=>{
    const data={firstname:'cnd',lastname:'baadji',address:{
        rue:'18 rue liné',codepostal:'75005'
    }}
    it('should return true',()=>{
         const val=applyFilter(data,{$or:[{firstname:'cnd'},{lastname:'baadjis'}]});
         expect(val).to.be.true
        }
    )

    it('shoould return false',()=>{
        const val=applyFilter(data,{firstname:'cnd',lastname:'baadjis'});
        expect(val).to.be.false
       }
   )

   it('shoould return true',()=>{
    const val=applyFilter(data,{address:{codepostal:'75005'}});
    expect(val).to.be.true
   }
)
it('should return error',()=>{
    const val=applyFilter(data,{firstname:{$isin: 'cnd'}});
    expect(val).to.be.throw
   }
)

})

describe('find index with condition test',()=>{
    const data=[
        {firstname:'cnd',
            lastname:'baadji',
            address:{
            rue:'18 rue liné',
            codepostal:'75005'
          }
        }
        ,
        {
          firstname:'cnd1',
          lastname:'baadjis',
            address:{
            rue:'18 rue liné',
            codepostal:'75005'
           }
        }
    ]
    it('should return -1',()=>{
        const val=findIndexWithCondition(data,{firstname:'cnd2'})
        expect(val).to.be.equal(-1)
    })
    it('should return 1',()=>{
        const val=findIndexWithCondition(data,{firstname:'cnd1'})
        expect(val).to.be.equal(1)
    })

    it('should return -1',()=>{
        const val=findIndexWithCondition(data,{firstname:'cnd1',lastname:'baadjic'})
        expect(val).to.be.equal(-1)
    })

    it('should return 1',()=>{
        const val=findIndexWithCondition(data,{ $or:[{firstname:'cnd1'},{lastname:'baadjic'}]})
        expect(val).to.be.equal(1)
    })
})
describe('find many with condition',()=>{
    const data=[
        {firstname:'cnd',
            lastname:'baadji',
            address:{
            rue:'18 rue liné',
            codepostal:'75005'
          }
        }
        ,
        {
          firstname:'cnd1',
          lastname:'baadjis',
            address:{
            rue:'18 rue liné',
            codepostal:'75005'
           }
        }
    ]
    it('should return true',()=>{
        const val =findManyWithConditon(data,{ $or:[{firstname:'cnd1'},{lastname:'baadjic'}]});
        expect(Array.isArray(val)).to.be.true
    })
})

describe('apply options test',()=>{
    const data=[
        {firstname:'cnd',
            lastname:'baadji',
            address:{
            rue:'18 rue liné',
            codepostal:'75005'
          }
        }
        ,
        {
          firstname:'cnd1',
          lastname:'baadjis',
            address:{
            rue:'18 rue liné',
            codepostal:'75005'
           }
        }
    ]
    it('should return 1',()=>{
        const val= (applyOptions(data,{limit:1}) as any[])
        expect(val.length).to.be.equal(1)
    })
    it('should return true',()=>{
        applyOptions(data,{sort:{firstname:1}})
    
        const result=data[1]['firstname']>data[0]['firstname']
        expect(result).to.be.true
    })
    it('should return 1',()=>{
        const val= (applyOptions(data,{skip:1}) as any[])
        expect(val.length).to.be.equal(1)
    })
})