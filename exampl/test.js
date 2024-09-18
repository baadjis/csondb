const { Person } = require("./person");


/*Person.create({
    firstname:'cnd',
    lastname:'baadjis'
})

Person.create({
    firstname:'cnd2',
    lastname:'baadji'
})*/


console.log(Person.find())
console.log(Person.findManyAndUpdate({firstname:'cnd2'},{lastname:'baadji'}))
/*console.log(Person.deleteMany({firstname:'cnd'}))*/
console.log(isRequired)