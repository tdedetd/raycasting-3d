import { MatrixError } from './matrix-error';

export class MatrixOperationError extends MatrixError {
  constructor(message: string) {
    super(message);
    this.name = 'MatrixOperationError';
  }
}
