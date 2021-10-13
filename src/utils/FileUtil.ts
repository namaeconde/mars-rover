import { readFileSync } from 'fs';

export function readFromFile(fileName: String): string[] {
    return readFileSync(`./${fileName}`, 'utf8').split("\n");
}