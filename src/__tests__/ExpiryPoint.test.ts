import { ExpiryPoint } from '../models';
import { Serialize, Deserialize } from 'cerialize';

describe('ExpiryPoint', () => {
  test('should have correct default values', () => {
    const expirtPoint = new ExpiryPoint();
    expect(Serialize(expirtPoint)).toEqual({ date: null });
  });

  test('should have correct instance', () => {
    const expiryPointData = {
      aggregated_points: null,
      date: null,
    };
    const expiryPoint: ExpiryPoint = Deserialize(expiryPointData, ExpiryPoint);
    expect(expiryPoint).toBeInstanceOf(ExpiryPoint);
  });
});
