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

function getLandingData(dataStr: string): any {
  const [x, y, orientation] = dataStr.split(":")[1].trim().split(" ");

  if (isNaN(Number(x))||
      isNaN(Number(y))) {
      throw Error("Invalid landing positions.");
  }

  if (!Object.values(Orientation).includes(<Orientation>orientation)) {
      throw Error("Invalid orientation.");
  }

  return { x: Number(x), y: Number(y), orientation: <Orientation>orientation }
}

function getInstructionsData(dataStr: string): any {
  return dataStr.split(":")[1].trim().split("");
}

export function createRovers(data: string[]): any {
    if (!data || data.length < 1) {
        throw new Error("Insufficient data to create rovers.");
    }

    console.log("Initializing rovers. . .");
    let roverMaps = new Map();
    while (data.length > 0) {
      const [roverData, ...rest] = data; // Rover1 Landing:1 2 N, ...

      const roverName = roverData.split(" ")[0].trim(); // Rover1

      // Check if roverData is about Landing
      if (roverData.indexOf("Landing") > 0) {
        // Get Landing Data
        let landingData = getLandingData(roverData);
        // Check if roverName is already in list of rovers
        let rover = roverMaps.get(roverName);
        if (rover) {
          // Update existing rover
          rover.landing = { position: { x: Number(landingData.x), y: Number(landingData.y) }, orientation: <Orientation>landingData.orientation };
        } else {
          // Create new rover
          const { x, y, orientation } = landingData;
          let newRover = new Rover(roverName,
              { position: { x: Number(x), y: Number(y) }, orientation: <Orientation>orientation },
              null);
          roverMaps.set(roverName, newRover);
        }
      } else if (roverData.indexOf("Instructions") > 0) {
        // Get Instructions Data
        let instructionsData = getInstructionsData(roverData);

        // Check if roverName is already in list of rovers
        let rover = roverMaps.get(roverName);
        if (rover) {
          // Update existing rover
          rover.instructions = instructionsData;
        } else {
          // Create new rover
          let newRover = new Rover(roverName,
              null,
              instructionsData);
          roverMaps.set(roverName, newRover);
        }
      }
      data = rest;
    }

    return Array.from(roverMaps.values()); ;
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
