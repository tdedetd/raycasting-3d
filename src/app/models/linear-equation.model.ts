/**
 * Equation which has form a1x1 + ... + anxn + b = 0
 * @param coefficients
 * @param constant before equals
 */
export interface LinearEquation {
  coefficients: number[];
  constant: number;
}
