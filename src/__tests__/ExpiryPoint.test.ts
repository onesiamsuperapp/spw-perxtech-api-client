import { ExpiryPoint } from '../models';
import { Serialize, Deserialize } from 'cerialize';

describe('ExpiryPoint', () => {
  test('should have correct default values', () => {
    const expirePoint = new ExpiryPoint();
    expect(Serialize(expirePoint)).toEqual({ date: null, timestamp: null });
  });

  test('should have correct instance', () => {
    const expiryPointData = {
      aggregated_points: null,
      date: null,
      timestamp: null,
    };
    const expiryPoint: ExpiryPoint = Deserialize(expiryPointData, ExpiryPoint);
    expect(expiryPoint).toBeInstanceOf(ExpiryPoint);
  });
});
