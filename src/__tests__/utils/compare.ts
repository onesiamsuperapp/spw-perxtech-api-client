import get from 'lodash/get'

export type ComparePolicy = (k: string) => void

export const makePolicy = <C>(o: C, targetFixture: any, debug = false): Record<string, ComparePolicy> => {
  const toCamel = (snakeKey: string): keyof C => {
    return snakeKey.replace(/_[a-z]/g, (s) => s.replace('_', '').toUpperCase()) as any
  }

  const policy: Record<string, ComparePolicy> = {
    equal: (k: string) => {
      const camelKey = toCamel(k)
      const target = get(o, camelKey)
      const fixtured = get(targetFixture, k)
      if (debug) {
        console.log('k', k, 'vs', camelKey)
      }
      expect(target).toEqual(fixtured)
    },
    isoDate: (k: string) => {
      const camelKey = toCamel(k)
      const target = get(o, camelKey)
      const fixtured = get(targetFixture, k) as string
      if (debug) {
        console.log('k', k, 'vs', camelKey)
      }
      expect(target).toEqual(fixtured && new Date(fixtured) || null)
    },
  }
  return policy
}