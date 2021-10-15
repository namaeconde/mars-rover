import { createPlateau, createRovers } from '../index';
import {Orientation} from "../Rover";

describe('create plateau based on input', () => {
    it('should return correct plateau from valid input', () => {
        // GIVEN
        const data = 'Plateau:5 5'

        // WHEN
        let actualPlateau = createPlateau(data);

        // THEN
        expect(actualPlateau.width).toEqual(5);
        expect(actualPlateau.height).toEqual(5);
        expect(actualPlateau.rovers).toEqual([]);
    })

    it('should throw error from input not for plateau', () => {
        // GIVEN
        const data = 'Rover1: 5 5'

        try {
            // WHEN
            createPlateau(data);
        } catch (error) {
            // THEN
            expect(error.message).toEqual('Insufficient data to create plateau.');
        }
    })

    it('should throw error from insufficient plateau dimensions', () => {
        // GIVEN
        const data = 'Plateau: 5'

        try {
            // WHEN
            createPlateau(data);
        } catch (error) {
            // THEN
            expect(error.message).toEqual('Insufficient Plateau dimensions.');
        }
    })

    it('should throw error from invalid plateau dimensions', () => {
        // GIVEN
        const data = 'Plateau: tests tests'

        try {
            // WHEN
            createPlateau(data);
        } catch (error) {
            // THEN
            expect(error.message).toEqual('Invalid Plateau dimensions.');
        }
    })
})

describe('create rovers based on input', () => {
    it('should return correct rovers from valid inputs', () => {
        // GIVEN
        const data = [
            'Rover1 Landing:1 2 N',
            'Rover1 Instructions:LMLMLMLMM',
            'Rover2 Landing:3 3 E',
            'Rover2 Instructions:MMRMMRMRRM',
        ]

        // WHEN
        let actualRovers = createRovers(data);
        let [ rover1, rover2 ] = actualRovers;

        // THEN
        expect(actualRovers.length).toEqual(2);
        expect(rover1.name).toEqual('Rover1');
        expect(rover1.landing).toEqual({position: {x: 1, y: 2}, orientation: Orientation.N});
        expect(rover1.instructions).toEqual('LMLMLMLMM'.split(''));

        expect(rover2.name).toEqual('Rover2');
        expect(rover2.landing).toEqual({position: {x: 3, y: 3}, orientation: Orientation.E});
        expect(rover2.instructions).toEqual('MMRMMRMRRM'.split(''));

    })
})