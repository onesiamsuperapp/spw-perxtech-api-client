import get from 'lodash/get'

export type ComparePolicy = (k: string) => void

export interface ComparePolicyMaker {
  equal: ComparePolicy
  isoDate: ComparePolicy
  nested(config: [string, ComparePolicy][]): ComparePolicy
  array(config: [string, ComparePolicy][]): ComparePolicy
}

export const makePolicy = <C>(o: C, targetFixture: any, debug = false): ComparePolicyMaker => {
  const toCamel = (snakeKey: string): keyof C => {
    return snakeKey.replace(/_[a-z]/g, (s) => s.replace('_', '').toUpperCase()) as any
  }

  const policy = {
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
    nested: (nested: [string, ComparePolicy][]): ComparePolicy => (prefix: string) => {
      const camelKey = toCamel(prefix)
      const target = get(o, camelKey)
      const fixtured = get(targetFixture, prefix)

      if (!fixtured && !target) {
        return
      }

      if ((!fixtured && target) || (fixtured && !target)) {
        throw new Error('failed to compare nested items fixture and target trutiness not sync.')
      }

      for (const f of nested) {
        const fieldName = `${prefix}.${f[0]}`
        const policyComparer = f[1]
        policyComparer(fieldName)
      }
    },
    array: (nested: [string, ComparePolicy][]): ComparePolicy => (prefix: string) => {
      const camelKey = toCamel(prefix)
      const target = get(o, camelKey) || []
      const fixtured = get(targetFixture, prefix) || []

      if (!fixtured && !target) {
        return
      }

      if ((!fixtured && target) || (fixtured && !target)) {
        throw new Error('failed to compare nested items fixture and target trutiness not sync.')
      }

      expect(target).toBeInstanceOf(Array)
      expect(fixtured).toBeInstanceOf(Array)
      expect(target.length).toEqual(fixtured.length)

      for (let i=0;i<target.length;i++) {
        const arrayPrefix = `${prefix}[${i}]`
        for (const f of nested) {
          if (debug) {
            console.log(`k .. ${arrayPrefix}.${f[0]}`, 'vs', camelKey)
          }
          const fieldName = `${arrayPrefix}.${f[0]}`
          const policyComparer = f[1]
          policyComparer(fieldName)
        }
      }
    },
  }
  return policy
}