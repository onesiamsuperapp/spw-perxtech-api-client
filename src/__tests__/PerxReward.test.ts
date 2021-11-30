import { Deserialize } from 'cerialize'
import { makePolicy, ComparePolicy } from './utils/compare'
import { PerxCategory, PerxReward, PerxRewardInventory, PerxRewardLoyaltyScope } from '..'
import { get } from 'lodash'

const _fixture = {
  withLoyaltyConstraints: {
    "id": 205,
    "alt_merchant_name": null,
    "alt_merchant_text": null,
    "alt_merchant_website": null,
    "brands": [],
    "category_tags": [
      {
        "id": 86,
        "parent": {
          "id": 82,
          "usage": [
            "Rewards",
            "Catalogs"
          ],
          "parent_id": null,
          "created_at": "2021-09-14T05:56:58.835Z",
          "updated_at": "2021-09-14T06:15:18.380Z",
          "title": "Promotion_type",
          "description": "Promotion_type"
        },
        "title": "Creditcard_promotion",
        "title_en": "Creditcard_promotion",
        "title_th": null,
        "title_vi": null,
        "title_zh": null,
        "title_zh_hans": null,
        "title_zh_hant": null
      }
    ],
    "custom_fields": {
      "discount_value": "100",
      "minimum_spending": "10000"
    },
    "description": "<p>VISA Card discount 100 THB for minimum spending 10000</p>",
    "ecommerce_only": null,
    "eligible": true,
    "favourite": null,
    "images": [],
    "is_giftable": true,
    "merchant_id": null,
    "merchant_logo_url": null,
    "merchant_name": null,
    "merchant_properties": {},
    "merchant_website": null,
    "name": "VISA100",
    "operating_hour": null,
    "operating_now": true,
    "redemption_url": null,
    "reward_price": [],
    "selling_from": "2020-09-01T18:51:00.000Z",
    "selling_to": "2021-10-31T16:59:00.000Z",
    "social_handlers": {
        "facebook": null,
        "twitter": null
    },
    "steps_to_redeem": "",
    "subtitle": "VISA Card discount 100 THB for minimum spending 10000",
    "tags": [
        {
            "description": "Online",
            "id": 112,
            "name": "online"
        },
        {
            "description": "Voucher Type: Discount",
            "id": 111,
            "name": "discount_voucher"
        }
    ],
    "terms_and_conditions": "",
    "voucher_type": "code",
    "distance": {
        "value": null,
        "unit_of_measure": "meter"
    },
    "inventory": {
        "minutes_per_period": null,
        "minutes_per_user_per_period": null,
        "minutes_per_user_period": null,
        "per_user_period_start": null,
        "period_start": null,
        "reward_limit_per_period": null,
        "reward_limit_per_period_balance": null,
        "reward_limit_per_user": 1,
        "reward_limit_per_user_balance": {
            "available_amount": 1,
            "limit_error_klass": null,
            "limit_type": "account_lifetime"
        },
        "reward_limit_per_user_per_period": null,
        "reward_limit_per_user_per_period_balance": null,
        "reward_limit_per_user_period_balance": null,
        "reward_total_balance": 10000,
        "reward_total_limit": 10000
    },
    "is_favorite": false,
    "loyalty": [
        {
            "attained": true,
            "loyalty_id": 1,
            "loyalty_name": "White",
            "loyalty_points_required_for_redemption": null,
            "sneak_peek": false
        },
        {
            "attained": false,
            "loyalty_id": 2,
            "loyalty_name": "Titanium",
            "loyalty_points_required_for_redemption": null,
            "sneak_peek": false
        },
        {
            "attained": false,
            "loyalty_id": 3,
            "loyalty_name": "Black",
            "loyalty_points_required_for_redemption": null,
            "sneak_peek": false
        }
    ],
    "valid_from": "2021-09-15T04:51:35.000Z",
    "valid_to": "2021-10-31T16:59:00Z"
  },
  certainTierOnly: {
    "id": 220,
    "alt_merchant_name": null,
    "alt_merchant_text": null,
    "alt_merchant_website": null,
    "brands": [
      {
        "id": 1,
        "name": "Adidas"
      }
    ],
    "category_tags": [
      {
        "id": 83,
        "parent": {
          "id": 82,
          "usage": [
            "Rewards",
            "Catalogs"
          ],
          "parent_id": null,
          "created_at": "2021-09-14T05:56:58.835Z",
          "updated_at": "2021-09-14T06:15:18.380Z",
          "title": "Promotion_type",
          "description": "Promotion_type"
        },
        "title": "Tenant_promotion",
        "title_en": "Tenant_promotion",
        "title_th": null,
        "title_vi": null,
        "title_zh": null,
        "title_zh_hans": null,
          "title_zh_hant": null
      },
      {
        "id": 82,
        "parent": null,
        "title": "Promotion_type",
        "title_en": "Promotion_type",
        "title_th": null,
        "title_vi": null,
        "title_zh": null,
        "title_zh_hans": null,
        "title_zh_hant": null
      }
    ],
    "custom_fields": {
      "discount_value": "100",
      "minimum_spending": "10000"
    },
    "description": "<p>Description</p>",
    "ecommerce_only": null,
    "eligible": true,
    "favourite": null,
    "images": [],
    "is_giftable": true,
    "merchant_id": null,
    "merchant_logo_url": null,
    "merchant_name": null,
    "merchant_properties": {},
    "merchant_website": null,
    "name": "Ti 300 > 30% off",
    "operating_hour": null,
    "operating_now": true,
    "redemption_url": null,
    "reward_price": [
      {
        "id": 160,
        "currency_code": "THB",
        "identifier": null,
        "loyalty_program_id": 2,
        "points": 300,
        "price": null,
        "reward_amount": "0.0",
        "reward_currency": "THB"
      }
    ],
    "selling_from": "2021-09-18T14:20:30.000Z",
    "selling_to": "2021-09-30T00:00:00.000Z",
    "social_handlers": {
      "facebook": null,
      "twitter": null
    },
    "steps_to_redeem": "<p>Steps to Redeem</p>",
    "subtitle": "Test promotion by TF",
    "tags": [
      {
        "description": "Online",
        "id": 112,
        "name": "online"
      }
    ],
    "terms_and_conditions": "<p>T&amp;C</p>",
    "voucher_type": "code",
    "distance": {
        "value": null,
        "unit_of_measure": "meter"
    },
    "inventory": {
        "minutes_per_period": null,
        "minutes_per_user_per_period": null,
        "minutes_per_user_period": null,
        "per_user_period_start": null,
        "period_start": null,
        "reward_limit_per_period": null,
        "reward_limit_per_period_balance": null,
        "reward_limit_per_user": 299,
        "reward_limit_per_user_balance": {
          "available_amount": 299,
          "limit_error_klass": null,
          "limit_type": "account_lifetime"
        },
        "reward_limit_per_user_per_period": null,
        "reward_limit_per_user_per_period_balance": null,
        "reward_limit_per_user_period_balance": null,
        "reward_total_balance": 5000,
        "reward_total_limit": 5000
    },
    "is_favorite": false,
    "loyalty": [
      {
        "attained": true,
        "loyalty_id": 2,
        "loyalty_name": "Titanium",
        "loyalty_points_required_for_redemption": null,
        "sneak_peek": false
      }
    ],
    "valid_from": "2021-09-17T16:00:00.000Z",
    "valid_to": "2021-11-07T15:59:59Z"
  },
}

