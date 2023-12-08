const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString();

const parseNetwork = (network) => { 
    let lines = network.split('\n');

    return lines.reduce((acc, line) => {
        let [node, left, right] = line.match(/(\w{3}) = \((\w{3}), (\w{3})\)/).slice(1);
        acc[node] = { left, right };
        return acc;
    }, {});
}
const parseInput = (input) => {
    let [instructions, network] = input.split('\n\n');

    let nodeMap = parseNetwork(network);

    return {
        instructions, nodeMap
    }
}

const getLength = (instructions, nodeMap, startingNode) => {
    let node = startingNode;

    let count = 0;
    while(!node.endsWith('Z')) {
        node = instructions[count % instructions.length] === 'L' ? nodeMap[node].left : nodeMap[node].right;
        count++;
    }

    return count;
}


let { instructions, nodeMap } = parseInput(input);

// Part One

console.log('Part One:', getLength(instructions, nodeMap, 'AAA'));

// Part Two

const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);

let startNodes = Object.keys(nodeMap).filter((k) => k.endsWith('A'));
console.log('Part Two:', startNodes.map((node) => getLength(instructions, nodeMap, node)).reduce(lcm));