import { MatrixError } from '../errors/matrix-error';
import { MatrixOperationError } from '../errors/matrix-operation-error';
import { areElementsEqual } from '../utils/array/are-elements-equal';

export class Matrix {
  public columns: number;
  public rows: number;
  public readonly values: number[][];

  constructor(values: number[][]) {
    if (!values) {
      throw new MatrixError('Matrix is empty');
    }
    this.values = values;

    const size = this.calculateSize();
    this.columns = size.columns;
    this.rows = size.rows;
  }

  public add(matrix: Matrix): Matrix {
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new MatrixOperationError(
        `Matrix sizes are different. ${this.rows}x${this.columns}, ${matrix.rows}x${matrix.columns}`
      );
    }

    return new Matrix(
      this.values.map((row, rowIndex) => row.map((val, columnIndex) => val + matrix.values[rowIndex][columnIndex]))
    );
  }

  public multiply(multiplier: number | Matrix): Matrix {
    if (multiplier instanceof Matrix) {
      return this.multiplyByMatrix(<Matrix>multiplier);
    }

    return this.multiplyByNumber(<number>multiplier);
  }

  public subtract(matrix: Matrix): Matrix {
    if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
      throw new MatrixOperationError(
        `Matrix sizes are different. ${this.rows}x${this.columns}, ${matrix.rows}x${matrix.columns}`
      );
    }

    return new Matrix(
      this.values.map((row, rowIndex) => row.map((val, columnIndex) => val - matrix.values[rowIndex][columnIndex]))
    );
  }

  /**
   * Called when matrix doesn't satisfy specific size
   * @param rows
   * @param columns
   */
  protected throwSizeError(rows: number, columns: number): void {
    throw new MatrixError(`Matrix must be ${rows} rows and ${columns} columns. Now is ${this.rows}x${this.columns}`);
  }

  private calculateSize(): { rows: number, columns: number } {
    let rows = 0;
    let columns = 0;

    rows = this.values.length;
    if (rows === 0) {
      throw new MatrixError('There are no rows in matrix');
    }

    const lengthsOfRows = this.values.map(row => row.length);

    if (!areElementsEqual(lengthsOfRows)) {
      throw new MatrixError(`Lengths of rows are different: ${lengthsOfRows}`);
    }

    if (this.values[0].length === 0) {
      throw new MatrixError('There are no columns in matrix');
    }
    columns = this.values[0].length;

    return { rows, columns };
  }

  private multiplyByNumber(multiplier: number): Matrix {
    return new Matrix(this.values.map(row => row.map(val => val * multiplier)));
  }

  private multiplyByMatrix(matrix: Matrix): Matrix {
    const newValues: number[][] = [];

    for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
      const row = [];
      for (let colIndex = 0; colIndex < matrix.columns; colIndex++) {
        let sum = 0;
        for (let columnCalcIndex = 0; columnCalcIndex < this.columns; columnCalcIndex++) {
          sum += this.values[rowIndex][columnCalcIndex] * matrix.values[columnCalcIndex][colIndex];
        }
        row.push(sum);
      }
      newValues.push(row);
    }

    return new Matrix(newValues);
  }
}
