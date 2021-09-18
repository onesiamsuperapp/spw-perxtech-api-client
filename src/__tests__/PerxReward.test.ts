import { Deserialize } from 'cerialize'
import { makePolicy, ComparePolicy } from './utils/compare'
import { PerxCategory, PerxReward, PerxRewardLoyaltyScope } from '..'

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

describe('Perx Voucher', () => {
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
        ['loyalty_id', policy.equal],
        ['loyalty_name', policy.equal],
        ['attained', policy.equal],
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