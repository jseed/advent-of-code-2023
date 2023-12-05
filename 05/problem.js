const fileName = process.argv[2];

if (!fileName) {
  return console.log("Please specify an input file");
}

const input = require('fs').readFileSync(fileName).toString();


const parseSeeds = (str) => {
    return str.split(': ').pop().split(' ').map(n => parseInt(n));
}

const parseMap = (str) => {
    let lines = str.split('\n');
    let topLine = lines.shift();
    let mapping = topLine.split(' ').shift().split('-');
    let source = mapping[0];
    let dest = mapping[2];
    let ranges = lines.map((l) => {
        let [destStart, sourceStart, length] = l.split(' ').map((n) => parseInt(n))
        let sourceEnd = sourceStart + length - 1;
        let destEnd = destStart + length - 1;
        return { 
            source: {
                start: sourceStart,
                end: sourceEnd,
                length: length,
            }, 
            dest: {
                start: destStart,
                end: destEnd,
                length,
            }
        }
    });

    return {
        source,
        dest,
        ranges
    };
}
    
const parseInput = (input) => {
    const chunks = input.split('\n\n');

    let seeds = parseSeeds(chunks.shift());
    let maps = chunks.map((c) => parseMap(c));

    let mappings = {};
    let revMappings = {};
    let ranges = {};

    for( let map of maps) {
        ranges[map.source] = map.ranges;
        mappings[map.source] = map.dest;
        revMappings[map.dest] = map.source;
    }
    return {
        seeds,
        mappings,
        ranges,
        revMappings,
    }
}

let data = parseInput(input);

// PART ONE

const getNext = (ranges, number) => {
    for (let range of ranges) {
        if (number >= range.source.start && number < range.source.start + range.source.length) {
            return range.dest.start + (number - range.source.start);
        }
    }

    return number;
}

const getMin = (seeds, mappings, ranges) => {
    let category = 'seed';

    while(mappings[category]) {
        for(let i = 0; i < seeds.length; i++) {
            seeds[i] = getNext(ranges[category], seeds[i])
        }
        category = mappings[category]
    }

    return Math.min(...seeds);
}

let p1Nums = [...data.seeds];

console.log('Part One:', getMin(p1Nums, data.mappings, data.ranges));

// PART TWO

const doRangesIntersect = (a, b) => {
    return Math.max(a.start,b.start) <= Math.min(a.end,b.end)
}

const getNonOverlappingRanges = (seedRange, range) => {
    let appendages = [];

    if (seedRange.start < range.source.start) {
        appendages.push({
            start: seedRange.start,
            end: range.source.start - 1,
            length: range.source.start - seedRange.start,
        });
    }

    if (seedRange.end > range.source.end) {
        appendages.push({
            start: range.source.end + 1,
            end: seedRange.end,
            length: seedRange.end - range.source.end,
        });
    }

    return appendages;
}

const getOverlappingRange = (seedRange, range) => {
    let newStart = Math.max(seedRange.start, range.source.start);
    let newEnd = Math.min(seedRange.end, range.source.end);
    let newLength = (newEnd - newStart) + 1;

    let overlappingRange = {
        start: range.dest.start + (newStart - range.source.start),
        end: range.dest.end + (newEnd - range.source.end),
        length: newLength
    };
    return overlappingRange
}

const getMinRange = (category, seedRange) => {
    if (category === 'location') return seedRange.start;

    for(let range of data.ranges[category]) {
        if (doRangesIntersect(seedRange, range.source)) {
            const nonOverlappingRanges = getNonOverlappingRanges(seedRange, range);
            const overlappingRange = getOverlappingRange(seedRange, range);
     
            return Math.min(
                ...nonOverlappingRanges.map((r) => getMinRange(category, r)),
                getMinRange(data.mappings[category], overlappingRange)
            )
        }
    }

    return getMinRange(data.mappings[category], seedRange);
}

let seedRanges = [];

for(let i = 0; i < data.seeds.length; i+= 2) {
    seedRanges.push({
        start: data.seeds[i],
        end: data.seeds[i] +  data.seeds[i+1] - 1,
        length: data.seeds[i+1]
    })
}

console.log('Part Two:', Math.min(...seedRanges.map((r) => getMinRange('seed', r))));

// // OLD
// let cat = 'seed';

// while (data.mappings[cat]) {
//     let newRanges = [];
//     for (let seedRange of seedRanges) {
//         let foundIntersection = false;
//         for(let range of data.ranges[cat]) {
//             if (doRangesIntersect(seedRange, range.source)) {
//                 foundIntersection = true;
//                 if (seedRange.start < range.source.start) {
//                     seedRanges.push({
//                         start: seedRange.start,
//                         end: range.source.start - 1,
//                         length: range.source.start - seedRange.start,
//                     });
//                     newRanges.push(seedRanges[seedRanges.length - 1])

//                 }

//                 let newStart = Math.max(seedRange.start, range.source.start);
//                 let newEnd = Math.min(seedRange.end, range.source.end);
//                 let newLength = (newEnd - newStart) + 1;

//                 newRanges.push({
//                     start: range.dest.start + (newStart - range.source.start),
//                     end: range.dest.end + (newEnd - range.source.end),
//                     length: newLength
//                 });

//                 if (seedRange.end > range.source.end) {
//                     seedRanges.push({
//                         start: range.source.end + 1,
//                         end: seedRange.end,
//                         length: seedRange.end - range.source.end,
//                     });
//                     newRanges.push(seedRanges[seedRanges.length - 1])
//                 }
//                 break;
//             }

//         }
//         if (foundIntersection)  {
//             continue;
//         } else {
//             newRanges.push(seedRange);
//         }

//     }

//     seedRanges = newRanges;
//     cat = data.mappings[cat];
// }

// console.log('Part Two:', Math.min(...seedRanges.map((r) => r.start)));