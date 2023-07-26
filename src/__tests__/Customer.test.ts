import { PerxCustomer } from '../models';
import { Serialize, Deserialize } from 'cerialize';

describe('PerxCustomer', () => {
  test('should have correct default values', () => {
    const customer = new PerxCustomer();
    expect(Serialize(customer)).toEqual({
      identifier: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      phone: null,
      email: null,
      birthday: null,
      gender: null,
      state: 'inactive',
      joined_at: null,
      password_expires_at: null,
    });
  });

  test('should have correct instance', () => {
    const customerData = {
      identifier: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      phone: null,
      email: null,
      birthday: null,
      gender: null,
      state: 'inactive',
      joined_at: null,
      password_expires_at: null,
    };
    const perxCustomer: PerxCustomer = Deserialize(customerData, PerxCustomer);
    expect(perxCustomer).toBeInstanceOf(PerxCustomer);
  });
});
