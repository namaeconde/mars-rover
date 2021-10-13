import { processData, readFromFile } from './utils/FileUtil';
import { Plateau } from "./Plateau";
import {Rover} from "./Rover";

function createPlateau(data: string): Plateau {
    console.log("Initializing mars plateau. . .");
    const plateauData = processData(data);
    console.log(plateauData);
    return new Plateau(plateauData.width, plateauData.height);
}

function createRovers(data: string[]): Rover[] {
    console.log("Initializing rovers. . .");
    let rovers: Rover[] = [];
    rovers.push(new Rover("1"));
    rovers.push(new Rover("2"));
    return rovers;
}

const main = () => {
    const args = process.argv.slice(2);
    const fileName = args[0];

    if (!fileName) {
        throw new Error("Missing argument filename that ends with .txt");
    }

    if (!fileName.endsWith(".txt")) {
        throw new Error("Invalid file input, it should ends with .txt");
    }

    const data = readFromFile(fileName);
    if (data.length < 1) {
        throw new Error("Insufficient data to initialize mars rover.")
    }

    let plateau = createPlateau(data[0]);
    console.log(plateau);
    data.splice(0, 1);

    let rovers = createRovers(data);
    console.log(rovers);
}

main();
