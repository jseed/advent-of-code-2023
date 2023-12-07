const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString().split('\n');

const parseLine = (line) => {
    let [cards, bid] = line.split(' ');

    return { cards, bid: parseInt(bid) };
}

class Game {
    constructor(jokerSymbol) {
        this.jokerSymbol = jokerSymbol;
        this.strengthMappings = { A: 14, K: 13, Q: 12, J: 11, T: 10 };
    }

    evaluateHands(hands) {
        const rankedHands = this.rankHands(hands);

        return this.getWinnings(rankedHands)
    }

    rankHands(hands) { 
        const groupedHands = this.groupHandsByType(hands);

        for(const type in groupedHands) {
            groupedHands[type] = this.orderHandsOfType(groupedHands[type]);
        }

        const rankedHands = [];
        for(let i = 0; i < 7; i++) {
            if (groupedHands[i]) {
                rankedHands.push(...groupedHands[i]);
            }
        }

        return rankedHands;
    }

    groupHandsByType(hands) {
        return hands.reduce((acc, hand) => {
            let type = this.getHandType(hand.cards);
            if (!acc[type]) acc[type] = [];
            acc[type].push(hand);
            return acc;
        }, {});
    }

    getHandType(cards) {
        let jokerExp = RegExp(`${this.jokerSymbol}`,'g');
        let jokerCount = cards.match(jokerExp)?.length || 0;
        const staticCards = cards.replace(jokerExp, '');
        let counts = this.getGroupCounts(staticCards, '');
        counts.sort((a, b) => b - a);

        let highGroupCount = (counts[0] || 0) + jokerCount;

        if (highGroupCount === 5) {
            return 6
        } else if (highGroupCount === 4) {
            return 5
        } else if (highGroupCount === 3 && counts[1] === 2) {
            return 4;
        } else if (highGroupCount === 3) {
            return 3;
        } else if (counts[0] === 2 && counts[1] === 2) {
            return 2;
        } else if (highGroupCount === 2) {
            return 1;
        } else {
            return 0;
        }
    }

    getGroupCounts(str) {
        let counts = {};
        for(let i = 0; i < str.length; i++) {
            if (!counts[str[i]]) counts[str[i]] = 0;
            counts[str[i]]++;
        }
    
        return Object.values(counts);
    }

    orderHandsOfType(hands) {
        return hands.sort((a, b) => {

            for(let i = 0; i < a.cards.length; i++) {
                let aStrength = this.getStrength(a.cards[i]);
                let bStrength = this.getStrength(b.cards[i]);

                if (aStrength !== bStrength) return aStrength -bStrength;
            }
        });
    }

    getStrength(card) {
        if (card === this.jokerSymbol) {

            return -1;
        }
        return this.strengthMappings[card] || parseInt(card);
    }

    getWinnings(hands) {
        return hands.reduce((score, hand, i) => score + hand.bid * (i + 1), 0)
    }

}


// Part One
const p1Hands = input.map((line) => parseLine(line));

console.log('Part One:', new Game('_').evaluateHands(p1Hands));

// Part Two

let p2Hands = input.map((line) => parseLine(line));

console.log('Part Two:', new Game('J').evaluateHands(p2Hands));

