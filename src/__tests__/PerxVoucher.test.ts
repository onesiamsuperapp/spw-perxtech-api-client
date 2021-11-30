import { Deserialize } from 'cerialize'
import { makePolicy, ComparePolicy } from './utils/compare'
import { PerxReward, PerxVoucher } from '..'

const _fixture = {
  withReward: {
    "id": 21,
    "custom_fields": {
        "source": {
            "type": "dashboard",
            "devise_user_id": 4280
        },
        "reward_price": {}
    },
    "given_by": null,
    "given_date": null,
    "given_to": null,
    "issued_date": "2021-08-25T06:31:42.047Z",
    "merchant_location": null,
    "name": "10% discount for Adidas at IconSiam",
    "redemption_date": "2021-08-30T16:11:28.250Z",
    "redemption_location": null,
    "redemption_type": {
        "type": "offline",
        "timer": 0,
        "call_to_action": null
    },
    "reservation_expires_at": null,
    "reserved_expires_at": null,
    "reward": {
        "id": 102,
        "alt_merchant_name": null,
        "alt_merchant_text": null,
        "alt_merchant_website": null,
        "brands": [
            {
                "id": 1,
                "name": "Adidas"
            }
        ],
        "category_tags": [],
        "custom_fields": {},
        "description": null,
        "ecommerce_only": null,
        "eligible": true,
        "favourite": null,
        "images": [],
        "is_giftable": true,
        "merchant_id": 69,
        "merchant_logo_url": "https://cdn.perxtech.io/merchant/account/photo_url/69/adidas-logo-49d5beba90-seeklogo-com-43b4d51e-14c8-49ac-9014-6cd2ffb83541.png",
        "merchant_name": "adidas",
        "merchant_properties": {},
        "merchant_website": null,
        "name": "10% discount for Adidas at IconSiam",
        "operating_hour": null,
        "operating_now": true,
        "redemption_url": null,
        "reward_price": [],
        "selling_from": "2021-08-05T05:34:51.000Z",
        "selling_to": "2021-08-31T00:00:00.000Z",
        "social_handlers": {
            "facebook": null,
            "twitter": null
        },
        "steps_to_redeem": "",
        "subtitle": null,
        "tags": [],
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
            "reward_limit_per_user": null,
            "reward_limit_per_user_balance": null,
            "reward_limit_per_user_per_period": null,
            "reward_limit_per_user_per_period_balance": null,
            "reward_limit_per_user_period_balance": null,
            "reward_total_balance": null,
            "reward_total_limit": null
        },
        "is_favorite": false,
        "loyalty": [],
        "valid_from": "2021-08-05T05:34:51.000Z",
        "valid_to": "2021-08-31T00:00:00Z"
    },
    "state": "redeemed",
    "user_account": {
        "identifier": "66666"
    },
    "valid_from": "2021-08-05T05:34:51.000Z",
    "valid_to": "2021-08-31T00:00:00.000Z",
    "voucher_code": null,
    "voucher_expires_at": "2021-08-31T00:00:00.000Z",
    "voucher_key": null,
    "voucher_type": "code"
  },
}

describe('Perx Voucher', () => {
  it.each`
    name                      | fixtureData
    ${'with reward'}          | ${_fixture.withReward}
  `('can deserialized $name from JSON', ({ fixtureData }) => {
    const o: PerxVoucher = Deserialize(fixtureData, PerxVoucher)

    expect(o).toBeInstanceOf(PerxVoucher)
    if (o.reward) {
      expect(o.reward).toBeInstanceOf(PerxReward)
    }

    const policy = makePolicy(o, fixtureData)
    let fieldCompare: Array<[string, ComparePolicy]> = [
      ['id', policy.equal],
      ['custom_fields', policy.equal],
      ['issued_date', policy.isoDate],
      ['name', policy.equal],
      ['redemption_date', policy.isoDate],
      // ['redemption_type', policy.equal],
      ['state', policy.equal],
      ['user_account', policy.equal],
      ['valid_from', policy.isoDate],
      ['valid_to', policy.isoDate],
      ['voucher_expires_at', policy.isoDate],
      ['reservation_expires_at', policy.equal],
      ['reserved_expires_at', policy.equal],
    ]
    if (o.reward) {
      fieldCompare = fieldCompare.concat([
        ['reward.id', policy.equal],
        ['reward.eligible', policy.equal],
        ['reward.name', policy.equal],
        ['reward.merchant_name', policy.equal],
        ['reawrd.voucher_type', policy.equal],
        // ['reward.inventory', policy.equal], // TODO: need to determine nested comparer
      ])
    }
    for (const f of fieldCompare) {
      const fieldName = f[0]
      const policyComparer = f[1]
      policyComparer(fieldName)
    }
  })
})