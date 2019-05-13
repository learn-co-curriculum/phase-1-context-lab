let asgardianBrothers = [
  {
    firstName: "Thor",
    familyName: "Odinsson"
  },
  {
    firstName: "Loki",
    familyName: "Laufeysson-Odinsson"
  }
]

let intro = function(person, line) {
  return `${person.firstName} ${person.familyName} says: ${line}`
}

let introWithContext = function(line){
  return `${this.firstName} ${this.familyName} says: ${line}`
}

let phrase = "I like this brown drink very much, bring me another!"
intro(asgardianBrothers[0], phrase) //=> Thor Odinsson says: I like this brown drink very much, bring me another!
intro(asgardianBrothers[0], phrase) === introWithContext.call(asgardianBrothers[0], phrase) //=> true
intro(asgardianBrothers[0], phrase) === introWithContext.apply(asgardianBrothers[0], [phrase]) //=> true

let huffyPhrase = "I was falling for thirty minutes!"
intro(asgardianBrothers[0], huffyPhrase) === introWithContext.call(asgardianBrothers[0], huffyPhrase) //=> true
intro(asgardianBrothers[0], huffyPhrase) === introWithContext.apply(asgardianBrothers[0], [huffyPhrase]) //=> true


//function looseyGoosey() {
  //return this
//}

//function noInferringAllowed() {
  //"use strict"
  //return this
//}

//looseyGoosey() === global;
//noInferringAllowed() === undefined

//thorIntros = introWithContext.bind(asgardianBrothers[0])
//console.log(thorIntros("Hi, Jane"));
//let byronPoodle = {
  //name: "Byron",
  //sonicAttack: "ear-rupturing atomic bark",
  //mostHatedThing: "noises in the apartment hallway",
  //warn: function() {
    //console.log(`${this.name} issues an ${this.sonicAttack} when he hears ${this.mostHatedThing}`)
  //}
//}
//byronPoodle.warn()


class Poodle{
  constructor(name, pronoun){
    this.name = name;
    this.pronoun = pronoun
    this.sonicAttack = "ear-rupturing atomic bark"
    this.mostHatedThing = "noises in the apartment hallway"
  }

  warn() {
    console.log(`${this.name} issues an ${this.sonicAttack} when ${this.pronoun} hears ${this.mostHatedThing}`)
  }
}
let b = new Poodle("Byron", "he")
b.warn()

