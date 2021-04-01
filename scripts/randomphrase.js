var xorshift = require('xorshift');
const phraselist=[
    "ah shit! here we go again 🤦",
    "I swear! the coffee jar was filled ☕",
    "technically it was copy and paste 😅",
    "if no error occured then you are the lucky one 🤗",
    "Wow! that worked 🔮"
]

exports.getRandomPhrase = function(){
    let phraselistlen=phraselist.length;
    let i=uniformint(0, phraselistlen);
    return (phraselist[i]);
}

// generate random number between range
function uniformint(a, b) {
  return Math.floor(a + xorshift.random() * (b - a));
}
