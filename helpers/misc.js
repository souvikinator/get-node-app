var xorshift = require('xorshift');
const phraselist=[
    "ah shit! here we go again 🤦",
    "I swear! the coffee jar was filled ☕",
    "technically it was all copy and paste 😅",
    "if no error occured then you are the lucky one 🤗",
    "Wow! that worked 🔮",
    "Feels like something great is about to come from you 👼",
    "You have an unusual equipment of success 🏅",
    "Take a break! You deserve it 🏖️",
    "You would if you could but you can't so you won't 🤷",
    "Coffee! Coffee! Coffee! Coffee! Coffee!",
    "I can see, you need sleep 😴",
    "Your reasoning is excellent 🧠",
    "Just a reminder, you have a life outside of this 👫",
    "Ah! another JS developer 😬"
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

exports.getDateTime=function(){
  let dt=new Date();
  return `${dt.getDay()}-${dt.getMonth()}-${dt.getFullYear()}_${dt.getHours()}-${dt.getMinutes()}-${dt.getSeconds()}`;
}
