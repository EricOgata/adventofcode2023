const fs = require("node:fs"); // filesystem
const readline = require("node:readline");

const GAME_SETS = [
	"Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green",
	"Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue",
	"Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red",
	"Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red",
	"Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green",
];

const MAX_RED_CUBES = 12;
const MAX_GREEN_CUBES = 13;
const MAX_BLUE_CUBES = 14;

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
	let isValidGame = true;
	game.sets.forEach((singleSet) => {
		if (singleSet.red && singleSet.red > MAX_RED_CUBES) {
			isValidGame = false;
			return;
		}
		if (singleSet.green && singleSet.green > MAX_GREEN_CUBES) {
			isValidGame = false;
			return;
		}
		if (singleSet.blue && singleSet.blue > MAX_BLUE_CUBES) {
			isValidGame = false;
			return;
		}
	});
	game.isValidGame = isValidGame;
	return game;
}

function filterIdOnlyValidGames(games) {
	const validGames = games.filter((game) => game.isValidGame);
	return validGames;
}

// function playElfGame() {
// 	const initialValue = 0;
// 	const gameSets = GAME_SETS.map((set) => processLine(set));
// 	const filteredGames = gameSets.map((set) => validateGame(set));
// 	const validGames = filterIdOnlyValidGames(filteredGames);
// 	const sumOfIds = validGames.reduce((acc, curr) => {
// 		return acc + curr.gameId;
// 	}, initialValue);
// }

let initialValue = 0;
async function playElfGame() {
	const rl = readline.createInterface({
		input: fs.createReadStream("./day2.txt"),
		crlfDelay: Infinity,
	});
	rl.on("line", (line) => {
        const gameSets = processLine(line);
        const filteredGame = validateGame(gameSets);
        if (filteredGame.isValidGame) {
            initialValue += filteredGame.gameId;
        }
	});
}
await playElfGame();
console.log(initialValue);

