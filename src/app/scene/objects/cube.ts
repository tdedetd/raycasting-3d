import { CubeProperties } from '../object-properties/cube-properties';
import { Parallelepiped } from './parallelepiped';

export class Cube extends Parallelepiped {
  constructor(properties: CubeProperties) {
    const { size, ...baseProperties } = properties;
    const sizeDimensions = size ?? 1;
    super({
      ...baseProperties,
      sizeX: sizeDimensions,
      sizeY: sizeDimensions,
      sizeZ: sizeDimensions,
    });
  }
}
