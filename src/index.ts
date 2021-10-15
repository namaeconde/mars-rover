import { readFromFile } from './utils/FileUtil';
import { Plateau } from "./Plateau";
import { Orientation, Rover } from "./Rover";

export function createPlateau(data: string): Plateau {
    console.log("Initializing mars plateau. . .");
    if (!data.startsWith('Plateau')) {
        throw new Error("Insufficient data to create plateau.");
    }

    // Return plateau dimension
    const dimensions = data.replace('Plateau:', '').trim().split(' ');

    if (dimensions.length < 2) {
        throw Error("Insufficient Plateau dimensions.");
    }

    if (isNaN(Number(dimensions[0]))||
        isNaN(Number(dimensions[1]))) {
        throw Error("Invalid Plateau dimensions.");
    }

    const width = Number(dimensions[0]);
    const height = Number(dimensions[1]);
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

        const [x, y, orientation] = landingData.split(":")[1].trim().split(" ");

        if (isNaN(Number(x))||
            isNaN(Number(y))) {
            throw Error("Invalid landing positions.");
        }

        if (!Object.values(Orientation).includes(<Orientation>orientation)) {
            throw Error("Invalid orientation.");
        }

        const instructions = instructionsData.split(":")[1].trim().split("");

        let rover = new Rover(roverName,
            { position: { x: Number(x), y: Number(y) }, orientation: <Orientation>orientation },
            instructions);
        rovers.push(rover);
        data = roversData;
    }
    return rovers;
}

export function processDataFromFile(): string[] {
    const args = process.argv.slice(2);
    const fileName = args[0];

    if (!fileName) {
        throw new Error("Missing argument filename that ends with .txt");
    }

    if (!fileName.endsWith(".txt")) {
        throw new Error("Invalid file input, it should ends with .txt");
    }

    return readFromFile(fileName);
}

export function deployRoversToPlateau(rovers: Rover[], plateau: Plateau): void {
    rovers.map((rover) => {
        rover.landOn(plateau);
        const status = rover.navigateOn(plateau);
        console.log(status);
    });
}

const main = () => {
    const [plateauData, ...roversData] = processDataFromFile();

    let plateau = createPlateau(plateauData);

    let rovers = createRovers(roversData);

    deployRoversToPlateau(rovers, plateau);
}

/**
 * Check if not triggered by Jest,
 * else do not execute.
 */
if (process.env.JEST_WORKER_ID === undefined) {
    main();
}
