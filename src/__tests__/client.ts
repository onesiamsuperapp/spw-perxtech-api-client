import { IPerxService, PerxService } from '../client'

describe('PerxService', () => {

  const testingTokenDurationInSeconds = 300

  const client: IPerxService = new PerxService({
    baseURL: (process.env.TEST_PERX_API_URL || ''),
    clientId: (process.env.TEST_PERX_CLIENT_ID || ''),
    clientSecret: (process.env.TEST_PERX_CLIENT_SECRET || ''),
    tokenDurationInSeconds: testingTokenDurationInSeconds, // 5 mins is more than enough
  })

  const testableUserIdentifierOnPerxServer = (process.env.TEST_PERX_USER_IDENTIFIER || '')
  const testableUserIdOnPerxServer = (process.env.TEST_PERX_USER_ID || '')
  const testableLoyaltyProgramIdOnPerxServer = (process.env.TEST_PERX_LOYALTY_PROGRAM_ID || '')

  // Optional target, if not provide use first record in query to run the test
  const testableRewardId = +(process.env.TEST_PERX_REWARD_ID || '-1')

  if (!testableUserIdentifierOnPerxServer) {
    throw new Error('Unable to run test without proper configuration. Please revise your .env file. (in root folder)')
  }

  describe('customer session', () => {
    const ctx = {
      accessToken: '',
      rewardId: testableRewardId || -1,
      voucherId: -1,
    }
    it('can issue user token', async () => {
      const tokenResp = await client.getUserToken(testableUserIdentifierOnPerxServer)
      expect(tokenResp.accessToken).toBeTruthy()
      expect(tokenResp.tokenType).toMatch(/bearer/i)
      expect(tokenResp.scope).toEqual('user_account')
      expect(tokenResp.expiresIn).toEqual(testingTokenDurationInSeconds)
      ctx.accessToken = tokenResp.accessToken
    })

    describe('for reward & voucher', () => {
      it('can query rewards', async () => {
        const rewards = await client.getRewards(ctx.accessToken, {})
        expect(rewards).toBeInstanceOf(Array)
        expect(rewards.length).toBeGreaterThan(1)
        expect(rewards[0].id).toBeTruthy()
        expect(typeof rewards[0].id).toBe('number')
  
        if (ctx.rewardId <= 0) {
          ctx.rewardId = rewards[0].id
        }
      })
  
      it('can claim the rewards as voucher', async () => {
        const voucher = await client.issueVoucher(ctx.accessToken, `${ctx.rewardId}`)
        expect(voucher).toBeTruthy()
        expect(typeof voucher.id).toBe('number')
        expect(voucher.state).toEqual('issued')
        ctx.voucherId = voucher.id
      })
  
      it('can reserve the voucher', async () => {
        const reservedVoucher = await client.redeemVoucher(ctx.accessToken, ctx.voucherId, false)
        expect(reservedVoucher).toBeTruthy()
        expect(reservedVoucher.id).toEqual(ctx.voucherId)
        expect(reservedVoucher.state).toEqual('redemption_in_progress')
      })

      it('can commit the voucher', async () => {
        const reservedVoucher = await client.redeemVoucher(ctx.accessToken, ctx.voucherId, true)
        expect(reservedVoucher).toBeTruthy()
        expect(reservedVoucher.id).toEqual(ctx.voucherId)
        expect(reservedVoucher.state).toEqual('redeemed')
      })
    })

    if (testableLoyaltyProgramIdOnPerxServer) {
      describe('for loyalty', () => {
        it('can query user outstanding loyalty program points', async () => {
          const loyalty = await client.getLoyaltyProgram(ctx.accessToken, testableLoyaltyProgramIdOnPerxServer)
          expect(loyalty.tierPoints).toBeTruthy()
          expect(typeof loyalty.id).toEqual('number')
          expect(loyalty.id).toEqual(+testableLoyaltyProgramIdOnPerxServer)
          expect(loyalty.pointBalance).toBeTruthy()
        })
      })
    }

    if (testableUserIdOnPerxServer) {
      describe('for customer', () => {
        it('can query customer', async () => {
          const customer = await client.getCustomer(ctx.accessToken, testableUserIdOnPerxServer)
          expect(customer.identifier).toEqual(testableUserIdentifierOnPerxServer)
          expect(customer.id).toEqual(+testableUserIdOnPerxServer)
        })
      })
    }
  })

  describe('application session', () => {
    const ctx = {
      accessToken: '',
    }
    it('can issue application token', async () => {
      const tokenResp = await client.getApplicationToken()
      expect(tokenResp.accessToken).toBeTruthy()
      expect(tokenResp.tokenType).toMatch(/bearer/i)
      expect(tokenResp.scope).toBeUndefined()
      ctx.accessToken = tokenResp.accessToken
    })
  })
})