describe('Perx Reward', () => {
  it.each`
    name                                | fixtureData
    ${'with loyalty constraint'}        | ${_fixture.withLoyaltyConstraints}
    ${'with locked tier'}               | ${_fixture.certainTierOnly}
  `('can deserialized $name from JSON', ({ fixtureData }) => {
    const o: PerxReward = Deserialize(fixtureData, PerxReward)

    expect(o).toBeInstanceOf(PerxReward)
    expect(o.categoryTags).toBeInstanceOf(Array)
    expect(o.categoryTags.every((o) => o instanceof PerxCategory)).toBeTruthy()
    expect(o.loyalty).toBeTruthy()
    expect(o.loyalty.every((o) => o instanceof PerxRewardLoyaltyScope)).toBeTruthy()

    const policy = makePolicy(o, fixtureData)
    let fieldCompare: Array<[keyof typeof _fixture.withLoyaltyConstraints, ComparePolicy]> = [
      ['id', policy.equal],
      ['custom_fields', policy.equal],
      ['valid_to', policy.isoDate],
      ['valid_from', policy.isoDate],
      ['name', policy.equal],
      ['eligible', policy.equal],
      ['category_tags', policy.array([
        ['id', policy.equal],
        ['title', policy.equal],
      ])],
      ['tags', policy.array([
        ['id', policy.equal],
        ['name', policy.equal],
      ])],
      ['loyalty', policy.array([
        ['attained', policy.equal],
        ['loyalty_id', policy.equal],
        ['loyalty_name', policy.equal],
        ['loyalty_program_id', policy.equal],
        ['loyalty_points_required_for_redemption', policy.equal],
        ['sneak_peek', policy.equal],
      ])]
    ]
    for (const f of fieldCompare) {
      const fieldName = f[0]
      const policyComparer = f[1]
      policyComparer(fieldName)
    }
  })
})

