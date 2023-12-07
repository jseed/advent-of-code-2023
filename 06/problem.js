const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString().split('\n');

const parseP1Input = (lines) => {
    let parseNums = (str) => str.match(/[\d]+/gi).map((n) => parseInt(n));
    let timeNums = parseNums(lines[0]);
    let distNums = parseNums(lines[1]);

    let races = [];

    for(let i = 0; i < timeNums.length; i++) {
        races.push({ time: timeNums[i], distance: distNums[i] });
    }

    return races;
}

const getDistance = (raceTime, holdTime) => {
    return holdTime * (raceTime - holdTime);
}

const parseP2Input = (lines) => {
    let parseNums = (str) => parseInt(str.split(':').pop().replace(/ /gi, ''));

    return {
        time: parseNums(lines[0]),
        distance: parseNums(lines[1]),
    };
}

// Part One

let p1Races = parseP1Input(input);

let p1Product = 1;
for(let race of p1Races) {
    let count = 0;
    
    for(let i = 0; i <= race.time; i++) {
        if (getDistance(race.time, i) > race.distance) {
            count++;
        }
    }

    if (count) p1Product *= count;
}

console.log('Part One:', p1Product);

// Part Two

const p2Race = parseP2Input(input);

let count = 0;
    
for(let i = 0; i <= p2Race.time; i++) {
    if (getDistance(p2Race.time, i) > p2Race.distance) {
        count++;
    }
}

if (count) p1Product *= count;

console.log('Part Two:', count);