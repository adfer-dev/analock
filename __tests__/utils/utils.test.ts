import { describe, expect, it } from "@jest/globals";
import { generateRandomNumberInInterval, getMatrixColumn, setMatrixColumn } from "../../utils/utils";
describe('matrix column functions', () => {
    const originalMatrix: number[][] = [[2, 1], [3, 4]]
    it('should get matrix column correctly', () => {
        const expectedColumn: number[] = [1, 4]
        expect(getMatrixColumn(originalMatrix, 1)).toStrictEqual(expectedColumn)
    })

    it('should set matrix column correctly', () => {
        const expectedColumn = [5, 5]
        setMatrixColumn(originalMatrix, expectedColumn, 1)
        expect(getMatrixColumn(originalMatrix, 1)).toStrictEqual(expectedColumn)
    })
})

describe('generate random number in interval function', () => {
    it('should generate a random number inside the given interval', () => {
        const generatedNumber = generateRandomNumberInInterval(1, 9)

        expect(generatedNumber).toBeLessThanOrEqual(9)
        expect(generatedNumber).toBeGreaterThanOrEqual(1)
    })
})