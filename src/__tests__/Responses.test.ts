import { Deserialize } from 'cerialize'
import { makePolicy, ComparePolicy } from './utils/compare'
import { PerxPagingMeta } from '..'

const _fixture = {
  lastPage: {
    "size": 3,
    "page": 2,
    "current_page": 2,
    "per_page": 25,
    "prev_page": 1,
    "next_page": null,
    "total_count": 28,
    "count": 28,
    "total_pages": 2
  },
  firstPage: {
    "size": 25,
    "page": 1,
    "current_page": 1,
    "per_page": 25,
    "prev_page": null,
    "next_page": 2,
    "total_count": 28,
    "count": 28,
    "total_pages": 2
  }
}

describe('Perx Response', () => {
  describe('Paging Meta', () => {
    it.each`
      name                      | fixtureData
      ${'last page'}            | ${_fixture.lastPage}
      ${'first page'}           | ${_fixture.firstPage}
    `('can deserialized $name from JSON', ({ name, fixtureData }) => {
      const o: PerxPagingMeta = Deserialize(fixtureData, PerxPagingMeta)

      expect(o).toBeInstanceOf(PerxPagingMeta)

      const policy = makePolicy(o, fixtureData)
      const fieldCompare: Array<[string, ComparePolicy]> = [
        ['size', policy.equal],
        ['page', policy.equal],
        ['current_page', policy.equal],
        ['per_page', policy.equal],
        ['prev_page', policy.equal],
        ['next_page', policy.equal],
        ['total_count', policy.equal],
        ['count', policy.equal],
        ['total_pages', policy.equal],
      ]
      for (const f of fieldCompare) {
        const fieldName = f[0]
        const policyComparer = f[1]
        policyComparer(fieldName)
      }
    })
  })
})