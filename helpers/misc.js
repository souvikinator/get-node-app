var xorshift = require('xorshift');
/**
 * @type {string[]} list of phrases 
 */
const phraselist = [
  "ah shit! here we go again",
  "I swear! the coffee jar was filled c[_]",
  "technically it was all copy and paste",
  "if no error occured then you are the lucky one (;´・`)>`)",
  "Wow! that worked ヽ( ★ω★)ノ",
  "Feels like something great is about to come from you (☆▽☆)",
  "You have an unusual equipment of success (＾▽＾)",
  "Take a break! You deserve it  (╥﹏╥)",
  "You would if you could but you can't so you won't",
  "Coffee! Coffee! Coffee! Coffee! Coffee!",
  "I can see, you need sleep",
  "Your reasoning is excellent",
  "Just a reminder, you have a life outside of this ¯\\_(ツ)_/¯",
  "Ah! another JS developer",
  "made with !== ❤️"
]
/**
 * 
 * @returns random pharse from the phrase list
 */
exports.getRandomPhrase = function () {
  let phraselistlen = phraselist.length;
  let i = uniformint(0, phraselistlen);
  return (phraselist[i]);
}

/**
 * generate random number between two range
 * @param {number} a - minimum
 * @param {number} b - maximum
 * @returns random number between a and b
 */
function uniformint(a, b) {
  return Math.floor(a + xorshift.random() * (b - a));
}

/**
 * @returns date and time in format: day-month-year_hrs-mins-sec
 */
exports.getDateTime = function () {
  let dt = new Date();
  return `${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()}_${dt.getHours()}-${dt.getMinutes()}-${dt.getSeconds()}`;
}