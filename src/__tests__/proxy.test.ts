import { uniq } from 'lodash'
import { PerxLoyalty, PerxLoyaltyTransactionRequest, PerxLoyaltyTransactionRequestUserAccount, PerxLoyaltyTransactionReservationRequest } from '..'
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

  const testableLoyaltyProgramIdOnPerxServer = (process.env.TEST_PERX_LOYALTY_PROGRAM_ID || '')
  const testableUserIdentifierOnPerxServer = (process.env.TEST_PERX_USER_IDENTIFIER || '')
  const testableUserIdOnPerxServer = (process.env.TEST_PERX_USER_ID || '')
  // Optional target, if not provide use first record in query to run the test
  const testableRewardId = +(process.env.TEST_PERX_REWARD_ID || '-1')

  if (!testableUserIdentifierOnPerxServer) {
    throw new Error('Unable to run test without proper configuration. Please revise your .env file. (in root folder)')
  }
  const manager = new PerxProxyManager(client)
  const userAccount = new PerxLoyaltyTransactionRequestUserAccount({ type: 'id', id: +testableUserIdOnPerxServer })
  const user = manager.user({ type: 'id', id: +testableUserIdOnPerxServer })
  const pos = manager.pos()

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

  describe('LoyaltyPoints', () => {
    let program: PerxLoyalty | undefined = undefined
    const pointsToTest = 300
    let reservedTransactionId: string = ''

    it('can query the user points', async () => {
      program = await user.getLoyaltyProgram(testableLoyaltyProgramIdOnPerxServer)

      expect(program).toBeTruthy()
      expect(program.pointBalance).toBeTruthy()
    })

    it('can added some points in', async () => {
      await pos.submitLoyaltyTransaction(new PerxLoyaltyTransactionRequest(
        userAccount,
        +testableLoyaltyProgramIdOnPerxServer,
        pointsToTest,
        {},
      ))
      const newPrg = await user.getLoyaltyProgram(testableLoyaltyProgramIdOnPerxServer)
      expect(newPrg).toBeTruthy()
      expect(newPrg.pointBalance - program!.pointBalance).toEqual(pointsToTest)
      program = newPrg
    })

    it('will throws an error when reserving points exceeds current balance', async () => {
      const exceedingPoints = program!.pointBalance + 1
      await expect(() => pos.reserveLoyaltyPoints(new PerxLoyaltyTransactionReservationRequest(
        userAccount,
        +testableLoyaltyProgramIdOnPerxServer,
        exceedingPoints,
      ))).rejects.toThrow(/enough/)
    })

    it('can reserve the loyalty points', async () => {
      const reserved = await pos.reserveLoyaltyPoints(new PerxLoyaltyTransactionReservationRequest(
        userAccount,
        +testableLoyaltyProgramIdOnPerxServer,
        pointsToTest,
      ))

      expect(reserved).toBeTruthy()
      expect(reserved.id).toBeTruthy()
      expect(`${reserved.loyaltyProgramId}`).toEqual(testableLoyaltyProgramIdOnPerxServer)
      reservedTransactionId = `${reserved.id}`
    })

    it('can then release the reserved transaction', async () => {
      const released = await pos.releaseLoyaltyPoints(
        userAccount,
        reservedTransactionId,
      )

      expect(released).toBeTruthy()
    })
  })

  if (testableRewardId) {
    describe('vouchers', () => {
      const targetRewardId = `${testableRewardId}`
      let targetVoucherId: string = ''
  
      it('can claim the reward', async () => {
        const voucher = await user.issueReward(targetRewardId)
        expect(voucher).toBeTruthy()
        expect(voucher.issuedDate).toBeTruthy()
        expect(voucher.id).toBeTruthy()
        targetVoucherId = `${voucher.id}`
      })

      it('can reserve the voucher', async () => {
        const reservedVochers = await user.reserveVouchers([ targetVoucherId ])
        expect(reservedVochers).toBeInstanceOf(Array)
        expect(reservedVochers.length).toEqual(1)
        expect(reservedVochers[0].id).toEqual(+targetVoucherId)
        expect(reservedVochers[0].state).toEqual('redemption_in_progress')
      })

      it('cannot be reserved for the second time', async () => {
        await expect(() => user.reserveVouchers([ targetVoucherId ]))
          .rejects.toThrow(/not permit/)
      })

      it('can be released', async () => {
        const reservedVochers = await pos.releaseVouchers([ targetVoucherId ])
        expect(reservedVochers).toBeInstanceOf(Array)
        expect(reservedVochers.length).toEqual(1)
        expect(reservedVochers[0].id).toEqual(+targetVoucherId)
        expect(reservedVochers[0].state).toEqual('issued')
      })

      it('can then be reserved again', async () => {
        const reservedVochers = await user.reserveVouchers([ targetVoucherId ])
        expect(reservedVochers).toBeInstanceOf(Array)
        expect(reservedVochers.length).toEqual(1)
        expect(reservedVochers[0].id).toEqual(+targetVoucherId)
        expect(reservedVochers[0].state).toEqual('redemption_in_progress')
      })

      it('can then be confirmed to use', async () => {
        const reservedVochers = await user.confirmVouchers([ targetVoucherId ])
        expect(reservedVochers).toBeInstanceOf(Array)
        expect(reservedVochers.length).toEqual(1)
        expect(reservedVochers[0].id).toEqual(+targetVoucherId)
        expect(reservedVochers[0].state).toEqual('redeemed')
      })
    })
  }

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