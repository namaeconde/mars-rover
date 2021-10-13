const args = process.argv.slice(2);
const file = args[0];
if (!file.endsWith(".txt")) {
    throw new Error("Invalid file input, it should end with .txt");
} else {
    console.log("Initializing mars rover data. . .");
}