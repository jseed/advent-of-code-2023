const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString().split('\n');

const isDigit = c => /\d/.test(c);

const parseNum = (grid, x, y) => {
    let start = x;
    let end = x;

    let num = grid[y][x];
    while(start > 0 & isDigit(grid[y][start-1])) {
        start--;
        num = grid[y][start] + num;
        grid[y][start] = '.';
    }
    while(end < grid[y].length - 1 && isDigit(grid[y][end+1])) {
        end++;
        num = num + grid[y][end];
        grid[y][end] = '.';
    }

    return parseInt(num);
}

const inBounds = (grid, x, y) => {
    return y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;
}

const forEachAdjacent = (grid, x, y, cb) => {
    for(let yOff = -1; yOff <= 1; yOff++) {
        for(let xOff = -1; xOff <= 1; xOff++) {
            let newX = x + xOff;
            let newY = y +yOff;
            if (yOff === y && xOff === x) continue;
            if (!inBounds(grid, newX, newY)) continue;
            cb(newX, newY);
        }
    }
}
// Part One

let p1Grid = input.map((l) => l.split(''));

let p1Sum = 0;

for(let y = 0; y  < p1Grid.length; y++) {
    for(let x = 0; x < p1Grid[y].length; x++) {
        if (isDigit(p1Grid[y][x]) || p1Grid[y][x] === '.') {
            continue;
        }

        forEachAdjacent(p1Grid, x, y, (x, y) => {
            if (isDigit(p1Grid[y][x])) {
                p1Sum += parseNum(p1Grid, x, y);
            }
        })
    }
}

console.log('Part One:', p1Sum);

// Part Two

let p2Grid = input.map((l) => l.split(''));

let p2Sum = 0;

for(let y = 0; y  < p2Grid.length; y++) {
    for(let x = 0; x < p2Grid[y].length; x++) {
        if (p2Grid[y][x] !== '*') continue;

        let gridCopy = p2Grid.map((l) => l.map((v)=>v));
        let nums = [];
        
        forEachAdjacent(gridCopy, x, y, (x, y) => {
            if (isDigit(gridCopy[y][x])) {
                nums.push(parseNum(gridCopy, x, y));
            }
        })

        if (nums.length === 2) {
            p2Sum += nums[0] * nums[1];
        }
    }
}

console.log('Part Two:', p2Sum)