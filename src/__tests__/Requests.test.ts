import {
  PerxTransactionRequestData,
  PerxTransactionReqeust,
  PerxLoyaltyTransactionRequestUserAccount,
  PerxRawUserAccountId,
  PerxRawUserAccountIdentifier,
  PerxLoyaltyTransactionReservationRequest,
  PerxLoyaltyTransactionRequest,
  PerxInvoiceRequestUsedItem,
  PerxInvoiceRequestTransactionData,
  PerxInvoiceRequestTransactionDataRaw,
  PerxInvoiceRequest,
  PerxRawUserAccount,
} from '../models';

describe('PerxTransactionRequestData', () => {
  test('should init with default value', () => {
    const expected = {
      amount: 123,
      currency: 'THB',
      properties: {},
      transactionDate: new Date(),
      transactionReference: 'transaction-ref-001',
      transactionType: 'purchase',
    };
    const perxRequestData = new PerxTransactionRequestData(
      123,
      'THB',
      'transaction-ref-001'
    );
    expect(perxRequestData).toEqual(expected);
  });
});

describe('PerxTransactionReqeust', () => {
  test('should init with default value', () => {
    const userAccountId = 'user-account-001';
    const perxRequestData = new PerxTransactionRequestData(
      123,
      'THB',
      'transaction-ref-001'
    );
    const expected = {
      userAccountId,
      transactionData: perxRequestData,
    };
    const perxRequest = new PerxTransactionReqeust(
      userAccountId,
      perxRequestData
    );
    expect(perxRequest).toEqual(expected);
  });

  test('should be call PerxTransactionRequestData and PerxTransactionReqeust makePurchase', () => {
    const userAccountId = 'user-account-001';
    const perxRequest = PerxTransactionReqeust.makePurchase(
      userAccountId,
      123,
      'THB',
      'transaction-ref-001'
    );
    expect(perxRequest).toBeInstanceOf(PerxTransactionReqeust);
  });

  test('should be call PerxTransactionRequestData and PerxTransactionReqeust makeCustomTransaction', () => {
    const userAccountId = 'user-account-001';
    const perxRequest = PerxTransactionReqeust.makeCustomTransaction(
      'purchase',
      userAccountId,
      1234,
      'THB',
      'transaction-ref-001',
      undefined,
      new Date()
    );
    expect(perxRequest).toBeInstanceOf(PerxTransactionReqeust);
  });

  test('should be call PerxTransactionRequestData and PerxTransactionReqeust test', () => {
    const userAccountId = 'user-account-002';
    const input = {
      value: 100,
      type: 'id',
    };
    const perxRequest = PerxTransactionReqeust.makeCustomTransaction(
      'purchase-fix',
      userAccountId,
      5432,
      'THB',
      'transaction-ref-002',
      input,
      new Date()
    );
    expect(perxRequest).toBeInstanceOf(PerxTransactionReqeust);
  });
});

describe('PerxLoyaltyTransactionRequestUserAccount', () => {
  test('should be return id when init type id', () => {
    const perxUserAccountId: PerxRawUserAccountId = {
      id: 1,
      type: 'id',
    };
    const expected = {
      id: 1,
    };
    const perxRequestUserAccount = new PerxLoyaltyTransactionRequestUserAccount(
      perxUserAccountId
    );
    expect(perxRequestUserAccount).toEqual(expected);
  });

  test('should be return identifier when init identifier', () => {
    const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
      identifier: '0001',
      type: 'identifier',
    };
    const expected = {
      identifier: '0001',
    };
    const perxRequestUserAccount = new PerxLoyaltyTransactionRequestUserAccount(
      perxUserAccountIdentifier
    );
    expect(perxRequestUserAccount).toEqual(expected);
  });
});

