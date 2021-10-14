/**
 * Plateau on mars in a rectangular shape.
 */
import { Point, Rover } from "./Rover";

export class Plateau {
    width: number;
    height: number;
    rovers: Rover[];

    constructor(width: number, height: number) {
        if (width <= 0 || height <= 0) {
            throw new Error('Plateau width and height are invalid');
        }

        this.width = width;
        this.height = height;
        this.rovers = [];
    }

    hasRover(position: Point): boolean {
        return this.rovers.some((rover) => {
            let roverPosition = rover.position;
            return position.x == roverPosition.x &&
                position.y == roverPosition.y
        })
    }
}