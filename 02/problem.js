const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString().split('\n');

const parseGame = (str) => {
    let [gameData,  roundData] = str.split(': ');
    let number = parseInt(gameData.split(' ')[1]);
    let rounds = roundData.split('; ').map((round) => {
        return round.split(', ').reduce((acc, c) => {
            let parts = c.split(' ');
            acc[parts[1]] = parseInt(parts[0]);
            return acc;
        }, {});
    })
    return {number, rounds}
}


let games = input.map((line) => parseGame(line));

// PART ONE

let maxRed = 12;
let maxGreen = 13;
let maxBlue = 14;

let sum = 0;
for(let game of games) {
    let possible = true;
    
    for(let round of game.rounds) {
        if (round.red > maxRed || round.green > maxGreen || round.blue > maxBlue) {
            possible = false;
        }
    }

    if (possible) sum += game.number;
}

console.log('Part One:', sum);

// PART TWO

let powerSum = 0;

for(let game of games) {
    let minRed = 0;
    let minGreen = 0;
    let minBlue = 0;

    for(let round of game.rounds) {
        if (round.red > minRed) minRed = round.red;
        if (round.blue > minBlue) minBlue = round.blue;
        if (round.green > minGreen) minGreen = round.green;
    }

    let power = minRed * minGreen * minBlue;
    powerSum += power;
}

console.log('Part Two:', powerSum);