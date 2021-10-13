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
    N = "north",
    E = "east",
    W = "west",
    S = "south",
}

export class Rover {
    name: string;
    orientation: Orientation;
    position: Point;

    constructor(name: string) {
        this.name = name;
    }

    land(plateau: Plateau, position: Point, orientation: Orientation): void {
        if (this.willFall(plateau, position)) {
            throw new Error('Rover cannot land, will fall from plateau.');
        }

        if (plateau.hasRover(position)) {
            throw new Error('Rover cannot land, will collide with another rover.');
        }

        this.position = position;
        this.orientation = orientation;
    }

    navigate(plateau: Plateau, instructions: string[]): Point {
        // Update rover position based on instruction
        return this.position;
    }

    willFall(plateau: Plateau, position: Point): boolean {
        return position.x < 0 ||
            position.x > plateau.width ||
            position.y < 0 ||
            position.y > plateau.height;
    }
}