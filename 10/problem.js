const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString();

const pipeConnections = {
    '|': [[0, -1], [0, 1]],
    '-': [[-1, 0], [1, 0]],
    'L': [[0, -1], [1, 0]],
    'J': [[0, -1], [-1, 0]],
    '7': [[0, 1], [-1, 0]],
    'F': [[0, 1], [1, 0]],
}

// Hash coordinates to a string
const hashCoords = (x, y) => `${x},${y}`;

// Parse hashed coordinates to an array of ints ([x, y])
const parseCoords = (str) => str.split(',').map((n) => parseInt(n));

// Initialize 2D array of size with value
const initialize2DArray = (w, h, val) =>
  Array.from({ length: h }).map(() => Array.from({ length: w }).fill(val));

// Parses the input grid, returning a map of pipe connections and the start coordinates
const parseGrid = (grid) => {
    let connections = {};
    let start = null;
    for(let y = 0; y < grid.length; y++) {
        for(let x = 0; x < grid[y].length; x++) {
            let pipe = grid[y][x];
            if (pipe === '.') continue;
            if (pipe === 'S') start = hashCoords(x, y)
            else connections[hashCoords(x, y)] = pipeConnections[pipe].map(([xOff, yOff]) => hashCoords(xOff + x, yOff + y));
        }
    }

    return { connections, start };
}

// Get the possible pipe types and their connections for the given start
const getPossibleStarts = (start) => {
    let coords = parseCoords(start);
    return Object.entries(pipeConnections)
        .map(([pipe, connections]) => {
            connections = connections.map(([xOff, yOff]) => hashCoords(coords[0] + xOff, coords[1] + yOff));

            return { pipe, connections, coords, hash: start };
        });
}


// Try to create a loop from the given start, if possible return the loops length and a grid of the loop
const tryLoop = (start, connections, grid) => {
    // Initialize the loop grid, set the starting coord to the pipe type we are trying
    let loopGrid = initialize2DArray(inputGrid[0].length, inputGrid.length, '.');
    loopGrid[start.coords[1]][start.coords[0]] = start.pipe;

    let point = start.connections[0];
    let last = start.hash;
    let length = 1;

    while(point !== start.hash) {
        if (!connections[point]) return null;
        
        // Populate loop grid
        let [x, y] = parseCoords(point);
        loopGrid[y][x] = grid[y][x];
        
        // Get next pipe
        let next = connections[point].find((c) => c !== last);
        last = point;
        point = next;
        length++;
    }

    // Make sure the last pipe was the other end of the starting pipe
    if (last !== start.connections[1]) {
        return null;
    }

    return {
        length,
        grid: loopGrid
    };
}


// Find the loops in the connection map from the given start, returns a 2D array of the loop and the length of the loop
const findLoop = ({ start, connections }, inputGrid) => {

    const possibleStarts = getPossibleStarts(start);

    let maxLoop = { length: 0 };
    for(let possibleStart of possibleStarts)  {
        let loop = tryLoop(possibleStart, connections, inputGrid);
        if (loop && loop.length > maxLoop.length) maxLoop = loop;
    }

    return maxLoop;
};


// Expands the grid vertically to reveal spaces between pipes
const expandGridVertical = (grid) => {
    let upConnections = new Set(['|', 'F', '7']);
    let downConnections = new Set(['|', 'L', 'J']);

    let newGrid = [];

    for(let y = 0; y < grid.length - 1; y++) {
        newGrid.push(grid[y]);
        newGrid.push(grid[y].map((val, x) => (upConnections.has(val) || downConnections.has(grid[y+1][x])) ? '|' : '.'));
    }
    newGrid.push(grid[grid.length - 1]);
    
    return newGrid;
}

// Expands the grid horizontally to reveal spaces between pipes
const expandGridHorizontal = (grid) => {
    return grid.map((row) => {
        const leftConnections = new Set(['-','F','L']);
        const rightConnections = new Set(['-','7','J']);

        let newRow = [];

        for(let x = 0; x < row.length - 1; x++) {
            newRow.push(row[x]);
            newRow.push(leftConnections.has(row[x]) || rightConnections.has(row[x+1]) ? '-' : '.');    
        }
        newRow.push(row[row.length - 1]);

        return newRow;
    });
}

// Expands the grid to reveal spaces between pipes
const expandGrid = (grid) => expandGridVertical(expandGridHorizontal(grid));

// Collapses the grid horizontally to hide spaces between pipes
const collapseGridHorizontal = (grid) => {
    return grid.map((row) => row.filter((_, i) => i % 2 === 0));
}
// Collapses the grid vertically to hide spaces between pipes
const collapseGridVertical = (grid) => grid.filter((_, i) => i % 2 === 0);

// Collapses the grid to hide spaces between pipes
const collapseGrid = (grid) => collapseGridVertical(collapseGridHorizontal(grid));

// Provides a function that will flood fill the given grid at a set of coordinates, replacing the given emptyChar with char
const getFloodFillFn = (grid, char, emptyChar) => {
    const floodFill = (x, y) => {
        if (y < 0 || x < 0 || y >= grid.length || x >= grid[y].length || grid[y][x] !== emptyChar) return;
        grid[y][x] = char;
    
        floodFill(x+1, y);
        floodFill(x-1, y);
        floodFill(x, y+1);
        floodFill(x, y-1,);
    }
    return floodFill;
}

// SOLUTION
let inputGrid = input.split('\n');
let gridInfo = parseGrid(inputGrid);

// Find the biggest loops
let { length, grid } = findLoop(gridInfo, inputGrid);

// Expand the grid to show spaces between pipes (where rat can fit but not live)
grid = expandGrid(grid);

// Flood all empty spaces with '1' to get the spaces the rat could live
const floodDots = getFloodFillFn(grid, '1', '.');
for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {
        floodDots(x, y);
    }
}

// Flood perimiter spaces with '0' to get rid of space that is not enclosed by the loop
const floodPerimiter = getFloodFillFn(grid, '0', '1');
for(let i = 0; i < grid.length; i++) {
    floodPerimiter(0, i);
    floodPerimiter(grid[i].length - 1, i);
}
for(let i = 0; i < grid[0].length; i++) {
    floodPerimiter(i, 0);
    floodPerimiter(i, grid.length - 1);
}

// Collapse the grid to hide spaces between pipes (where rat can fit but not live);
grid = collapseGrid(grid);


// Count the spaces the rat could live ('1')
let count = 0;
for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid.length; x++) {
        if (grid[y][x] === '1') {
            count++;
        }
    }
}

console.log('Part One:', length / 2);
console.log('Part Two:', count);
