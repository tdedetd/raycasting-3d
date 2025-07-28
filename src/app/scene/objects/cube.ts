import { CubeProperties } from '../object-properties/cube-properties';
import { Parallelepiped } from './parallelepiped';

export class Cube extends Parallelepiped {
  constructor(properties: CubeProperties) {
    const { size, ...baseProperties } = properties;
    super({
      ...baseProperties,
      sizeX: size,
      sizeY: size,
      sizeZ: size,
    });
  }
}
