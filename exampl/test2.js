const { Schema, createModel,isRequired } = require("..");

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
    rue:'18 rue liné',
    codepostal:75005
    }
   }

const data1={
    firstname:'cnd',
    lastname:'baadji'
   }

console.log(isRequired(personSchema.description,"address"))