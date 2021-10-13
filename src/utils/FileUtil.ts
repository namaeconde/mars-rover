import { readFileSync } from 'fs';

export function readFromFile(fileName: String): string[] {
    return readFileSync(`./${fileName}`, 'utf8').split("\n");
}

export function processData(data: String): any {
    if (data.startsWith('Plateau')) {
        // Return plateau dimension
        const dimensions = data.replace('Plateau:', '').split(' ');

        if (dimensions.length < 2) {
            throw Error("Invalid Plateau dimensions");
        }

        return {
            'width': parseInt(dimensions[0]), //TODO: Need to check if data is int
            'height': parseInt(dimensions[1]) //TODO: Need to check if data is int
        }
    }
}