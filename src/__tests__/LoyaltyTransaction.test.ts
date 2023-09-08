import { PerxLoyaltyTransaction } from '../models';
import { Serialize, Deserialize } from 'cerialize';

describe('PerxLoyaltyTransaction', () => {
  test('should have correct default values', () => {
    const perxLoyaltyTransaction = new PerxLoyaltyTransaction();
    expect(Serialize(perxLoyaltyTransaction)).toEqual({
      points: 0,
      properties: {},
    });
  });

  test('should have correct instance', () => {
    const perxLoyaltyTransactioData = {
      points: 0,
      properties: {},
    };
    const perxLoyaltyTransaction: PerxLoyaltyTransaction = Deserialize(
      perxLoyaltyTransactioData,
      PerxLoyaltyTransaction
    );
    expect(perxLoyaltyTransaction).toBeInstanceOf(PerxLoyaltyTransaction);
  });
});
