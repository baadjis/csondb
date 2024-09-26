# csondb

A simple npm package for manipulating json file like a document database 

eg: create collections models schemas, and add data ,find ,update and delete

## installation:

the package is not available yet on npm but you can  install it from github:

```sh 
npm install  https://github.com/baadjis/csondb.git

```


```sh 
 npm i @baadjis/csondb
 ```


## import:
 
 

 ```javascript 
 //using Node.js
 const csondb = require('@baadjis/csondb'); 

 //ES6
 import csondb from '@baaadjis/csondb'

 ```
## overview
### collections:

* defining a collection :

```javascript

const Collection = csondb.Collection;

const Person = new Collection('person.json');



```


* add data :

```javascript 

const datar = Person.create(   {firsname:'cnd',
 lastname:'baadjis',
 address:{
    rue:'18 rue linea',
    codepostal:'75005'
    }
 }
 );


 ```


* insert many :

```javascript 
const persons = [
    {
        firstname:'cnd1',
        lastname:'baadji',
        address:{
            rue:'1 rue linéa',
            codepostal:75005
        }
    },
    {
        firstname:'cnd2',
        lastname:'baadji',
        address:{
            rue:'1 rue linéc',
            codepostal:75005
        }
    },
    {
        firstname:'cnd3',
        lastname:'baadjis',
        address:{
            rue:'1 rue linéa',
            codepostal:75005
        }
    },
    {
        firstname:'cnd4',
        lastname:'baadjic',
        address:{
            rue:'1 rue linéb',
            codepostal:75005
        }
    }
];

const datar = Person.insertMany(persons);

```
* finding data:

```javascript 
  // find all
  const datar = person.find()

  //find one with condition

  const datar = Person.findOne({firstname:'cnd1'});

  // find many with condition or
  const datar=Person.findMany({$or:[
   {firstname:'cnd2'},
   {lastname:'baadji'}]
   }
   );

// find by Id
const datar = Person.findById('12333fe-re233');
//will return data or Error



```

we can add options for **findMany** and **find** queries

```javascript
   //limit
   const datar= Person.find({
      limit:1
   })

   //sort lastname ascending skip and limit
   const datar = Person.finMany(  {firstname:  {$isin:['cnd1','cnd2','cnd3']}
      
   }, {$sort: {lastname:1 },$limit:2,$skip:1
      }
   )

 ```

* updating data:

```javascript 
// find and update one
const datar = Person.findOneAndUpdate(
{firsname:'cnd'},
{$set:{lastname:'baadjid'}}
);

//find many and update

const datar = Person.findManyAndUpdate({ firsname:{$isin: ['cnd1','cnd2']
  }
},
  {$set:{lastname:'baadjid'}}

);

//nested data 
const datar= Person.findMany({address:{
   codepostal:75005

}})

//update all 
Person.update(
{$set:{firstname:'cnd'}}
)

```

* deleting:

```javascript
//delete one
const datar= Person.deleteOne({id:'123-efdeff-35'});

//delete many 

const datar = Person.deleteMany({ $or:[ {firstname:'cnd1'},{lastname:'baadjic'}] 
});

//delete all
Person.delete();
```

### Schemas:


* defining a schema :

```javascript
const Schema = csondb.Schema;

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
// set timestamps will add createdAt and updataAt fields to your data 


personSchema.setTimestamps(true)

```


### models

models are like collections but with schemas to validate data types:
* defining model:

To define a model we need define a schemas first.
```javascript 
const Schema = csondb.Schema;

const createModel=csondb.createModel;

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
});
personSchema.setTimestamps(true)
const Person = createModel('person',personSchema);

```
we can use all functions from  collections api but all the data should be validated by schema definition or a validation error would be thrown.

* Exempl:

```javascript

 Person.create({firstname:'cnd'});
 // will throw error because  lastname and address are required field and missing here

Person.create({age:18});
// will throw error since age is not defined on th schema
```

### conditions

Conditions are used on filters for these operartions:

**findOne**, **findMany** ,     **findManyAndUpdate**,      **findOneAndUpdate**,  **deleteOne** ,   **deleteMany**

A condition is a logical operation or combinaison of many logical operations.
this how we will encode js conditions:

* Comparing:

```javascript 
  fistname == 'cnd' => {firstname:'cnd'}
  age > 12 => {age: {$gt:12} }
  age < 12 => {age: {$lt:12} }
  age >= 12 => {age: {$gte:12} }
  age <= 12 => {age:{$lte:12} }

```
* And:

```javavascript 
firstname=='cnd' && lastname=='baadjis'=>{firstname:'cnd',lastname:'baadjis'}


 ```

* OR:

 The **Or** operation is followed by an array of conditions:

```javavascript 
firstname == 'cnd' || lastname == 'baadjis' => {$or:
[{firstname:'cnd'},      {lastname:'baadjis'}
]
}


```

* Is in :

Check if a key value is in a list of elements

```javascript 

['cnd','cnd2'].includes(firstname) => {
    firstname: {
    $isin:['cnd','cnd2']
  }
}

```

### options:

options are used in the queries: 

 **find** and  **findMany**

   * limit
```javascript  
   //will return  only 3 elemnts
   Person.find({$limit:3}) 
   
   
   //should be the second argument in findMany
   Person.findMany({firstname:'cnd'},{$limit:1})


```

 * sorting

  ```javascript
  
    // asc sorting by firstname

    Person.find({$sort:{firstname:1}})
    //with condition
    Person.findMany({lastname:'baadjis'},{$sort:{firstname:1}})

    // desc sorting

     Person.findMany({lastname:'baadjis'},{$sort:{firstname:-1}})
  
   ```
* skip 

```javascript 
// skip 3 first elements

Person.findMany({lastname:'baadjis'},{$skip:3})

 ```
* combinaison 


```javascript 

 // sort desc  skip 1 and limit to 5
  Person.findMany({lastname:'baadjis'},{$sort:{firstname:-1},
  {$limit:5},
  {$skip:1}
  })   

```
## updates:

To update data there are two possibilities:

 * setting with keyword : **$set** when the fileds to update are objects or primitives types

 * pushing for arrays with keyword: **$push**

 exemple:

 ```javascript 
  const  Acount = new Schema({
      firstname:{
        type:String
      },
      amount:{
        type:Number,
        default:0
      },
      spends:{
         type:[{sum:{type:Number},date:{type:String}}],
         default:[]
      }
    })

// update
//just set
Account.update({$set:{amount:10}})
    //just push
    Account.update({$push:{
      spends:{sum:5,date:'monday'}
      }
      }

    );
  
//combine
Account.update({
  $set:{
     amount:10
    },
  $push:{
      spends:{
      sum:5,
      date:'monday'
      }
    }
    });
    
 ```