const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const readInput = (fileName) => {
    return require('fs')
        .readFileSync(fileName)
        .toString()
        .split('\n')
        .map((row) => row.split(''));
}

// Expand galaxy coords along the given axis
// Axis lines is an array of rows or columns
const expandAxis = (galaxyCoords, axisKey, axisLines, expansionFactor) => {
    // Determine at which indexes this axis will expand
    let expansionIndexes = [];
    for(let i = 0; i < axisLines.length; i++) {
        if (axisLines[i].every((v) => v === '.')) expansionIndexes.push(i);
    }

    // Group coordinates by their placement on this axis
    let groupedCoordinates = Array.from({ length: axisLines.length }).fill(0).map(() => []);
    galaxyCoords.forEach((coords) => {
        groupedCoordinates[coords[axisKey]].push(coords);
    });

    // For each expansion index, move affected coordinates according to the expansion factor
    for(let expansionIndex of expansionIndexes) {
        for(let i = expansionIndex + 1; i < groupedCoordinates.length; i++) {
            groupedCoordinates[i].forEach((coord) => coord[axisKey] += (expansionFactor - 1));
        }
    }

    return Object.values(groupedCoordinates).flat();
} 

const expandUniverse = (universe, galaxyCoords, expansionFactor) => {
    let rows = universe;
    let cols = universe[0].map((_, x) => universe.map(row => row[x]));
    
    return expandAxis(expandAxis(galaxyCoords, 'y', rows, expansionFactor), 'x', cols, expansionFactor);
}

const getGalaxyCoords = (universe) => {
    let coords = [];
    for(let y = 0; y < universe.length; y++) {
        for(let x = 0; x < universe[0].length; x++) {
            if (universe[y][x] === '#') coords.push({ x, y });
        }
    }
    return coords;
}

const getShortestPathLength = (galaxyA, galaxyB) => {
    return Math.abs(galaxyA.x - galaxyB.x) + Math.abs(galaxyA.y - galaxyB.y);
}

const getPathSum = (galaxyCoords) => {
    let pathSum = 0;

    for(let i = 0; i < galaxyCoords.length; i++) {
        for(let j = i + 1; j < galaxyCoords.length; j++) {
            pathSum += getShortestPathLength(galaxyCoords[i], galaxyCoords[j]);
        }
    }

    return pathSum;
}

// Solution
const universe = readInput(fileName);

// Part One
console.log('Part One:', getPathSum(expandUniverse(universe, getGalaxyCoords(universe), 2)));

// Part Two
console.log('Part Two:', getPathSum(expandUniverse(universe, getGalaxyCoords(universe), 1000000)));
