import { readFromFile } from './utils/FileUtil';
import { Plateau } from "./Plateau";
import { Orientation, Rover } from "./Rover";

export function createPlateau(data: string): Plateau {
    console.log("Initializing mars plateau. . .");
    if (!data.startsWith('Plateau')) {
        throw new Error("Insufficient data to create plateau.");
    }

    // Return plateau dimension
    const dimensions = data.replace('Plateau:', '').split(' ');

    if (dimensions.length < 2) {
        throw Error("Invalid Plateau dimensions.");
    }
    const width = parseInt(dimensions[0]); //TODO: Need to check if data is int
    const height = parseInt(dimensions[1]); //TODO: Need to check if data is int
    return new Plateau(width, height);
}

export function createRovers(data: string[]): Rover[] {
    if (!data || data.length < 1) {
        throw new Error("Insufficient data to create rovers.");
    }

    console.log("Initializing rovers. . .");
    let rovers: Rover[] = [];
    while (data.length > 0) {
        const [landingData, instructionsData, ...roversData] = data;

        const roverName = landingData.split(":")[0].replace("Landing", "").trim();

        //TODO: Check if landing data has missing data
        const [x, y, orientation] = landingData.split(":")[1].trim().split(" ");

        //TODO: Check if instructions data is missing
        const instructions = instructionsData.split(":")[1].trim().split("");

        let rover = new Rover(roverName,
            { position: { x: parseInt(x), y: parseInt(y) }, orientation: <Orientation>orientation },
            instructions);
        rovers.push(rover);
        data.splice(0, 2);
    }
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

    const [plateauData, ...roversData] = readFromFile(fileName);
    let plateau = createPlateau(plateauData);

    let rovers = createRovers(roversData);

    // Deploy rovers to mars plateau
    rovers.map((rover) => {
        rover.landOn(plateau);
        rover.navigateOn(plateau);
        console.log(rover.getStatus());
    });
}

if (process.env.JEST_WORKER_ID === undefined) {
    main();
}
