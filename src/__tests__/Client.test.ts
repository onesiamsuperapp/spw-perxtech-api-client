import {
  IPerxService,
  PerxService,
  PerxError,
  PerxRewardScope,
  PerxVoucherScope,
  PerxTransactionReqeust,
  PerxLoyaltyTransactionRequest,
  PerxIdentification,
} from '..';
import * as cerialize from 'cerialize';
import nock from 'nock';

const BASE_URL = 'https://perx-dev.com';
const HTTP_PATH_PERX_AUTH = '/v4/oauth/token';
const HTTP_PATH_USER_ACCOUNT = '/v4/pos/user_accounts/';
const HTTP_PATH_REWARD = '/v4/rewards/';
const HTTP_PATH_REWARDS = '/v4/rewards';
const HTTP_PATH_VOUCHER = '/v4/vouchers/';
const HTTP_PATH_VOUCHERS = '/v4/vouchers';
const HTTP_PATH_POST_VOUCHERS = '/v4/pos/vouchers/';
const HTTP_PATH_PER_FORM_CUSTOM_TRIGGER = '/v4/app_triggers/';
const HTTP_PATH_LOYALTY = '/v4/loyalty';
const HTTP_PATH_CUSTOMERS = '/v4/customers';
const HTTP_PATH_SUBMIT_TRANSACTIONS = '/v4/pos/transactions';
const HTTP_PATH_SUBMIT_LOYALTY_TRANSACTIONS = '/v4/pos/loyalty_transactions';

const nockUserToken = (statusCode: number) => {
  nock(BASE_URL, {
    reqheaders: {},
  })
    .post(HTTP_PATH_PERX_AUTH, {
      client_id: 'client_id',
      client_secret: 'client_secret',
      grant_type: 'client_credentials',
      scope: 'user_account(identifier:userIdentifier-0001)',
      expires_in: 500,
    })
    .reply(statusCode, {
      access_token: 'access_token_0001',
      token_type: 'token_type_0001',
    });
};

const nockMerchantBearerToken = (
  statusCode: number,
  merchantIdentifier: string
) => {
  nock(BASE_URL, {
    reqheaders: {},
  })
    .post(HTTP_PATH_PERX_AUTH, {
      client_id: 'client_id',
      client_secret: 'client_secret',
      grant_type: 'client_credentials',
      identifier: merchantIdentifier,
      scope: 'merchant_user_account',
    })
    .reply(statusCode, {
      code: 'code_0001',
      message: 'message_0001',
      bearer_token: 'bearer_token_0001',
      tenant: 'tenant_0001',
    });
};

const nockMerchantBearerTokenNoData = (
  statusCode: number,
  merchantIdentifier: string
) => {
  nock(BASE_URL, {
    reqheaders: {},
  })
    .post(HTTP_PATH_PERX_AUTH, {
      client_id: 'client_id',
      client_secret: 'client_secret',
      grant_type: 'client_credentials',
      identifier: merchantIdentifier,
      scope: 'merchant_user_account',
    })
    .reply(statusCode, {});
};

