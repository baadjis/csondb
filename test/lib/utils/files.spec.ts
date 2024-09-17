import {expect} from 'chai';
import { readJson, updateJson, updateJsonWithArray, writeJson } from '../../../src/lib/utils/files';
import fs from 'fs'
describe('readJson test',()=>{

    it('should be empty',()=>{
        if(fs.existsSync(__dirname+'/test.json')){
            fs.unlinkSync(__dirname+'/test.json')
        }
        const val = readJson(__dirname+'/test.json');
        expect(val).to.be.empty
    })
    it('should return true',()=>{
        
        const result=readJson(__dirname+'/test1.json') as any[]
        expect(result.length>=1).to.be.true
    })
})

describe('writeJson test',()=>{
    const data={firstname:'cnd',lastname:'baadji',address:{
        rue:'18 rue liné',codepostal:'75005'
    }}
    it('should return true',()=>{
        const datar=writeJson(data, __dirname+'/test.json')
        const result=fs.existsSync(__dirname+'/test.json')
        //delete file after the test
        fs.unlinkSync(__dirname+'/test.json')
        
        expect(result).to.be.true
    })
    
})

describe('updateJson test',()=>{
    const data={firstname:'cnd',lastname:'baadji',address:{
        rue:'18 rue liné',codepostal:'75005'
    }}
    const data1={firstname:'cnd1',lastname:'baadjis',address:{
        rue:'18 rue liné',codepostal:'75005'
    }}
    
  it('should return true',()=>{
      const datar=updateJson(data,__dirname+'/test2.json',true)
      const res=(Object.keys(datar).includes('id') &&  Object.keys(datar).includes('createdAt'))
      const res1= readJson(__dirname+'/test2.json') as any[];
      const datar1=updateJson(data1,__dirname+'/test2.json',true)
      //after update
      const res2= readJson(__dirname+'/test2.json')as any[];
      //compare legth after update
      expect(res&&(res2.length>res1.length)).to.be.true
  })
 

})

describe('updateJsonWithArray test',()=>{
    const data=[{firstname:'cnd',lastname:'baadji',address:{
        rue:'18 rue liné',codepostal:'75005'
    }}
    ,{firstname:'cnd1',lastname:'baadjis',address:{
        rue:'18 rue liné',codepostal:'75005'
    }}]
    
  it('should return true',()=>{
      const res =readJson(__dirname+'/test2.json') as any[];
      const datar=updateJsonWithArray(data,__dirname+'/test2.json',true);
      //after update with many
      const res1=readJson(__dirname+'/test2.json') as any[]
    // delete file after test
      fs.unlinkSync(__dirname+'/test2.json')

      // compare length
      expect(res.length<res1.length).to.be.true
  })


})