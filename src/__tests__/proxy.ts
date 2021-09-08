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