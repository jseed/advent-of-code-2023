const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString().split('\n');

const parseCard = (str) => {
  let card = {};
  let [gameInfo, cardInfo] = str.split(': ');
  card['number'] = parseInt(gameInfo.split(' ').pop());
  const [winningNums, yourNums] = cardInfo.split(' | ');
  
  const parseNums = (str) => str.match(/(\d+)/g).map((n) => parseInt(n));

  card['yourNums'] = parseNums(yourNums);
  card['winningNums'] = parseNums(winningNums);
  return card;
}

const getMatches = (card) => {
  let set = new Set(card.winningNums);

  let total = 0;

  for(let num of card.yourNums) {
    if (set.has(num)) {
      total += 1;
    }
  }

  return total;
}

// PART ONE

const p1Cards = input.map((str) => parseCard(str));

let p1Sum = 0;
for(let card of p1Cards) {
  let matches = getMatches(card);
  if (matches) p1Sum += 2 ** (matches - 1);
}

console.log('Part One:', p1Sum);

// PART TWO

const p2Cards = input.map((str) => parseCard(str));

let cardCopies = p2Cards.reduce((acc, card) => {
  acc[card.number] = 1;
  return acc;
}, {});

let p2Count = p2Cards.length;

for(let card of p2Cards) {
  let matches = getMatches(card);

  for(let i = 0; i < matches; i++) {
    let copyNum = card.number + i + 1;
    cardCopies[copyNum] += cardCopies[card.number];
    p2Count += cardCopies[card.number];
  }
}

console.log('Part Two:', p2Count);