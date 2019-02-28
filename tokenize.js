var nlp = require('compromise');
wn= require("wordnetjs");


var question  = 'Dad kills his son'
var answer = 'Son is killed by dad'

function Tokenize(question){
  doc = nlp(question).normalize({punctuation: true, verbs: true});
  doc.contractions().expand()
  var entity =  doc.out('tags')
  for (let word of entity){
    if( word.tags.includes('Determiner')){
      entity.splice(entity.indexOf(word),1)
    }
  }
  return entity
}



function GenerateSyno(syno){
  temp = []
  for(let i of syno){
    synoArray =  i.words
    for(let i of synoArray){
      if (!temp.includes(i)){
        temp.push(i)
      }
    }
  }

return temp
}




function Combine(token){
  var result = [];
  for (let word of token){
    name = word.normal;
    if (word.tags.includes('Verb')){

      synonyms = GenerateSyno(wn.verb(name))
    }
    else if(word.tags.includes('Noun')){

      synonyms = GenerateSyno(wn.noun(name))
    }

    else if(word.tags.includes('Adjective')){

      synonyms = GenerateSyno(wn.adjective(name))
    }
    else{

      synonyms = GenerateSyno(wn.adverb(name))

    }
    entity = word.tags

    pair = {'words': name,'entity': entity, 'syno': synonyms}

    result.push(pair)

    temp = result


  }
  return result;
}




var Q_array = Combine(Tokenize(question))
var A_array = Combine(Tokenize(answer))




// console.log(Q_array)
// console.log(A_array)


function Flat(Array){
  var temp1 = []

  for (let i of Array){
    if (! temp1.includes(i.words)){
      temp1.push(i.words)
    }
    for (let j of i.syno){
      if (!temp1.includes(j)){
        temp1.push(j)
      }
    }
  }
  return temp1
};


function CalculateOverlap(Qarray, Aarray){
  var overlap = 0
  for(let i of Qarray){
    for (let j of Aarray){
      mergeArray = i.syno.filter(v => j.syno.indexOf(v) > -1)
      console.log(mergeArray)
      if (mergeArray.length > 0){
        overlap += 1
      }
    }
  }
  return overlap
}

overlap = CalculateOverlap(Q_array, A_array)
console.log(overlap)
