import { applyFilter, applyOperator, isKeyWord } from '../../../src/lib/utils/data';
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
    it('shoould return true',()=>{
         const val=applyFilter(data,{$or:[{firstname:'cnd'},{lastname:'baadjis'}]});
         expect(val).to.be.true
        }
    )

    it('shoould return false',()=>{
        const val=applyFilter(data,{firstname:'cnd',lastname:'baadjis'});
        expect(val).to.be.false
       }
   )
})