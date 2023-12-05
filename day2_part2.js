const fs = require("node:fs"); // filesystem
const readline = require("node:readline");

const GAME_SETS = [
	"Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
	"Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
	"Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
	"Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
	"Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
];

function getGameMetaData(line) {
	const gameLine = line.split(" ");
	return {
		gameId: parseInt(gameLine[1]),
	};
}

function getSetData(cubeData, targetObj) {
	const cubeLine = cubeData.trim().split(" ");
	targetObj[cubeLine[1]] = parseInt(cubeLine[0]);
	return targetObj;
}

function getGameSets(setsString) {
	const trimmedSet = setsString.trim();
	return trimmedSet.split(";").map((set) => {
		const tempObject = {};
		set.split(",").forEach((splitedSet) => getSetData(splitedSet, tempObject));
		return tempObject;
	});
}

function processLine(line) {
	const splitedLine = line.split(":");
	const gameMetaData = getGameMetaData(splitedLine[0]);
	const setsData = getGameSets(splitedLine[1]);
	return {
		...gameMetaData,
		sets: setsData,
	};
}

function validateGame(game) {
	const minValuesGames = {
		red: 0,
		green: 0,
		blue: 0,
	}
	game.sets.forEach((singleSet) => {
		if (singleSet.red && singleSet.red > minValuesGames.red) {
			minValuesGames.red = singleSet.red;
		}
		if (singleSet.green && singleSet.green > minValuesGames.green) {
			minValuesGames.green = singleSet.green;
		}
		if (singleSet.blue && singleSet.blue > minValuesGames.blue) {
			minValuesGames.blue = singleSet.blue;
		}
	});
	let power = 1;
	Object.keys(minValuesGames).forEach(key => {
		if (minValuesGames[key] > 0) {
			power = power * minValuesGames[key];
		}
	})
	game['power'] = power;
	return game;
}

let initialValue = 0;
async function playElfGame() {
	const rl = readline.createInterface({
		input: fs.createReadStream("./day2.txt"),
		crlfDelay: Infinity,
	});
	rl.on("line", (line) => {
		const gameSets = processLine(line);
		const filteredGame = validateGame(gameSets);
		initialValue += filteredGame.power;
	});
	// GAME_SETS.forEach((line) => {
	// 	const gameSets = processLine(line);
	// 	const filteredGame = validateGame(gameSets);
	// 	initialValue += filteredGame.power;
	// });
}
await playElfGame();
console.log(initialValue);
