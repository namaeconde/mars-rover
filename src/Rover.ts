/**
 * Robotic rovers by NASA.
 * Landing will be in x, y position and orientation (N, E, W, S).
 * In order to control a rover, NASA sends a simple string of letters.
 * The possible letters are 'L', 'R' and 'M'.
 * 'L' and 'R' makes the rover spin 90 degrees left or right respectively, without moving from its current spot.
 * 'M' means move forward one grid point, and maintain the same heading.
 */
import { Plateau } from "./Plateau";

export type Point = {
    x: number;
    y: number;
};

export enum Orientation {
    N = "N",
    E = "E",
    W = "W",
    S = "S",
}

export class Rover {
    name: string;
    position: Point;
    orientation: Orientation;
    landing: {
        position: Point,
        orientation: Orientation
    }
    instructions: string[]

    /**
     * Set rover name, data where to land, instructions how to navigate plateau
     *
     * @param name
     * @param landing
     * @param instructions
     */
    constructor(name: string,
                landing: { position: Point, orientation: Orientation},
                instructions: string[]) {
        this.name = name;
        this.landing = landing;
        this.instructions = instructions;
    }

    landOn(plateau: Plateau): void {
        if (this.willFallFrom(plateau, this.landing.position)) {
            throw new Error('Rover cannot land, will fall from plateau.');
        }

        if (plateau.hasRover(this.landing.position)) {
            throw new Error('Rover cannot land, will collide with another rover.');
        }

        this.position = this.landing.position;
        this.orientation = this.landing.orientation;
        plateau.rovers.push(this);
    }

    navigateOn(plateau: Plateau): Point {
        // Update rover position based on instruction
        return this.position;
    }

    willFallFrom(plateau: Plateau, position: Point): boolean {
        return position.x < 0 ||
            position.x > plateau.width ||
            position.y < 0 ||
            position.y > plateau.height;
    }
}