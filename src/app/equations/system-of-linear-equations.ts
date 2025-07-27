import { EquationError } from '../errors/equation-error';
import { SquareMatrix } from '../matrix/square-matrix';
import { LinearEquation } from '../models/linear-equation.model';
import { areElementsEqual } from '../utils/are-elements-equal';

export class SystemOfLinearEquations {

  public readonly equations: LinearEquation[];

  // Number of variables = number of equations
  constructor(equations: LinearEquation[]) {
    this.equations = equations;

    const numbersOfCoefficients = equations.map(eq => eq.coefficients.length);
    if (!areElementsEqual(numbersOfCoefficients)) {
      throw new EquationError(`Different numbers of coefficients: ${numbersOfCoefficients}`);
    }
  }

  /**
   * Returns null, if system has no solutions
   */
  public getSolution(): number[] | null {

    // by Cramer's rule

    const matrix = new SquareMatrix(this.equations.map(eq => eq.coefficients));

    const mainDeterminant = matrix.getDeterminant();
    if (mainDeterminant === 0) {
      return null;
    }
    const solution: number[] = [];

    for (let columnIndex = 0; columnIndex < matrix.columns; columnIndex++) {
      const valuesForMatrix: number[][] = [];

      for (let i = 0; i < this.equations.length; i++) {
        const rowValues = this.equations[i].coefficients.slice();
        rowValues[columnIndex] = -this.equations[i].constant;
        valuesForMatrix.push(rowValues);
      }

      solution.push(new SquareMatrix(valuesForMatrix).getDeterminant() / mainDeterminant);
    }
    return solution;
  }
}
