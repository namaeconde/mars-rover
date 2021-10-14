import {Instruction, Orientation, Rover} from "../Rover";
import {Plateau} from "../Plateau";

const { L, R, M } = Instruction;

describe('rover', () => {
    it('should create rover given a valid input', () => {
        // GIVEN
        const name = "Mars Rover";
        const landing = { position: {x: 0, y:0}, orientation: Orientation.N };
        const instructions = [L, M, L, M, L, M, M];

        // WHEN
        let marsRover = new Rover(name, landing, instructions);

        // THEN
        expect(marsRover.name).toEqual(name);
        expect(marsRover.landing).toEqual(landing);
        expect(marsRover.instructions).toEqual(instructions);
        expect(marsRover.getStatus()).toEqual(`${name} not yet landed.`);
    })
})

describe('rover landing', () => {
    it('should land on plateau given a valid landing position', () => {
        // GIVEN
        const plateau = new Plateau(5, 5);
        const name = "Mars Rover";
        const landing = { position: {x: 0, y:0}, orientation: Orientation.N };
        const marsRover = new Rover(name, landing, []);

        // WHEN
        marsRover.landOn(plateau);

        // THEN
        expect(plateau.rovers.length).toEqual(1);
        expect(plateau.hasRoverAt(landing.position)).toBeTruthy();
        expect(marsRover.getStatus()).toEqual(`${name} is at x:${landing.position.x} y:${landing.position.y} facing ${landing.orientation}.`)
    })

    it('should not land if position will fall from plateau', () => {
        // GIVEN
        const plateau = new Plateau(5, 5);
        const name = "Mars Rover";
        const landing = { position: {x: 6, y:6}, orientation: Orientation.N };
        const marsRover = new Rover(name, landing, []);

        try {
            // WHEN
            marsRover.landOn(plateau);
        } catch (error) {
            // THEN
            expect(plateau.rovers.length).toEqual(0);
            expect(plateau.hasRoverAt(landing.position)).toBeFalsy();
            expect(error.message).toEqual(`${name} cannot land, will fall from plateau.`);
        }
    })

    it('should not land if position will collide with another rover', () => {
        // GIVEN
        const plateau = new Plateau(5, 5);
        const landing = { position: {x: 0, y:1}, orientation: Orientation.N };
        const rover1 = new Rover('Rover 1', landing, []);
        const rover2 = new Rover('Rover 2', landing, []);

        try {
            // WHEN
            rover1.landOn(plateau);
            rover2.landOn(plateau);
        } catch (error) {
            // THEN
            expect(plateau.rovers.length).toEqual(1);
            expect(plateau.hasRoverAt(landing.position)).toBeTruthy();
            expect(error.message).toEqual(`Rover 2 cannot land, will collide with another rover.`);
        }
    })
})