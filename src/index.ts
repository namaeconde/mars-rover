import { readFromFile } from './utils/FileUtil';

const args = process.argv.slice(2);
const fileName = args[0];

if (!fileName) {
    throw new Error("Missing argument filename that ends with .txt");
}

if (!fileName.endsWith(".txt")) {
    throw new Error("Invalid file input, it should ends with .txt");
}

console.log("Initializing mars rover data. . .");
const data = readFromFile(fileName);
console.log(data);