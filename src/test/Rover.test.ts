import { Instruction, Orientation, Point, Rover } from "../Rover";
import { Plateau } from "../Plateau";

const { L, R, M } = Instruction;
const { N, E, W, S } = Orientation;

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

describe('rover lands', () => {
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
        expect(marsRover.hasLanded()).toBeTruthy();
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
            expect(marsRover.hasLanded()).toBeFalsy();
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
            expect(rover1.hasLanded()).toBeTruthy();
            expect(rover2.hasLanded()).toBeFalsy();
            expect(error.message).toEqual(`Rover 2 cannot land, will collide with another rover.`);
        }
    })
})

describe('rover turns', () => {
    test.each([
        {orientation: N, expected: W},
        {orientation: E, expected: N},
        {orientation: W, expected: S},
        {orientation: S, expected: E},
    ])('$orientation turn left becomes $expected',
        ({orientation, expected}) => {
        const rover = new Rover("Mars Rover",
            { position: {x: 0, y:0}, orientation: orientation }, []);
        const plateau = new Plateau(1,1);
        rover.landOn(plateau);
        expect(rover.turnLeft()).toEqual(expected);
    });

    test.each([
        {orientation: N, expected: E},
        {orientation: E, expected: S},
        {orientation: W, expected: N},
        {orientation: S, expected: W},
    ])('$orientation turn right becomes $expected',
        ({orientation, expected}) => {
            const rover = new Rover("Mars Rover",
                { position: {x: 0, y:0}, orientation: orientation }, []);
            const plateau = new Plateau(1,1);
            rover.landOn(plateau);
            expect(rover.turnRight()).toEqual(expected);
        });
})

describe('rover moves', () => {
    test.each([
        {orientation: N, position: {x: 0, y:0}, expected: {x: 0, y:1} as Point},
        {orientation: E, position: {x: 0, y:0}, expected: {x: 1, y:0} as Point},
        {orientation: W, position: {x: 1, y:1}, expected: {x: 0, y:1} as Point} ,
        {orientation: S, position: {x: 1, y:1}, expected: {x: 1, y:0} as Point},
    ])('heading $orientation position becomes $expected',
        ({orientation, position, expected}) => {
            const rover = new Rover("Mars Rover",
                { position, orientation: orientation }, []);
            const plateau = new Plateau(1,1);
            rover.landOn(plateau);
            expect(rover.move(plateau)).toEqual(expected);
        });

    it('should not move if position will fall from plateau', () => {
        // GIVEN
        const plateau = new Plateau(5, 5);
        const name = "Mars Rover";
        const landing = { position: {x: 5, y:5}, orientation: Orientation.N };
        const marsRover = new Rover(name, landing, [M]);
        marsRover.landOn(plateau);

        try {
            // WHEN
            marsRover.move(plateau);
        } catch (error) {
            // THEN
            expect(plateau.hasRoverAt(landing.position)).toBeTruthy();
            expect(error.message).toEqual(`${name} can no longer move or it will fall from plateau.`);
        }
    })

    it('should not move if position will collide with another rover', () => {
        // GIVEN
        const plateau = new Plateau(1, 1);
        const landing1 = { position: {x: 0, y:0}, orientation: Orientation.N };
        const rover1 = new Rover('Rover 1', landing1, [M]);
        const landing2 = { position: {x: 0, y:1}, orientation: Orientation.S };
        const rover2 = new Rover('Rover 2', landing2, [M]);
        rover1.landOn(plateau);
        rover2.landOn(plateau);

        try {
            // WHEN
            rover1.move(plateau);
        } catch (error) {
            // THEN
            expect(plateau.hasRoverAt(landing1.position)).toBeTruthy();
            expect(plateau.hasRoverAt(landing2.position)).toBeTruthy();
            expect(error.message).toEqual(`${rover1.name} can no longer move or it will collide with another rover at x:${landing2.position.x} y:${landing2.position.y}.`);
        }
    })
})