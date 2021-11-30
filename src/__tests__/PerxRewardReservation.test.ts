import { Deserialize } from 'cerialize'
import { makePolicy, ComparePolicy } from './utils/compare'
import { PerxRewardReservation } from '..'

const _fixture = {
  simple: {
    "id": 173,
    "voucher_code": "*****************",
    "voucher_key": null,
    "voucher_type": "code",
    "state": "reserved",
    "custom_fields": {
        "reward_price": {}
    },
    "reserved_expires_at": "2021-09-21T01:42:58.000Z"
  },
}

describe('Perx Reward Reservation', () => {
  it.each`
    name                                | fixtureData
    ${'simple'}                         | ${_fixture.simple}
  `('can deserialized $name from JSON', ({ fixtureData }) => {
    const o: PerxRewardReservation = Deserialize(fixtureData, PerxRewardReservation)

    expect(o).toBeInstanceOf(PerxRewardReservation)
    expect(typeof o.id).toEqual('number')

    const policy = makePolicy(o, fixtureData)
    let fieldCompare: Array<[keyof typeof _fixture.simple, ComparePolicy]> = [
      ['id', policy.equal],
      ['custom_fields', policy.equal],
      ['voucher_code', policy.equal],
      ['voucher_key', policy.equal],
      ['voucher_type', policy.equal],
      ['state', policy.equal],
      ['reserved_expires_at', policy.isoDate],
    ]
    for (const f of fieldCompare) {
      const fieldName = f[0]
      const policyComparer = f[1]
      policyComparer(fieldName)
    }
  })
})