import { uniq } from 'lodash'
import { IPerxService, PerxService } from '../client'
import { PerxProxyManager } from '../proxy'

describe('PerxProxyManager', () => {

  const testingTokenDurationInSeconds = 300

  const client: IPerxService = new PerxService({
    baseURL: (process.env.TEST_PERX_API_URL || ''),
    clientId: (process.env.TEST_PERX_CLIENT_ID || ''),
    clientSecret: (process.env.TEST_PERX_CLIENT_SECRET || ''),
    tokenDurationInSeconds: testingTokenDurationInSeconds, // 5 mins is more than enough
  })

  const testableUserIdentifierOnPerxServer = (process.env.TEST_PERX_USER_IDENTIFIER || '')
  const testableUserIdOnPerxServer = (process.env.TEST_PERX_USER_ID || '')

  if (!testableUserIdentifierOnPerxServer) {
    throw new Error('Unable to run test without proper configuration. Please revise your .env file. (in root folder)')
  }
  const manager = new PerxProxyManager(client)

  describe('id', () => {
    it('can assureToken with id', async () => {
      const resp = await manager.assureToken({
        type: 'id',
        id: +testableUserIdOnPerxServer,
      })
      expect(resp.accessToken).toBeTruthy()
    })
  })

  describe('user', () => {
    it('can query the customer', async () => {
      const user = manager.user({
        type: 'id',
        id: +testableUserIdOnPerxServer,
      })

      const me = await user.getMe()
      expect(me.id).toEqual(+testableUserIdOnPerxServer)
      expect(me.identifier).toEqual(testableUserIdentifierOnPerxServer)
    })

    it('can query categories', async () => {
      const user = manager.user({
        type: 'id',
        id: +testableUserIdOnPerxServer,
      })

      const firstPage = await user.listCategories(1, 1)
      expect(firstPage).toBeTruthy()
      const hasCategory = firstPage.data.length > 0
      if (hasCategory) {
        expect(firstPage.data.length).toBeLessThanOrEqual(1)
        expect(firstPage.meta).toBeTruthy()
        expect(firstPage.meta.totalCount).toBeTruthy()
        expect(firstPage.meta.nextPage).toBeTruthy()
        expect(firstPage.meta.totalPages).toBeGreaterThanOrEqual(1)

        // Try get all pages!

        const allCats = await user.listAllCategories()
        expect(allCats).toBeTruthy()
        expect(allCats).toBeInstanceOf(Array)
        expect(allCats.length).toEqual(firstPage.meta.totalCount)
        expect(uniq(allCats.map((o) => o.id)).length).toEqual(firstPage.meta.totalCount)
      }
    })
  })

  describe('identifier', () => {
    it('can assureToken with identifier', async () => {
      const resp = await manager.assureToken({
        type: 'identifier',
        identifier: testableUserIdentifierOnPerxServer,
      })
      expect(resp.accessToken).toBeTruthy()
    })
  })
})