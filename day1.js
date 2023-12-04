const fs = require("node:fs"); // filesystem
const readline = require("node:readline");
let sum = 0;

async function processLineByLine() {
	const rl = readline.createInterface({
		input: fs.createReadStream("./day1.txt"),
		crlfDelay: Infinity,
	});
	rl.on("line", (line) => {
		const numeric = line.replace(/\D/g, "");
		if (!numeric) return;
		const processedString = `${numeric[0]}${numeric[numeric.length - 1]}`;
		console.log(`Line from file: ${numeric} ->  ${processedString}`);
        sum += parseInt(processedString);
	});
}
await processLineByLine();
console.log(`TOTAL: ${sum}`);
