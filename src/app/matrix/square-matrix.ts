import { MatrixError } from '../errors/matrix-error';
import { Matrix } from './matrix';

export class SquareMatrix extends Matrix {

  constructor(values: number[][]) {
    super(values);

    if (this.rows !== this.columns) {
      throw new MatrixError(`It's not a square matrix (${this.rows}x${this.columns})`);
    }
  }

  public getDeterminant(multiplier: number = 1): number {

    if (this.rows === 2 && this.columns === 2) {
      return multiplier * this.values[0][0] * this.values[1][1] - multiplier * this.values[0][1] * this.values[1][0];
    }

    let determinant = 0;

    for (let columnIndex = 0; columnIndex < this.columns; columnIndex++) {

      const matrixValues: number[][] = [];
      for (let rowIndex = 1; rowIndex < this.rows; rowIndex++) {
        const row = this.values[rowIndex].slice();
        row.splice(columnIndex, 1);
        matrixValues.push(row);
      }

      const newMultiplier = multiplier * this.values[0][columnIndex];
      determinant += (columnIndex % 2 === 0 ? 1 : -1) * new SquareMatrix(matrixValues).getDeterminant(newMultiplier);
    }

    return determinant;
  }
}