const nockCustomerDetail = (
  statusCode: number,
  applicationToken: string,
  userId: number
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${applicationToken}`,
    },
  })
    .get(HTTP_PATH_USER_ACCOUNT + userId)
    .reply(statusCode, {
      data: {
        id: 1,
        identifier: 'identifier-0001',
        first_name: 'komsan',
        middle_name: null,
        last_name: 'kawichai',
        phone: '0875674747',
        email: 'dring@hotmail.com',
        birthday: '1992-03-03',
        gender: 'male',
        state: 'active',
        joined_at: null,
        password_expires_at: null,
      },
    });
};

const nockApplicationToken = (statusCode: number) => {
  nock(BASE_URL, {
    reqheaders: {},
  })
    .post(HTTP_PATH_PERX_AUTH, {
      client_id: 'client_id',
      client_secret: 'client_secret',
      grant_type: 'client_credentials',
    })
    .reply(statusCode, {
      access_token: 'access_token_0001',
      token_type: 'token_type_0001',
    });
};

const nockReward = (
  statusCode: number,
  userToken: string,
  rewardId?: number
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .get(HTTP_PATH_REWARD + rewardId)
    .reply(statusCode, {
      data: {
        id: 12,
        name: 'reward-0001',
      },
    });
};

const nockRewards = (
  statusCode: number,
  userToken: string,
  params: Partial<PerxRewardScope>
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .get(HTTP_PATH_REWARDS)
    .query(params)
    .reply(statusCode, {
      data: [
        {
          id: 11,
          name: 'reward-0011',
        },
        {
          id: 12,
          name: 'reward-0012',
        },
        {
          id: 13,
          name: 'reward-0013',
        },
      ],
    });
};

const nockIssueVoucher = (
  statusCode: number,
  userToken: string,
  rewardId: number
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .post(HTTP_PATH_REWARD + rewardId + '/issue')
    .reply(statusCode, {
      data: {
        id: 12,
        name: 'reward-0001',
      },
    });
};

const nockVoucher = (
  statusCode: number,
  userToken: string,
  voucher: number
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .get(HTTP_PATH_VOUCHER + voucher)
    .reply(statusCode, {
      data: {
        id: 14,
        name: 'voucher-0001',
      },
    });
};

const nockVouchers = (
  statusCode: number,
  userToken: string,
  scope: Partial<PerxVoucherScope>
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .get(HTTP_PATH_VOUCHERS)
    .query(scope)
    .reply(statusCode, {
      data: [
        {
          id: 11,
          name: 'voucher-0011',
        },
        {
          id: 12,
          name: 'voucher-0012',
        },
      ],
    });
};

const nockReserveReward = (
  statusCode: number,
  userToken: string,
  rewardId: string,
  timeoutInMs: number = 900 * 1000
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .post(HTTP_PATH_REWARD + rewardId + '/reserve')
    .query({
      timeout: timeoutInMs,
    })
    .reply(statusCode, {
      data: {
        id: 9,
        name: 'reward-0009',
      },
    });
};

const nockReleaseRewardReservation = (
  statusCode: number,
  userToken: string,
  reservationId: string
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .patch(HTTP_PATH_VOUCHER + reservationId + '/release')
    .reply(statusCode, {
      data: {
        id: 14,
        name: 'release-0001',
      },
    });
};

const nockConfirmRewardReservation = (
  statusCode: number,
  userToken: string,
  reservationId: string
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .patch(HTTP_PATH_VOUCHER + reservationId + '/confirm')
    .reply(statusCode, {
      data: {
        id: 15,
        name: 'confirm-0001',
      },
    });
};

const nockRedeemVoucher = (
  statusCode: number,
  userToken: string,
  voucherId: string,
  filter: {}
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .post(HTTP_PATH_VOUCHER + voucherId + '/redeem')
    .query(filter)
    .reply(statusCode, {
      data: [
        {
          id: 16,
          name: 'redeem-0016',
        },
        {
          id: 17,
          name: 'redeem-0017',
        },
      ],
    });
};

const nockPosReleaseReservedVoucher = (
  statusCode: number,
  userToken: string,
  voucherId: string
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .put(HTTP_PATH_POST_VOUCHERS + voucherId + '/revert_redemption')
    .query({})
    .reply(statusCode, {
      data: {
        id: 15,
        name: 'revert_redemption-0001',
      },
    });
};

const nockPerformCustomTrigger = (
  statusCode: number,
  userToken: string,
  perxCustomTriggerId: string
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .put(HTTP_PATH_PER_FORM_CUSTOM_TRIGGER + perxCustomTriggerId)
    .query({})
    .reply(statusCode, {
      data: {
        id: 15,
        name: 'revert_redemption-0001',
      },
    });
};

const nockLoyaltyProgram = (
  statusCode: number,
  userToken: string,
  loyaltyProgramId: string
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .get(HTTP_PATH_LOYALTY + '/' + loyaltyProgramId)
    .query({})
    .reply(statusCode, {
      data: {
        id: 15,
        name: 'revert_redemption-0001',
      },
    });
};

const nockLoyaltyPrograms = (statusCode: number, userToken: string) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .get(HTTP_PATH_LOYALTY)
    .query({})
    .reply(statusCode, {
      data: [
        {
          id: 11,
          name: 'voucher-0011',
        },
        {
          id: 12,
          name: 'voucher-0012',
        },
      ],
    });
};

const nockLoyaltyTransactions = (
  statusCode: number,
  userToken: string,
  loyaltyProgramId: string,
  page: number,
  size: number
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .get(HTTP_PATH_LOYALTY + '/' + loyaltyProgramId + '/transactions')
    .query({ page, size })
    .reply(statusCode, {
      data: [
        {
          id: 11,
          name: 'voucher-0011',
        },
        {
          id: 12,
          name: 'voucher-0012',
        },
      ],
    });
};

const nockCustomer = (
  statusCode: number,
  userToken: string,
  customerId: string | number = 'me'
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${userToken}`,
    },
  })
    .get(HTTP_PATH_CUSTOMERS + '/' + customerId)
    .query({})
    .reply(statusCode, {
      data: [
        {
          id: 11,
          name: 'voucher-0011',
        },
        {
          id: 12,
          name: 'voucher-0012',
        },
      ],
    });
};

