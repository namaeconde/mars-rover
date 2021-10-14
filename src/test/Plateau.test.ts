import { Plateau } from "../Plateau";
import {Orientation, Rover} from "../Rover";

describe('plateau', () => {
    it('should create plateau given a valid input', () => {
        // WHEN
        let plateau = new Plateau(3, 5);

        // THEN
        expect(plateau.width).toEqual(3);
        expect(plateau.height).toEqual(5);
        expect(plateau.rovers).toEqual([]);
    })

    it('should return true if point already has rover landed', () => {
        // GIVEN
        let plateau = new Plateau(3, 5);
        let position = {x: 0, y:0};
        let landing = {position: position, orientation: Orientation.N};
        let rover1 = new Rover("Testing1", landing, []);

        // WHEN
        rover1.landOn(plateau);

        // THEN
        expect(plateau.hasRover(position)).toBeTruthy();
    })

    it('should return false if point doesnt have any rover', () => {
        // GIVEN
        let plateau1 = new Plateau(3, 5);
        let plateau2 = new Plateau(3, 5);
        let position = {x: 0, y:0};
        let landing = {position: position, orientation: Orientation.N};
        let rover1 = new Rover("Testing1", landing, []);

        // WHEN
        rover1.landOn(plateau1);

        // THEN
        expect(plateau1.hasRover({x: 1, y: 0})).toBeFalsy();
        expect(plateau2.hasRover({x: 0, y: 0})).toBeFalsy();
    })
})