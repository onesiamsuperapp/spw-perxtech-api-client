import { PerxTransaction } from '../models';
import { Serialize, Deserialize } from 'cerialize';

describe('PerxTransaction', () => {
  test('should have correct default values', () => {
    const perxTransaction = new PerxTransaction();
    expect(Serialize(perxTransaction)).toEqual({
      amount: 0,
      merchant_user_account_id: null,
      points_earned: 0,
      properties: {},
      transaction_reference: null,
    });
  });

  test('should have correct instance', () => {
    const perxTransactionData = {
      points: 0,
      properties: {},
    };
    const perxTransaction: PerxTransaction = Deserialize(
      perxTransactionData,
      PerxTransaction
    );
    expect(perxTransaction).toBeInstanceOf(PerxTransaction);
  });
});
