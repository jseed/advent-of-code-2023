
const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString().split('\n');

// PART ONE 

const p1Result = input
  .map((line) => {
    let last = null;
    let first = null;
    for(let i = 0; i < line.length; i++) {
      let num = parseInt(line[i]);
      if (!isNaN(num)) {
        last = num
        if (first === null) {
          first = num
        }
      }
    }
    return first * 10 + last;
  })
  .reduce((acc, v) => acc + v, 0);

console.log('Part One:', p1Result);

// PART TWO

const digitMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7, 
  eight: 8,
  nine: 9,
}

const tokenize = line => {
  let tokens = [];
  for(let i = 0; i < line.length; i++) {
    if (/\d/.test(line[i])) {
      tokens.push(parseInt(line[i]));
    } else {
      let digit = Object.keys(digitMap).find((w) => {
        return line[i] === w[0] && line.slice(i, i + w.length) === w;
      });

      if (digit) tokens.push(digitMap[digit]);
    }
  }
  return tokens;
}

const p2Result = input
  .map((line) => tokenize(line))
  .reduce((acc, v) => acc + (v[0] * 10 + v[v.length - 1]), 0)

console.log('Part Two:', p2Result);