const _inventoryFixture = {
  'NoLimit': {
    "minutes_per_period": null,
    "minutes_per_user_per_period": null,
    "minutes_per_user_period": null,
    "per_user_period_start": null,
    "period_start": null,
    "reward_limit_per_period": null,
    "reward_limit_per_period_balance": null,
    "reward_limit_per_user": null,
    "reward_limit_per_user_balance": null,
    "reward_limit_per_user_per_period": null,
    "reward_limit_per_user_per_period_balance": null,
    "reward_limit_per_user_period_balance": null,
    "reward_total_balance": null,
    "reward_total_limit": null
  },
  '5total': {
    'NoPeriodLimit': {
      'NoLimit': {
        'NoClaimed': {
          "minutes_per_period": null,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": null,
          "per_user_period_start": null,
          "period_start": null,
          "reward_limit_per_period": null,
          "reward_limit_per_period_balance": null,
          "reward_limit_per_user": null,
          "reward_limit_per_user_balance": null,
          "reward_limit_per_user_per_period": null,
          "reward_limit_per_user_per_period_balance": null,
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 5,
          "reward_total_limit": 5
        },
        'SelfClaimed': {
          "minutes_per_period": null,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": null,
          "per_user_period_start": null,
          "period_start": null,
          "reward_limit_per_period": null,
          "reward_limit_per_period_balance": null,
          "reward_limit_per_user": null,
          "reward_limit_per_user_balance": null,
          "reward_limit_per_user_per_period": null,
          "reward_limit_per_user_per_period_balance": null,
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        },
        'SomeoneClaimed': {
          "minutes_per_period": null,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": null,
          "per_user_period_start": null,
          "period_start": null,
          "reward_limit_per_period": null,
          "reward_limit_per_period_balance": null,
          "reward_limit_per_user": null,
          "reward_limit_per_user_balance": null,
          "reward_limit_per_user_per_period": null,
          "reward_limit_per_user_per_period_balance": null,
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        },
      },
      '1perUser': {
        'NoClaimed': {
          "minutes_per_period": null,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": null,
          "per_user_period_start": null,
          "period_start": null,
          "reward_limit_per_period": null,
          "reward_limit_per_period_balance": null,
          "reward_limit_per_user": 1,
          "reward_limit_per_user_balance": {
              "available_amount": 1,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": null,
          "reward_limit_per_user_per_period_balance": null,
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 5,
          "reward_total_limit": 5
        },
        'SomeoneClaimed': {
          "minutes_per_period": null,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": null,
          "per_user_period_start": null,
          "period_start": null,
          "reward_limit_per_period": null,
          "reward_limit_per_period_balance": null,
          "reward_limit_per_user": 1,
          "reward_limit_per_user_balance": {
              "available_amount": 1,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": null,
          "reward_limit_per_user_per_period_balance": null,
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        },
        'SelfClaimed': {
          "minutes_per_period": null,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": null,
          "per_user_period_start": null,
          "period_start": null,
          "reward_limit_per_period": null,
          "reward_limit_per_period_balance": null,
          "reward_limit_per_user": 1,
          "reward_limit_per_user_balance": {
              "available_amount": 0,
              "limit_error_klass": {
                  "code": 4103,
                  "message": "No rewards available for the specified user due to account lifetime limit"
              },
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": null,
          "reward_limit_per_user_per_period_balance": null,
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        }
      },
      '2perUser1perDay': {
        'NoClaimed': {
          "minutes_per_period": null,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": 1440,
          "per_user_period_start": "2021-09-23T16:00:00Z",
          "period_start": null,
          "reward_limit_per_period": null,
          "reward_limit_per_period_balance": null,
          "reward_limit_per_user": 2,
          "reward_limit_per_user_balance": {
              "available_amount": 2,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": 1,
          "reward_limit_per_user_per_period_balance": {
              "limit_type": "account_interval",
              "available_amount": 1,
              "limit_error_klass": null
          },
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 5,
          "reward_total_limit": 5
        },
        'SelfClaimed': {
          "minutes_per_period": null,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": 1440,
          "per_user_period_start": "2021-09-23T16:00:00Z",
          "period_start": null,
          "reward_limit_per_period": null,
          "reward_limit_per_period_balance": null,
          "reward_limit_per_user": 2,
          "reward_limit_per_user_balance": {
              "available_amount": 1,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": 1,
          "reward_limit_per_user_per_period_balance": {
              "limit_type": "account_interval",
              "available_amount": 0,
              "limit_error_klass": {
                  "code": 4103,
                  "message": "No rewards available for the specified user due to account interval limit"
              }
          },
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        },
        'SomeoneClaimed': {
          "minutes_per_period": null,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": 1440,
          "per_user_period_start": "2021-09-23T16:00:00Z",
          "period_start": null,
          "reward_limit_per_period": null,
          "reward_limit_per_period_balance": null,
          "reward_limit_per_user": 2,
          "reward_limit_per_user_balance": {
              "available_amount": 2,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": 1,
          "reward_limit_per_user_per_period_balance": {
              "limit_type": "account_interval",
              "available_amount": 1,
              "limit_error_klass": null
          },
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        }
      }
    },
    '2perDay': {
      '1perUser': {
        'NoClaimed': {
          "minutes_per_period": 1440,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": null,
          "per_user_period_start": null,
          "period_start": "2021-09-23T16:00:00Z",
          "reward_limit_per_period": 2,
          "reward_limit_per_period_balance": 2,
          "reward_limit_per_user": 1,
          "reward_limit_per_user_balance": {
              "available_amount": 1,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": null,
          "reward_limit_per_user_per_period_balance": null,
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 5,
          "reward_total_limit": 5
        },
        'SelfClaimed': {
          "minutes_per_period": 1440,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": null,
          "per_user_period_start": null,
          "period_start": "2021-09-23T16:00:00Z",
          "reward_limit_per_period": 2,
          "reward_limit_per_period_balance": 1,
          "reward_limit_per_user": 1,
          "reward_limit_per_user_balance": {
            "available_amount": 0,
            "limit_error_klass": {
              "code": 4103,
              "message": "No rewards available for the specified user due to account lifetime limit"
            },
            "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": null,
          "reward_limit_per_user_per_period_balance": null,
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        },
        'SomeoneClaimed': {
          "minutes_per_period": 1440,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": null,
          "per_user_period_start": null,
          "period_start": "2021-09-23T16:00:00Z",
          "reward_limit_per_period": 2,
          "reward_limit_per_period_balance": 1,
          "reward_limit_per_user": 1,
          "reward_limit_per_user_balance": {
              "available_amount": 1,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": null,
          "reward_limit_per_user_per_period_balance": null,
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        }
      },
      '2perUser1perDay': {
        'NoClaimed': {
          "minutes_per_period": 1440,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": 1440,
          "per_user_period_start": "2021-09-23T16:00:00Z",
          "period_start": "2021-09-23T16:00:00Z",
          "reward_limit_per_period": 2,
          "reward_limit_per_period_balance": 2,
          "reward_limit_per_user": 2,
          "reward_limit_per_user_balance": {
              "available_amount": 2,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": 1,
          "reward_limit_per_user_per_period_balance": {
              "limit_type": "account_interval",
              "available_amount": 1,
              "limit_error_klass": null
          },
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 5,
          "reward_total_limit": 5
        },
        'SelfClaimed': {
          "minutes_per_period": 1440,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": 1440,
          "per_user_period_start": "2021-09-23T16:00:00Z",
          "period_start": "2021-09-23T16:00:00Z",
          "reward_limit_per_period": 2,
          "reward_limit_per_period_balance": 1,
          "reward_limit_per_user": 2,
          "reward_limit_per_user_balance": {
              "available_amount": 1,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": 1,
          "reward_limit_per_user_per_period_balance": {
              "limit_type": "account_interval",
              "available_amount": 0,
              "limit_error_klass": {
                  "code": 4103,
                  "message": "No rewards available for the specified user due to account interval limit"
              }
          },
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        },
        'SomeoneClaimed': {
          "minutes_per_period": 1440,
          "minutes_per_user_per_period": null,
          "minutes_per_user_period": 1440,
          "per_user_period_start": "2021-09-23T16:00:00Z",
          "period_start": "2021-09-23T16:00:00Z",
          "reward_limit_per_period": 2,
          "reward_limit_per_period_balance": 1,
          "reward_limit_per_user": 2,
          "reward_limit_per_user_balance": {
              "available_amount": 2,
              "limit_error_klass": null,
              "limit_type": "account_lifetime"
          },
          "reward_limit_per_user_per_period": 1,
          "reward_limit_per_user_per_period_balance": {
              "limit_type": "account_interval",
              "available_amount": 1,
              "limit_error_klass": null
          },
          "reward_limit_per_user_period_balance": null,
          "reward_total_balance": 4,
          "reward_total_limit": 5
        }
      }
    }
  }
}

describe('Perx Reward\'s inventory', () => {
  it.each`
    fixtureKey 
    ${'NoLimit'}
    ${'5total.NoPeriodLimit.NoLimit.NoClaimed'} 
    ${'5total.NoPeriodLimit.NoLimit.SelfClaimed'} 
    ${'5total.NoPeriodLimit.NoLimit.SomeoneClaimed'} 
    ${'5total.NoPeriodLimit.1perUser.NoClaimed'} 
    ${'5total.NoPeriodLimit.1perUser.SelfClaimed'} 
    ${'5total.NoPeriodLimit.1perUser.SomeoneClaimed'} 
    ${'5total.NoPeriodLimit.2perUser1perDay.NoClaimed'} 
    ${'5total.NoPeriodLimit.2perUser1perDay.SelfClaimed'} 
    ${'5total.NoPeriodLimit.2perUser1perDay.SomeoneClaimed'} 
    ${'5total.2perDay.1perUser.NoClaimed'} 
    ${'5total.2perDay.1perUser.SelfClaimed'} 
    ${'5total.2perDay.1perUser.SomeoneClaimed'}
    ${'5total.2perDay.2perUser1perDay.NoClaimed'} 
    ${'5total.2perDay.2perUser1perDay.SelfClaimed'} 
    ${'5total.2perDay.2perUser1perDay.SomeoneClaimed'}
  `('can deserialized $fixtureKey from JSON', ({ fixtureKey }) => {
    const fixtureData = get(_inventoryFixture, fixtureKey)
    const o: PerxRewardInventory = Deserialize(fixtureData, PerxRewardInventory)

    expect(o).toBeInstanceOf(PerxRewardInventory)

    const policy = makePolicy(o, fixtureData)
    let fieldCompare: Array<[string, ComparePolicy]> = [
      ['minutes_per_user_period', policy.equal],
      ['minutes_per_period', policy.equal],
      ['per_user_period_start', policy.isoDate],
      ['period_start', policy.isoDate],
      ['reward_limit_per_period', policy.equal],
      ['reward_limit_per_period_balance', policy.equal],
      ['reward_limit_per_user', policy.equal],
      ['reward_limit_per_user_per_period', policy.equal],
      ['reward_total_balance', policy.equal],
      ['reward_total_limit', policy.equal],
    ]

    const balanceFields = [
      'reward_limit_per_period_balance',
      'reward_limit_per_user_balance',
      'reward_limit_per_user_per_period_balance',
    ]

    for (const key of balanceFields) {
      if (fixtureData[key]) {
        const nestedPolicy: [string, ComparePolicy][] = [
          ['available_amount', policy.equal],
          ['limit_type', policy.equal],
        ]

        if (fixtureData[key]['limit_error_klass']) {
          nestedPolicy.push(
            ['limit_error_klass', policy.nested([
              ['code', policy.equal],
              ['message', policy.equal]
            ])]
          )
        }
        fieldCompare.push([key, policy.nested(nestedPolicy)])
      }
    }
    // if (fixtureData.)
    for (const f of fieldCompare) {
      const fieldName = f[0]
      const policyComparer = f[1]
      policyComparer(fieldName)
    }
  })
})