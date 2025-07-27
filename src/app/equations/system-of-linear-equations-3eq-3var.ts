import { EquationError } from '../errors/equation-error';
import { Matrix3x3 } from '../matrix/matrix3x3';
import { LinearEquation } from './linear-equation';
import { SystemOfLinearEquations } from './system-of-linear-equations';

// TODO: generic for Matrix to class
export class SystemOfLinearEquations3eq3Var extends SystemOfLinearEquations {

  constructor(equations: LinearEquation[]) {
    super(equations);

    if (equations.length !== 3) throw new EquationError('The number of equations must be 3. Now - ' + equations.length);
    if (equations[0].coefficients.length !== 3) throw new EquationError('The number of variables must be 3. Now - ' + equations.length);
  }

  /**
   * Returns null, if system has no solutions
   */
  public getSolution(): number[] {
    return this.getSolutionByGauss();
  }

  /**
   * Solves the system of equations by Gaussian elimination.
   *
   * Equations of system is:
   *    ax + by + cz + d = 0
   *    ex + fy + iz + j = 0
   *    kx + my + pz + q = 0
   *
   * Then extended matrix of equation system is
   *    | a b c -d |
   *    | e f i -j |
   *    | k m p -q |
   *
   * Then compute values of variables in common case.
   * @returns coordinates x, y and z
   */
  private getSolutionByGauss(): number[] {
    /** values (coefficients) */
    const v = this.equations.map(eq => [...eq.coefficients, eq.constant]);
    const
      a = v[0][0],
      b = v[0][1],
      c = v[0][2],
      d = v[0][3],
      e = v[1][0],
      f = v[1][1],
      i = v[1][2],
      j = v[1][3],
      k = v[2][0],
      m = v[2][1],
      p = v[2][2],
      q = v[2][3];

    const ea = e / a;
    const ka = k / a;
    const fbea = f - b * ea;

    const z = (d * ka - q - ((m - b * ka) * ((d * ea - j) / fbea))) /
      (p - (c * ka) - ((m - b * ka) * ((i - c * ea) / fbea)));

    const y = (d * ea - j) / fbea - z * (i - c * ea) / fbea;

    const x = -d / a - y * b / a - z * c / a;

    return [x, y, z];
  }

  /** @deprecated */
  private getSolutionByCramersRule(): number[] | null {

    const v = this.equations.map(eq => eq.coefficients);
    const matrix = new Matrix3x3(v);

    const mainDeterminant = matrix.getDeterminant();
    if (mainDeterminant === 0) return null;

    const matrix1 = new Matrix3x3([
      [ -this.equations[0].constant, v[0][1], v[0][2] ],
      [ -this.equations[1].constant, v[1][1], v[1][2] ],
      [ -this.equations[2].constant, v[2][1], v[2][2] ]
    ]);

    const matrix2 = new Matrix3x3([
      [ v[0][0], -this.equations[0].constant, v[0][2] ],
      [ v[1][0], -this.equations[1].constant, v[1][2] ],
      [ v[2][0], -this.equations[2].constant, v[2][2] ]
    ]);

    const matrix3 = new Matrix3x3([
      [ v[0][0], v[0][1], -this.equations[0].constant ],
      [ v[1][0], v[1][1], -this.equations[1].constant ],
      [ v[2][0], v[2][1], -this.equations[2].constant ]
    ]);

    return [
      matrix1.getDeterminant() / mainDeterminant,
      matrix2.getDeterminant() / mainDeterminant,
      matrix3.getDeterminant() / mainDeterminant
    ];
  }
}
