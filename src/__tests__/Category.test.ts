import { Deserialize } from 'cerialize'
import { makePolicy, ComparePolicy } from './utils/compare'
import { PerxCategory, PerxTaxonomy } from '../models/Taxonomy'

const _fixture = {
  simple: {
    "id": 113,
    "created_at": "2021-03-11T03:52:11.437Z",
    "description": "All",
    "description_en": "All",
    "description_th": null,
    "parent": null,
    "title": "All",
    "title_en": "All",
    "title_th": null,
    "updated_at": "2021-03-11T03:52:11.437Z",
    "usage": [
      "Rewards"
    ]
  },
  withParent: {
    "id": 4,
    "created_at": "2019-11-19T04:29:55.262Z",
    "description": null,
    "description_en": null,
    "description_th": null,
    "parent": {
      "id": 1,
      "usage": [
        "Rewards",
        "Campaigns",
        "Catalogs"
      ],
      "parent_id": null,
      "created_at": "2019-11-19T04:29:33.871Z",
      "updated_at": "2020-12-17T07:36:43.204Z",
      "title": "Dining",
      "description": "food"
    },
    "title": "Bar",
    "title_en": "Bar",
    "title_th": null,
    "updated_at": "2019-11-19T04:39:11.420Z",
    "usage": [
      "Rewards",
      "Merchants"
    ]
  }
}

describe('Perx Category', () => {
  it.each`
    name                      | fixtureData
    ${'simple'}               | ${_fixture.simple}
    ${'with parent'}          | ${_fixture.withParent}
  `('can deserialized $name from JSON', ({ name, fixtureData }) => {
    const o: PerxCategory = Deserialize(fixtureData, PerxCategory)

    expect(o).toBeInstanceOf(PerxCategory)
    if (o.parent) {
      expect(o.parent).toBeInstanceOf(PerxTaxonomy)
    }

    const policy = makePolicy(o, fixtureData)
    let fieldCompare: Array<[string, ComparePolicy]> = [
      ['id', policy.equal],
      ['created_at', policy.isoDate],
      ['description', policy.equal],
      ['title', policy.equal],
      ['usage', policy.equal],
    ]
    if (o.parent) {
      fieldCompare = fieldCompare.concat([
        ['parent.id', policy.equal],
        ['parent.usage', policy.equal],
        ['parent.title', policy.equal],
        ['parent.description', policy.equal],
        ['parent.created_at', policy.isoDate],
      ])
    }
    for (const f of fieldCompare) {
      const fieldName = f[0]
      const policyComparer = f[1]
      policyComparer(fieldName)
    }
  })
})