const nockSubmitLoyaltyTransactions = (
  statusCode: number,
  applicationToken: string
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${applicationToken}`,
    },
  })
    .post(HTTP_PATH_SUBMIT_LOYALTY_TRANSACTIONS)
    .reply(statusCode, {
      data: [
        {
          id: 33,
          loyalty_program_id: 213,
          points: 44,
          properties: {},
        },
      ],
    });
};

const nockSubmitTransaction = (
  statusCode: number,
  applicationToken: string
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${applicationToken}`,
    },
  })
    .post(HTTP_PATH_SUBMIT_TRANSACTIONS)
    .reply(statusCode, {
      data: [
        {
          id: 10,
          user_account_id: 'user-account-0001',
          transaction_type: 'purchase',
          amount: 1530,
          properties: {},
          transaction_reference: 'transaction-ref-0001',
          points_earned: 123,
          merchant_user_account_id: null,
        },
      ],
    });
};

const nockReserveLoyaltyPoints = (
  statusCode: number,
  applicationToken: string,
  dateNow: Date
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${applicationToken}`,
    },
  })
    .post(HTTP_PATH_SUBMIT_LOYALTY_TRANSACTIONS + '/reserve')
    .reply(statusCode, {
      data: [
        {
          id: 322,
          loyalty_program_id: 567,
          points: 500,
          properties: {},
          transacted_at: dateNow,
        },
      ],
    });
};

const nockReleaseLoyaltyPoints = (
  statusCode: number,
  applicationToken: string,
  transactionId: string
) => {
  nock(BASE_URL, {
    reqheaders: {
      authorization: `Bearer ${applicationToken}`,
    },
  })
    .put(
      HTTP_PATH_SUBMIT_LOYALTY_TRANSACTIONS +
        '/' +
        transactionId +
        '/revert_redemption'
    )
    .reply(statusCode, {
      data: {
        id: transactionId,
      },
    });
};

describe('PerxService', () => {
  const client: IPerxService = new PerxService({
    baseURL: BASE_URL,
    clientId: 'client_id',
    clientSecret: 'client_secret',
    tokenDurationInSeconds: 500,
    newRelic: {
      environment: 'test',
    },
  });
  afterEach(() => {
    nock.cleanAll();
  });
  test('should return getUserToken success', async () => {
    const STATUS_CODE = 200;
    const expected = {
      accessToken: 'access_token_0001',
      expiresIn: 0,
      refreshToken: null,
      tokenType: 'token_type_0001',
    };
    const userIdentifier = 'userIdentifier-0001';
    nockUserToken(STATUS_CODE);
    const tokenResp = await client.getUserToken(userIdentifier);
    expect(tokenResp).toEqual(expected);
  });
  test('should return getUserToken 401', async () => {
    const STATUS_CODE = 401;
    const expected = 'Invalid token';
    const userIdentifier = 'userIdentifier-0001';
    nockUserToken(STATUS_CODE);
    let result;
    try {
      await client.getUserToken(userIdentifier);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return getMerchantBearerToken success', async () => {
    const STATUS_CODE = 200;
    const expected = {
      bearerToken: 'bearer_token_0001',
      code: 'code_0001',
      message: 'message_0001',
      tenant: 'tenant_0001',
    };
    const merchantIdentifier = 'merchantIdentifier-0001';
    nockMerchantBearerToken(STATUS_CODE, merchantIdentifier);
    const tokenResp = await client.getMerchantBearerToken(merchantIdentifier);
    expect(tokenResp).toEqual(expected);
  });
  test('should return getMerchantBearerToken 401', async () => {
    const STATUS_CODE = 401;
    const expected = 'Invalid token';
    const merchantIdentifier = 'merchantIdentifier-0001';
    nockMerchantBearerToken(STATUS_CODE, merchantIdentifier);
    let result;
    try {
      await client.getMerchantBearerToken(merchantIdentifier);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return getMerchantBearerToken error no data', async () => {
    jest.spyOn(cerialize, 'Deserialize').mockReturnValueOnce(null);
    const STATUS_CODE = 200;
    const expected = 'no data converted';
    const merchantIdentifier = 'merchantIdentifier-0002';
    nockMerchantBearerTokenNoData(STATUS_CODE, merchantIdentifier);
    let result;
    try {
      await client.getMerchantBearerToken(merchantIdentifier);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return getCustomerDetail success', async () => {
    const STATUS_CODE = 200;
    const expected = {
      birthdayYYYYMMDD: '1992-03-03',
      email: 'dring@hotmail.com',
      firstName: 'komsan',
      gender: 'male',
      id: 1,
      identifier: 'identifier-0001',
      joinedAt: null,
      lastName: 'kawichai',
      middleName: null,
      passwordExpiresAt: null,
      phone: '0875674747',
      state: 'active',
    };

    const applicationToken = 'applicationToken-0001';
    const userId = 1234;
    nockCustomerDetail(STATUS_CODE, applicationToken, userId);
    const customerDetailResult = await client.getCustomerDetail(
      applicationToken,
      userId
    );
    expect(customerDetailResult).toEqual(expected);
  });
  test('should return getCustomerDetail 401', async () => {
    const STATUS_CODE = 401;
    const expected = 'Invalid token';
    const applicationToken = 'applicationToken-0001';
    const userId = 1234;
    nockCustomerDetail(STATUS_CODE, applicationToken, userId);
    let result;
    try {
      await client.getCustomerDetail(applicationToken, userId);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return getApplicationToken success', async () => {
    const STATUS_CODE = 200;
    const expected = {
      accessToken: 'access_token_0001',
      expiresIn: 0,
      refreshToken: null,
      tokenType: 'token_type_0001',
    };
    nockApplicationToken(STATUS_CODE);
    const applicationTokenResult = await client.getApplicationToken();
    expect(applicationTokenResult).toEqual(expected);
  });
  test('should return getApplicationToken 401', async () => {
    const STATUS_CODE = 401;
    const expected = 'Invalid token';
    nockApplicationToken(STATUS_CODE);
    let result;
    try {
      await client.getApplicationToken();
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return getReward success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const rewardId = 12;
    const expected = {
      brands: [],
      categoryTags: [],
      customFields: {},
      ecommerceOnly: false,
      eligible: false,
      id: 12,
      images: [],
      isFavourite: false,
      isGiftable: false,
      loyalty: [],
      merchantId: null,
      merchantLogoURL: null,
      merchantName: null,
      merchantNameAlt: null,
      merchantTextAlt: null,
      merchantWebsite: null,
      merchantWebsiteAlt: null,
      name: 'reward-0001',
      operatingNow: false,
      rewardPrices: [],
      sellingFrom: null,
      sellingTo: null,
      stepsToRedeem: null,
      subtitle: null,
      tags: [],
      termsAndConditions: null,
      validFrom: null,
      validTo: null,
    };
    nockReward(STATUS_CODE, userToken, rewardId);
    const rewardResult = await client.getReward(userToken, rewardId);
    expect(rewardResult.data).toEqual(expected);
  });
  test('should return getRewards success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const expected = [
      {
        brands: [],
        categoryTags: [],
        customFields: {},
        ecommerceOnly: false,
        eligible: false,
        id: 11,
        images: [],
        isFavourite: false,
        isGiftable: false,
        loyalty: [],
        merchantId: null,
        merchantLogoURL: null,
        merchantName: null,
        merchantNameAlt: null,
        merchantTextAlt: null,
        merchantWebsite: null,
        merchantWebsiteAlt: null,
        name: 'reward-0011',
        operatingNow: false,
        rewardPrices: [],
        sellingFrom: null,
        sellingTo: null,
        stepsToRedeem: null,
        subtitle: null,
        tags: [],
        termsAndConditions: null,
        validFrom: null,
        validTo: null,
      },
      {
        brands: [],
        categoryTags: [],
        customFields: {},
        ecommerceOnly: false,
        eligible: false,
        id: 12,
        images: [],
        isFavourite: false,
        isGiftable: false,
        loyalty: [],
        merchantId: null,
        merchantLogoURL: null,
        merchantName: null,
        merchantNameAlt: null,
        merchantTextAlt: null,
        merchantWebsite: null,
        merchantWebsiteAlt: null,
        name: 'reward-0012',
        operatingNow: false,
        rewardPrices: [],
        sellingFrom: null,
        sellingTo: null,
        stepsToRedeem: null,
        subtitle: null,
        tags: [],
        termsAndConditions: null,
        validFrom: null,
        validTo: null,
      },
      {
        brands: [],
        categoryTags: [],
        customFields: {},
        ecommerceOnly: false,
        eligible: false,
        id: 13,
        images: [],
        isFavourite: false,
        isGiftable: false,
        loyalty: [],
        merchantId: null,
        merchantLogoURL: null,
        merchantName: null,
        merchantNameAlt: null,
        merchantTextAlt: null,
        merchantWebsite: null,
        merchantWebsiteAlt: null,
        name: 'reward-0013',
        operatingNow: false,
        rewardPrices: [],
        sellingFrom: null,
        sellingTo: null,
        stepsToRedeem: null,
        subtitle: null,
        tags: [],
        termsAndConditions: null,
        validFrom: null,
        validTo: null,
      },
    ];
    const filter = { page: 12 };
    nockRewards(STATUS_CODE, userToken, filter);
    const rewardResult = await client.getRewards(userToken, filter);
    expect(rewardResult.data).toEqual(expected);
  });
  test('should return issueVoucher success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const rewardId = 12;
    const expected = {
      customFields: {},
      id: 12,
      issuedDate: null,
      name: 'reward-0001',
      redemptionDate: null,
      reservationExpiresAt: null,
      reservedExpiresAt: null,
      reward: null,
      state: 'expired',
      userAccount: null,
      validFrom: null,
      validTo: null,
      voucherCode: null,
      voucherExpiresAt: null,
      voucherType: 'code',
    };
    nockIssueVoucher(STATUS_CODE, userToken, rewardId);
    const applicationTokenResult = await client.issueVoucher(
      userToken,
      rewardId
    );
    expect(applicationTokenResult).toEqual(expected);
  });
  test('should return issueVoucher fail', async () => {
    const userToken = 'user-token-0001';
    const rewardId = '12H';
    const expected = `Invalid rewardId: ${rewardId}, expected rewardId as integer`;
    let result;
    try {
      await client.issueVoucher(userToken, rewardId);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return getVoucher success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const voucherId = 12;
    const expected = {
      customFields: {},
      id: 14,
      issuedDate: null,
      name: 'voucher-0001',
      redemptionDate: null,
      reservationExpiresAt: null,
      reservedExpiresAt: null,
      reward: null,
      state: 'expired',
      userAccount: null,
      validFrom: null,
      validTo: null,
      voucherCode: null,
      voucherExpiresAt: null,
      voucherType: 'code',
    };
    nockVoucher(STATUS_CODE, userToken, voucherId);
    const voucherResult = await client.getVoucher(userToken, voucherId);
    expect(voucherResult.data).toEqual(expected);
  });
  test('should return getVouchers success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const expected = [
      {
        customFields: {},
        id: 11,
        issuedDate: null,
        name: 'voucher-0011',
        redemptionDate: null,
        reservationExpiresAt: null,
        reservedExpiresAt: null,
        reward: null,
        state: 'expired',
        userAccount: null,
        validFrom: null,
        validTo: null,
        voucherCode: null,
        voucherExpiresAt: null,
        voucherType: 'code',
      },
      {
        customFields: {},
        id: 12,
        issuedDate: null,
        name: 'voucher-0012',
        redemptionDate: null,
        reservationExpiresAt: null,
        reservedExpiresAt: null,
        reward: null,
        state: 'expired',
        userAccount: null,
        validFrom: null,
        validTo: null,
        voucherCode: null,
        voucherExpiresAt: null,
        voucherType: 'code',
      },
    ];
    const filter = { page: 1, size: 10 };
    nockVouchers(STATUS_CODE, userToken, filter);
    const rewardResult = await client.getVouchers(userToken, filter);
    expect(rewardResult.data).toEqual(expected);
  });
  test('should return reserveReward success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const rewardId = '13';
    const expected = {
      customFields: {},
      id: 9,
      reservedExpiresAt: null,
      voucherKey: null,
      voucherType: null,
    };
    nockReserveReward(STATUS_CODE, userToken, rewardId);
    const applicationTokenResult = await client.reserveReward(
      userToken,
      rewardId
    );
    expect(applicationTokenResult).toEqual(expected);
  });
  test('should return reserveReward fail', async () => {
    const userToken = 'user-token-0001';
    const rewardId = '289G';
    const expected = `Invalid rewardId: ${rewardId}, expected rewardId as integer`;
    let result;
    try {
      await client.reserveReward(userToken, rewardId);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return releaseRewardReservation success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const reservationId = '12';
    const expected = {
      customFields: {},
      id: 14,
      issuedDate: null,
      name: 'release-0001',
      redemptionDate: null,
      reservationExpiresAt: null,
      reservedExpiresAt: null,
      reward: null,
      state: 'expired',
      userAccount: null,
      validFrom: null,
      validTo: null,
      voucherCode: null,
      voucherExpiresAt: null,
      voucherType: 'code',
    };
    nockReleaseRewardReservation(STATUS_CODE, userToken, reservationId);
    const voucherResult = await client.releaseRewardReservation(
      userToken,
      reservationId
    );
    expect(voucherResult).toEqual(expected);
  });
  test('should return releaseRewardReservation fail', async () => {
    const userToken = 'user-token-0001';
    const rewardId = '300S';
    const expected = `Invalid reservationId: ${rewardId}, expected reservationId as integer`;
    let result;
    try {
      await client.releaseRewardReservation(userToken, rewardId);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return confirmRewardReservation success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const reservationId = '12';
    nockConfirmRewardReservation(STATUS_CODE, userToken, reservationId);
    const expected = {
      customFields: {},
      id: 15,
      issuedDate: null,
      name: 'confirm-0001',
      redemptionDate: null,
      reservationExpiresAt: null,
      reservedExpiresAt: null,
      reward: null,
      state: 'expired',
      userAccount: null,
      validFrom: null,
      validTo: null,
      voucherCode: null,
      voucherExpiresAt: null,
      voucherType: 'code',
    };
    const voucherResult = await client.confirmRewardReservation(
      userToken,
      reservationId
    );
    expect(voucherResult).toEqual(expected);
  });
  test('should return confirmRewardReservation fail', async () => {
    const userToken = 'user-token-0001';
    const rewardId = '300S';
    const expected = `Invalid reservationId: ${rewardId}, expected reservationId as integer`;
    let result;
    try {
      await client.confirmRewardReservation(userToken, rewardId);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return redeemVoucher success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const voucherId = '12';
    const isConfirm = true;
    const expected = [
      {
        customFields: {},
        id: 16,
        issuedDate: null,
        name: 'redeem-0016',
        redemptionDate: null,
        reservationExpiresAt: null,
        reservedExpiresAt: null,
        reward: null,
        state: 'expired',
        userAccount: null,
        validFrom: null,
        validTo: null,
        voucherCode: null,
        voucherExpiresAt: null,
        voucherType: 'code',
      },
      {
        customFields: {},
        id: 17,
        issuedDate: null,
        name: 'redeem-0017',
        redemptionDate: null,
        reservationExpiresAt: null,
        reservedExpiresAt: null,
        reward: null,
        state: 'expired',
        userAccount: null,
        validFrom: null,
        validTo: null,
        voucherCode: null,
        voucherExpiresAt: null,
        voucherType: 'code',
      },
    ];
    nockRedeemVoucher(STATUS_CODE, userToken, voucherId, {
      confirm: isConfirm,
    });
    const voucherResult = await client.redeemVoucher(
      userToken,
      voucherId,
      isConfirm
    );
    expect(voucherResult).toEqual(expected);
  });
  test('should return redeemVoucher fail', async () => {
    const userToken = 'user-token-0001';
    const rewardId = '60U';
    const expected = `Invalid voucherId: ${rewardId}, expected voucherId as integer`;
    let result;
    try {
      await client.redeemVoucher(userToken, rewardId);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return posReleaseReservedVoucher success', async () => {
    const STATUS_CODE = 200;
    const applicationToken = 'application-token-0001';
    const voucherId = '12';
    const expected = {
      customFields: {},
      id: 15,
      issuedDate: null,
      name: 'revert_redemption-0001',
      redemptionDate: null,
      reservationExpiresAt: null,
      reservedExpiresAt: null,
      reward: null,
      state: 'expired',
      userAccount: null,
      validFrom: null,
      validTo: null,
      voucherCode: null,
      voucherExpiresAt: null,
      voucherType: 'code',
    };
    nockPosReleaseReservedVoucher(STATUS_CODE, applicationToken, voucherId);
    const voucherResult = await client.posReleaseReservedVoucher(
      applicationToken,
      voucherId
    );
    expect(voucherResult).toEqual(expected);
  });
  test('should return posReleaseReservedVoucher fail', async () => {
    const applicationToken = 'application-token-0001';
    const voucherId = '20U';
    const expected = `Invalid voucherId: ${voucherId}, expected voucherId as integer`;
    let result;
    try {
      await client.posReleaseReservedVoucher(applicationToken, voucherId);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return performCustomTrigger void function', async () => {
    const STATUS_CODE = 400;
    const applicationToken = 'application-token-0001';
    const voucherId = '12';
    const expected = undefined;
    nockPerformCustomTrigger(STATUS_CODE, applicationToken, voucherId);
    const voucherResult = await client.performCustomTrigger(
      applicationToken,
      voucherId
    );
    expect(voucherResult).toEqual(expected);
  });
  test('should return getLoyaltyProgram success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const loyaltyProgramId = '12';
    const expected = {
      agingPoints: [],
      currentMembershipTierId: null,
      currentMembershipTierName: null,
      id: 15,
      membershipExpiryYYYYMMDD: null,
      membershipState: 'inactive',
      name: 'revert_redemption-0001',
      pointBalance: 0,
      pointBalances: [],
      pointsHistory: [],
      redemptionInProgressBalance: 0,
      tierPoints: 0,
      tiers: [],
    };
    nockLoyaltyProgram(STATUS_CODE, userToken, loyaltyProgramId);
    const voucherResult = await client.getLoyaltyProgram(
      userToken,
      loyaltyProgramId
    );
    expect(voucherResult).toEqual(expected);
  });
  test('should return getLoyaltyProgram fail', async () => {
    const userToken = 'user-token-0001';
    const loyaltyProgramId = '60U';
    const expected = `Invalid loyaltyProgramId: ${loyaltyProgramId}, expected loyaltyProgramId as integer`;
    let result;
    try {
      await client.getLoyaltyProgram(userToken, loyaltyProgramId);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return getLoyaltyPrograms success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const expected = [
      {
        agingPoints: [],
        currentMembershipTierId: null,
        currentMembershipTierName: null,
        id: 11,
        membershipExpiryYYYYMMDD: null,
        membershipState: 'inactive',
        name: 'voucher-0011',
        pointBalance: 0,
        pointBalances: [],
        pointsHistory: [],
        redemptionInProgressBalance: 0,
        tierPoints: 0,
        tiers: [],
      },
      {
        agingPoints: [],
        currentMembershipTierId: null,
        currentMembershipTierName: null,
        id: 12,
        membershipExpiryYYYYMMDD: null,
        membershipState: 'inactive',
        name: 'voucher-0012',
        pointBalance: 0,
        pointBalances: [],
        pointsHistory: [],
        redemptionInProgressBalance: 0,
        tierPoints: 0,
        tiers: [],
      },
    ];
    nockLoyaltyPrograms(STATUS_CODE, userToken);
    const voucherResult = await client.getLoyaltyPrograms(userToken);
    expect(voucherResult).toEqual(expected);
  });
  test('should return getLoyaltyTransactions success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const loyaltyProgramId = 'loyaltyProgramId-0001';
    const page = 2;
    const size = 50;
    const expected = {
      data: [
        {
          agingPoints: [],
          currentMembershipTierId: null,
          currentMembershipTierName: null,
          id: 11,
          membershipExpiryYYYYMMDD: null,
          membershipState: 'inactive',
          name: 'voucher-0011',
          pointBalance: 0,
          pointBalances: [],
          pointsHistory: [],
          redemptionInProgressBalance: 0,
          tierPoints: 0,
          tiers: [],
        },
        {
          agingPoints: [],
          currentMembershipTierId: null,
          currentMembershipTierName: null,
          id: 12,
          membershipExpiryYYYYMMDD: null,
          membershipState: 'inactive',
          name: 'voucher-0012',
          pointBalance: 0,
          pointBalances: [],
          pointsHistory: [],
          redemptionInProgressBalance: 0,
          tierPoints: 0,
          tiers: [],
        },
      ],
    };
    nockLoyaltyTransactions(
      STATUS_CODE,
      userToken,
      loyaltyProgramId,
      page,
      size
    );
    const voucherResult = await client.getLoyaltyTransactions(
      userToken,
      loyaltyProgramId,
      page,
      size
    );
    expect(voucherResult).toEqual(expected);
  });
  test('should return getMe success', async () => {
    const STATUS_CODE = 200;
    const userToken = 'user-token-0001';
    const expected = [
      {
        birthdayYYYYMMDD: null,
        email: null,
        firstName: null,
        gender: null,
        id: 11,
        identifier: null,
        joinedAt: null,
        lastName: null,
        middleName: null,
        passwordExpiresAt: null,
        phone: null,
        state: 'inactive',
      },
      {
        birthdayYYYYMMDD: null,
        email: null,
        firstName: null,
        gender: null,
        id: 12,
        identifier: null,
        joinedAt: null,
        lastName: null,
        middleName: null,
        passwordExpiresAt: null,
        phone: null,
        state: 'inactive',
      },
    ];
    nockCustomer(STATUS_CODE, userToken);
    const voucherResult = await client.getMe(userToken);
    expect(voucherResult).toEqual(expected);
  });
  test('should return getCustomer fail', async () => {
    const userToken = 'user-token-0001';
    const customerId = '60U';
    const expected = `Invalid customerId: ${customerId}, expected customer as integer`;
    let result;
    try {
      await client.getCustomer(userToken, customerId);
    } catch (error) {
      result = error as PerxError;
    }
    expect(result?.message).toEqual(expected);
  });
  test('should return submitTransaction success', async () => {
    const STATUS_CODE = 200;
    const applicationToken = 'application-token-0001';
    const nowDate = new Date();
    const transactionData: PerxTransactionReqeust = {
      userAccountId: 'user-account-0001',
      transactionData: {
        transactionType: 'purchase',
        transactionReference: 'transaction-ref-0001',
        amount: 1530,
        currency: 'THB',
        transactionDate: nowDate,
        properties: {},
      },
    };
    const expected = [
      {
        amount: 1530,
        id: 10,
        merchantUserAccountId: null,
        pointsEarned: 123,
        properties: {},
        transactionReference: 'transaction-ref-0001',
        transactionType: 'purchase',
        userAccountId: 'user-account-0001',
      },
    ];
    nockSubmitTransaction(STATUS_CODE, applicationToken);
    const transactionResult = await client.submitTransaction(
      applicationToken,
      transactionData
    );
    expect(transactionResult).toEqual(expected);
  });
  test('should return submitLoyaltyTransaction success', async () => {
    const STATUS_CODE = 200;
    const applicationToken = 'application-token-0001';
    const nowDate = new Date().toISOString();
    const perxId = 123;
    const userIdentification: PerxIdentification = {
      type: 'id',
      id: +perxId,
    };
    const loyaltyProgramPoint = 2;
    const createTransaction = PerxLoyaltyTransactionRequest.makeBurnRequest(
      userIdentification,
      loyaltyProgramPoint,
      213,
      'transaction-ref-0001',
      {
        merchant_id: 'merchant_id-0001',
        merchant_identifier: 'merchant_identifier-0001',
        transaction_reference: 'transaction_reference-0001',
        merchant_tags: 'merchant_tags-0001',
        merchant_name: 'storeId-0001',
        transaction_type: 'purchase',
        receipt_date: nowDate,
        reason: 'revert_earn',
        trans_id: 'trans_id-0001',
        source: 'SUPER_APP',
        user_created: 'SUPER_APP',
        original_receipt_number: 'original_receipt_number-0001',
      }
    ).withTransactionType('purchase');

    const expected = [
      { id: 33, loyaltyProgramId: 213, points: 44, properties: {} },
    ];
    nockSubmitLoyaltyTransactions(STATUS_CODE, applicationToken);
    const transactionResult = await client.submitLoyaltyTransaction(
      applicationToken,
      createTransaction
    );
    expect(transactionResult).toEqual(expected);
  });
  test('should return reserveLoyaltyPoints success', async () => {
    const STATUS_CODE = 200;
    const applicationToken = 'application-token-0001';
    const dateNow = new Date();
    const perxId = 123;
    const userIdentification: PerxIdentification = {
      type: 'id',
      id: +perxId,
    };
    const loyaltyProgramPoint = 2;
    const createTransaction = PerxLoyaltyTransactionRequest.makeBurnRequest(
      userIdentification,
      loyaltyProgramPoint,
      213,
      'transaction-ref-0001',
      {
        amount_to_deduct: 1231,
        loyalty_program_id: 2,
      }
    ).withTransactionType('purchase');

    const expected = [
      {
        id: 322,
        loyaltyProgramId: 567,
        points: 500,
        properties: {},
        transactedAt: dateNow,
      },
    ];
    nockReserveLoyaltyPoints(STATUS_CODE, applicationToken, dateNow);
    const transactionResult = await client.reserveLoyaltyPoints(
      applicationToken,
      createTransaction
    );
    expect(transactionResult).toEqual(expected);
  });
  test('should return releaseLoyaltyPoints success return true', async () => {
    const STATUS_CODE = 200;
    const applicationToken = 'application-token-0001';
    const perxId = 123;
    const userIdentification: PerxIdentification = {
      type: 'id',
      id: +perxId,
    };
    const transactionId = 'transaction-id-0001';
    const expected = true;
    nockReleaseLoyaltyPoints(STATUS_CODE, applicationToken, transactionId);
    const transactionResult = await client.releaseLoyaltyPoints(
      applicationToken,
      userIdentification,
      transactionId
    );
    expect(transactionResult).toEqual(expected);
  });
});
