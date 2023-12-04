const fs = require("node:fs"); // filesystem
const readline = require("node:readline");
let sum = 0;

const TRANSLATIONS = [
	{
		regex: /(one)/gi,
		numeric: "1",
	},
	{
		regex: /(two)/gi,
		numeric: "2",
	},
	{
		regex: /(three)/gi,
		numeric: "3",
	},
	{
		regex: /(four)/gi,
		numeric: "4",
	},
	{
		regex: /(five)/gi,
		numeric: "5",
	},
	{
		regex: /(six)/gi,
		numeric: "6",
	},
	{
		regex: /(seven)/gi,
		numeric: "7",
	},
	{
		regex: /(eight)/gi,
		numeric: "8",
	},
	{
		regex: /(nine)/gi,
		numeric: "9",
	},
];

function arrayWithoutPosition(array, index) {
	var part1 = index > 0 ? array.slice(0, index) : [];
	var part2 = array.slice(index + 1);
	return part1.concat(part2);
}

function regexAlphaNumericApply(string) {
	const numbersPositions = [];
	TRANSLATIONS.forEach((translation) => {
		for (let match; (match = translation.regex.exec(string)); ) {
			numbersPositions.push({
				startAt: match.index,
				endAt: match.index + match[1].length,
				numeric: translation.numeric,
			});
		}
	});
	numbersPositions.map((positions, index) => {
		const otherArrays = arrayWithoutPosition(numbersPositions, index);
		otherArrays.forEach((comparisson) => {
			if (positions.endAt === comparisson.startAt + 1) {
				positions.endAt = comparisson.startAt;
			}
		});
		positions.refereceWord = string.slice(positions.startAt, positions.endAt);
	});
	numbersPositions.forEach((positions) => {
		string = string.replace(positions.refereceWord, positions.numeric);
	});
	return string;
}

async function processLineByLine() {
	const rl = readline.createInterface({
		input: fs.createReadStream("./day1.txt"),
		crlfDelay: Infinity,
	});
	rl.on("line", (line) => {
		const convertedLine = regexAlphaNumericApply(line);
		const numeric = convertedLine.replace(/\D/g, "");
		const processedString = `${numeric[0]}${numeric[numeric.length - 1]}`;
		sum += parseInt(processedString);
	});
}
await processLineByLine();
console.log(`TOTAL: ${sum}`);
