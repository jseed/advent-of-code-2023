const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString().split('\n');

const parseInput = (lines) => {
    return lines.map((line) => line.split(' ').map((n) => parseInt(n)));
}

const zeroSequence = (sequence) => {

    let sequences = [sequence];

    while(!sequences[sequences.length - 1].every((n) => n === 0)) {
        let lastSeq = sequences[sequences.length - 1];
        let newSeq = [];

        for(let i = 1; i < lastSeq.length; i++) {
            newSeq.push(lastSeq[i] - lastSeq[i - 1]);
        }
        sequences.push(newSeq);
    }
    return sequences;
}

const extrapolateSequence = (sequence) => {
    let sequences = zeroSequence(sequence);
    let val = 0;
    for(let i = sequences.length - 2; i >= 0; i--) {
        val = sequences[i][sequences[i].length-1] + val;
    }

    return val;
}

const extrapolateSequenceBackwards = (sequence) => {
    let sequences = zeroSequence(sequence);

    let val = 0;
    for(let i = sequences.length - 2; i >= 0; i--) {
        val = sequences[i][0] - val
    }

    return val;
}
const nums = parseInput(input);


console.log('Part One:', nums.map((nums) => extrapolateSequence(nums)).reduce((acc, v) => acc + v));

console.log('Part Two:', nums.map((nums) => extrapolateSequenceBackwards(nums)).reduce((acc, v) => acc + v));