describe('PerxLoyaltyTransactionReservationRequest', () => {
  test('should init with default value', () => {
    const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
      identifier: '0001',
      type: 'identifier',
    };
    const expected = {
      userAccount: { identifier: '0001', type: 'identifier' },
      points: 50,
      loyaltyProgramId: 1234,
    };
    const perxRequestUserAccount = new PerxLoyaltyTransactionReservationRequest(
      perxUserAccountIdentifier,
      1234,
      50
    );
    expect(perxRequestUserAccount).toEqual(expected);
  });
});

describe('PerxLoyaltyTransactionRequest', () => {
  test('should init with default value', () => {
    const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
      identifier: '0001',
      type: 'identifier',
    };
    const expected = {
      properties: {},
      transactionReference: 'transaction-ref-0001',
      transactionType: undefined,
      userAccount: { identifier: '0001', type: 'identifier' },
      points: 50,
      loyaltyProgramId: 1234,
    };
    const perxRequestUserAccount = new PerxLoyaltyTransactionRequest(
      perxUserAccountIdentifier,
      1234,
      50,
      'transaction-ref-0001'
    );
    expect(perxRequestUserAccount).toEqual(expected);
  });

  test('should init with default value not pass transactionRef', () => {
    const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
      identifier: '0001',
      type: 'identifier',
    };
    const expected = {
      properties: {},
      transactionType: undefined,
      userAccount: { identifier: '0001', type: 'identifier' },
      points: 50,
      loyaltyProgramId: 1234,
      transactionReference: null,
    };
    const perxRequestUserAccount = new PerxLoyaltyTransactionRequest(
      perxUserAccountIdentifier,
      1234,
      50
    );
    expect(perxRequestUserAccount).toEqual(expected);
  });

  test('should be return this', () => {
    const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
      identifier: '0001',
      type: 'identifier',
    };
    const expected = {
      properties: {},
      transactionReference: 'transaction-ref-0001',
      transactionType: 'purchase',
      userAccount: { identifier: '0001', type: 'identifier' },
      points: 50,
      loyaltyProgramId: 1234,
    };
    const perxRequestUserAccount = new PerxLoyaltyTransactionRequest(
      perxUserAccountIdentifier,
      1234,
      50,
      'transaction-ref-0001'
    );
    const resultTransactionType =
      perxRequestUserAccount.withTransactionType('purchase');
    expect(resultTransactionType).toEqual(expected);
  });

  test('should be return points negative when call makeBurnRequest', () => {
    const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
      identifier: '0001',
      type: 'identifier',
    };
    const expected = {
      properties: {},
      transactionReference: null,
      transactionType: undefined,
      userAccount: {
        identifier: '0001',
      },
      points: -200,
      loyaltyProgramId: 4567,
    };
    const resultMakeBurn = PerxLoyaltyTransactionRequest.makeBurnRequest(
      perxUserAccountIdentifier,
      4567,
      200
    );
    expect(resultMakeBurn).toEqual(expected);
  });
  test('should be return points positive when call makeBurnRequest', () => {
    const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
      identifier: '0001',
      type: 'identifier',
    };
    const expected = {
      properties: {},
      transactionReference: null,
      transactionType: undefined,
      userAccount: {
        identifier: '0001',
      },
      points: 100,
      loyaltyProgramId: 4567,
    };
    const resultMakeBurn = PerxLoyaltyTransactionRequest.makeEarnRequest(
      perxUserAccountIdentifier,
      4567,
      100
    );
    expect(resultMakeBurn).toEqual(expected);
  });

  describe('PerxInvoiceRequestUsedItem', () => {
    test('should init with default value', () => {
      const expected = {
        itemId: 12345,
        itemType: 'Reward::Transaction',
      };
      const perxInvoiceRequestUsedItem = new PerxInvoiceRequestUsedItem(
        'Reward::Transaction',
        12345
      );
      expect(perxInvoiceRequestUsedItem).toEqual(expected);
    });

    test('should be return points with PerxInvoiceRequestUsedItem', () => {
      const expected = {
        itemId: 321,
        itemType: 'StoredValue::Transaction',
      };
      const perxInvoiceRequestUsedItem = PerxInvoiceRequestUsedItem.points(321);
      expect(perxInvoiceRequestUsedItem).toEqual(expected);
    });

    test('should be return reward with PerxInvoiceRequestUsedItem', () => {
      const expected = {
        itemId: 1234,
        itemType: 'Reward::Transaction',
      };
      const perxInvoiceRequestUsedItem =
        PerxInvoiceRequestUsedItem.reward(1234);
      expect(perxInvoiceRequestUsedItem).toEqual(expected);
    });
  });

  describe('PerxInvoiceRequestTransactionData', () => {
    test('should init with default value', () => {
      const input: PerxInvoiceRequestTransactionDataRaw = {
        appliedPoints: 200,
        currency: 'THB',
        appliedVouchers: ['001', '002'],
        properties: {},
        transactionReference: 'transaction-ref-001',
        transactionType: 'purchase-overall',
      };
      const expected = {
        transactionType: 'purchase-overall',
        transactionReference: 'transaction-ref-001',
        currency: 'THB',
        amount: 200,
        merchantIdentifier: 'merchant-0001',
        properties: {
          applied_vouchers: '001,002',
          applied_points: '200',
          merchant_identifier: 'merchant-0001',
        },
      };
      const perxInvoiceRequestTransactionData =
        new PerxInvoiceRequestTransactionData(200, 'merchant-0001', input);
      expect(perxInvoiceRequestTransactionData).toEqual(expected);
    });

    test('should init with default value not pass transactionType', () => {
      const input: PerxInvoiceRequestTransactionDataRaw = {
        appliedPoints: 200,
        currency: 'THB',
        appliedVouchers: ['001', '002'],
        properties: {},
        transactionReference: 'transaction-ref-001',
      };
      const expected = {
        transactionType: 'purchase',
        transactionReference: 'transaction-ref-001',
        currency: 'THB',
        amount: 200,
        merchantIdentifier: 'merchant-0001',
        properties: {
          applied_vouchers: '001,002',
          applied_points: '200',
          merchant_identifier: 'merchant-0001',
        },
      };
      const perxInvoiceRequestTransactionData =
        new PerxInvoiceRequestTransactionData(200, 'merchant-0001', input);
      expect(perxInvoiceRequestTransactionData).toEqual(expected);
    });

    test('should init with default value not pass appliedVouchers', () => {
      const input: PerxInvoiceRequestTransactionDataRaw = {
        appliedPoints: 200,
        currency: 'THB',
        properties: {},
        transactionReference: 'transaction-ref-001',
      };
      const expected = {
        transactionType: 'purchase',
        transactionReference: 'transaction-ref-001',
        currency: 'THB',
        amount: 200,
        merchantIdentifier: 'merchant-0001',
        properties: {
          applied_vouchers: undefined,
          applied_points: '200',
          merchant_identifier: 'merchant-0001',
        },
      };
      const perxInvoiceRequestTransactionData =
        new PerxInvoiceRequestTransactionData(200, 'merchant-0001', input);
      expect(perxInvoiceRequestTransactionData).toEqual(expected);
    });

    test('should init with default value not pass appliedPoints', () => {
      const input: PerxInvoiceRequestTransactionDataRaw = {
        currency: 'THB',
        properties: {},
        transactionReference: 'transaction-ref-001',
      };
      const expected = {
        transactionType: 'purchase',
        transactionReference: 'transaction-ref-001',
        currency: 'THB',
        amount: 200,
        merchantIdentifier: 'merchant-0001',
        properties: {
          applied_vouchers: undefined,
          applied_points: undefined,
          merchant_identifier: 'merchant-0001',
        },
      };
      const perxInvoiceRequestTransactionData =
        new PerxInvoiceRequestTransactionData(200, 'merchant-0001', input);
      expect(perxInvoiceRequestTransactionData).toEqual(expected);
    });
  });

  describe('PerxInvoiceRequest', () => {
    test('should init with default value', () => {
      const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
        identifier: '0001',
        type: 'identifier',
      };
      const expected = {
        transactionData: [],
        usedItems: [],
        userAccount: { identifier: '0001' },
      };
      const perxInvoiceInvoiceRequest = new PerxInvoiceRequest(
        perxUserAccountIdentifier
      );
      expect(perxInvoiceInvoiceRequest).toEqual(expected);
    });

    test('should init with default value pass type PerxLoyaltyTransactionRequestUserAccount', () => {
      const perxUserAccountIdentifier: PerxRawUserAccount = {
        type: 'identifier',
        identifier: '123',
      };
      const perxLoyaltyTransactionRequestUserAccount =
        new PerxLoyaltyTransactionRequestUserAccount(perxUserAccountIdentifier);
      const expected = {
        transactionData: [],
        usedItems: [],
        userAccount: { identifier: '123' },
      };
      const perxInvoiceInvoiceRequest = new PerxInvoiceRequest(
        perxLoyaltyTransactionRequestUserAccount
      );
      expect(perxInvoiceInvoiceRequest).toEqual(expected);
    });

    test('should be return this when call addTransactions', () => {
      const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
        identifier: '0001',
        type: 'identifier',
      };
      const perxInvoiceRequestTransactionData1: PerxInvoiceRequestTransactionData =
        {
          amount: 1234,
          currency: 'THB',
          merchantIdentifier: 'merchant-0001',
          properties: {},
          transactionReference: 'transaction-ref-0001',
          transactionType: 'purchase-overall',
        };
      const perxInvoiceRequestTransactionData2: PerxInvoiceRequestTransactionData =
        {
          amount: 5678,
          currency: 'THB',
          merchantIdentifier: 'merchant-0002',
          properties: {},
          transactionReference: 'transaction-ref-0002',
          transactionType: 'purchase-fix',
        };
      const expected = {
        transactionData: [
          {
            amount: 1234,
            currency: 'THB',
            merchantIdentifier: 'merchant-0001',
            properties: {},
            transactionReference: 'transaction-ref-0001',
            transactionType: 'purchase-overall',
          },
          {
            amount: 5678,
            currency: 'THB',
            merchantIdentifier: 'merchant-0002',
            properties: {},
            transactionReference: 'transaction-ref-0002',
            transactionType: 'purchase-fix',
          },
        ],
        usedItems: [],
        userAccount: { identifier: '0001' },
      };
      const perxInvoiceInvoiceRequest = new PerxInvoiceRequest(
        perxUserAccountIdentifier
      );
      const resultTransaction = perxInvoiceInvoiceRequest.addTransactions(
        perxInvoiceRequestTransactionData1,
        perxInvoiceRequestTransactionData2
      );
      expect(resultTransaction).toEqual(expected);
    });

    test('should be return this when call used', () => {
      const perxUserAccountIdentifier: PerxRawUserAccountIdentifier = {
        identifier: '0001',
        type: 'identifier',
      };
      const expected = {
        transactionData: [],
        usedItems: [
          {
            itemId: 1234,
            itemType: 'Reward::Transaction',
          },
          {
            itemId: 5678,
            itemType: 'StoredValue::Transaction',
          },
        ],
        userAccount: { identifier: '0001' },
      };
      const perxInvoiceInvoiceRequest = new PerxInvoiceRequest(
        perxUserAccountIdentifier
      );
      const perxInvoiceRequestUsedItem1 = new PerxInvoiceRequestUsedItem(
        'Reward::Transaction',
        1234
      );
      const perxInvoiceRequestUsedItem2 = new PerxInvoiceRequestUsedItem(
        'StoredValue::Transaction',
        5678
      );
      const resultTransaction = perxInvoiceInvoiceRequest.used(
        perxInvoiceRequestUsedItem1,
        perxInvoiceRequestUsedItem2
      );
      expect(resultTransaction).toEqual(expected);
    });
  });
});
