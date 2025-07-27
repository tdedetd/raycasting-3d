import { EquationError } from '../errors/equation-error';
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
}
