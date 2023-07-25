import {
  IPerxService,
  PerxService,
  // PerxLoyaltyTransactionRequest,
  // PerxVoucher,
  // PerxRewardScope,
  // PerxVoucherScope,
  // PerxReward,
  // PerxRewardReservation,
  // PerxPagingMeta,
} from '../../src'

describe('PerxService', () => {

  const testingTokenDurationInSeconds = 300

  const client: IPerxService = new PerxService({
    baseURL: (process.env.TEST_PERX_API_URL || 'https://api-qa-internal.one-viz.com/superapp'),
    clientId: (process.env.TEST_PERX_CLIENT_ID || ''),
    clientSecret: (process.env.TEST_PERX_CLIENT_SECRET || ''),
    tokenDurationInSeconds: testingTokenDurationInSeconds, // 5 mins is more than enough
  })

  // const testableUserIdentifierOnPerxServer = (process.env.TEST_PERX_USER_IDENTIFIER || '')
  const testableUserIdOnPerxServer = (process.env.TEST_PERX_USER_ID || '')
  // const testableLoyaltyProgramIdOnPerxServer = (process.env.TEST_PERX_LOYALTY_PROGRAM_ID || '')
  // const testableSearchKeyword = (process.env.TEST_PERX_REWARD_SEARCH_KEYWORD || '')

  // Optional target, if not provide use first record in query to run the test
  // const testableRewardId = +(process.env.TEST_PERX_REWARD_ID || '-1')

  // if (!testableUserIdentifierOnPerxServer) {
  //   throw new Error('Unable to run test without proper configuration. Please revise your .env file. (in root folder)')
  // }

  // describe('customer session', () => {
  //   const ctx = {
  //     accessToken: '',
  //     rewardId: testableRewardId || -1,
  //     voucherId: -1,
  //   }

  //   it('can issue user token', async () => {
  //     const tokenResp = await client.getUserToken(testableUserIdentifierOnPerxServer)
  //     expect(tokenResp.accessToken).toBeTruthy()
  //     expect(tokenResp.tokenType).toMatch(/bearer/i)
  //     expect(tokenResp.scope).toEqual('user_account')
  //     expect(tokenResp.expiresIn).toEqual(testingTokenDurationInSeconds)
  //     ctx.accessToken = tokenResp.accessToken
  //   })

  //   it('can list categories', async () => {
  //     const categories = await client.getCategories(ctx.accessToken, null, 1, 1)
  //     expect(categories).toBeTruthy()
  //     expect(categories.meta).toBeTruthy()
  //     expect(categories.data).toBeInstanceOf(Array)
  //     expect(categories.data.length).toBeGreaterThanOrEqual(1)
  //     expect(categories.data[0].id).toBeTruthy()
  //     expect(categories.data[0].title).toBeTruthy()
  //   })

  //   it.each`
  //     scope                         | mustMatch
  //     ${{}}                         | ${() => true }
  //     ${{state: 'expired'}}         | ${(o: PerxVoucher) => o.state === 'expired' }
  //     ${{type: 'expired'}}          | ${(o: PerxVoucher) => o.state === 'expired' }
  //     ${{type: 'all'}}              | ${(o: PerxVoucher) => ['expired', 'issued','redemption_in_progress', 'released', 'redeemed'].indexOf(o.state) >= 0 }
  //     ${{state: 'issued'}}          | ${(o: PerxVoucher) => o.state === 'issued' }
  //     ${{state: 'redeemed'}}        | ${(o: PerxVoucher) => o.state === 'redeemed' }
  //   `('list vouchers $scope', async ({ scope, mustMatch }: { scope: PerxVoucherScope, mustMatch: (o: PerxVoucher) => boolean}) => {
  //     const perPage = 10
  //     const vouchers = await client.getVouchers(ctx.accessToken, { ...scope, page: 1, size: perPage })
  //     expect(vouchers).toBeTruthy()
  //     expect(vouchers.data).toBeTruthy()
  //     expect(vouchers.data.every(mustMatch)).toBeTruthy()

  //     expect(vouchers.meta.page).toEqual(1)
  //     expect(vouchers.meta.size).toBeLessThanOrEqual(perPage)
  //     if (scope.type) {
  //       expect(vouchers.meta.type).toEqual(scope.type)
  //     }

  //     if (vouchers.meta.count > vouchers.meta.size) {
  //       expect(vouchers.meta.totalPages).toBeGreaterThan(1)

  //       const nextPageVouchers = await client.getVouchers(ctx.accessToken, { ...scope, page: 2, size: perPage })
  //       expect(nextPageVouchers).toBeTruthy()
  //       expect(nextPageVouchers.data).toBeTruthy()
  //       expect(nextPageVouchers.data.every(mustMatch)).toBeTruthy()
  //     }
  //   })

  //   describe('for reward & voucher', () => {
  //     it.each`
  //       scope                               | mustMatch
  //       ${{ tagIds: [1, 112] }}             | ${(o: PerxReward) => o.tags.some((t) => t.id === 1 || t.id === 112)}
  //       ${{ brandId: 34 }}                  | ${(o: PerxReward) => o.brands.some((t) => t.id === 34)}
  //       ${{ brandId: 69 }}                  | ${(o: PerxReward) => o.brands.some((t) => t.id === 69)}
  //       ${{}}                               | ${() => true}
  //     `('can query rewards: $scope', async ({ scope, mustMatch }: { scope: PerxRewardScope, mustMatch: (o: PerxReward) => boolean}) => {
  //       const resp = await client.getRewards(ctx.accessToken, scope)
  //       const rewards = resp.data
  //       expect(rewards).toBeInstanceOf(Array)
  //       expect(rewards.length).toBeGreaterThanOrEqual(1)
  //       expect(rewards.every(mustMatch)).toBeTruthy()
  
  //       if (ctx.rewardId <= 0) {
  //         ctx.rewardId = rewards[0].id
  //       }
  //     })

  //     if (testableSearchKeyword) {
  //       const pageSize = 3
  //       let firstPageMeta: PerxPagingMeta | null = null
  //       it('can search rewards on first page', async () => {
  //         const searchResults = await client.searchRewards(ctx.accessToken, testableSearchKeyword, 1, pageSize)
  //         expect(searchResults).toBeTruthy()
  //         expect(searchResults.data).toBeInstanceOf(Array)
  //         expect(searchResults.data.length).toBeGreaterThan(1)
  //         expect(searchResults.data.length).toBeLessThanOrEqual(pageSize)
  //         expect(searchResults.data[0].documentType).toEqual('reward')
  //         expect(searchResults.data[0].reward).toBeTruthy()
  //         expect(searchResults.meta.totalPages).toBeGreaterThanOrEqual(1)

  //         firstPageMeta = searchResults.meta
  //       })

  //       if (firstPageMeta) {
  //         it('can search rewards on last page', async () => {
  //           const meta = firstPageMeta!
  //           const lastPageCount = (meta.count % pageSize) || pageSize
  //           const lastPage = meta.totalPages
  //           const lastSearchResults = await client.searchRewards(ctx.accessToken, testableSearchKeyword, lastPage, pageSize)
  //           expect(lastSearchResults.data).toBeInstanceOf(Array)
  //           expect(lastSearchResults.data.length).toEqual(lastPageCount)
  //           expect(lastSearchResults.data[0].documentType).toEqual('reward')
  //           expect(lastSearchResults.data[0].reward).toBeTruthy()
  //         })
  //       }
  //     }

  //     describe('reserve & release reward', () => {
  //       let reservation: PerxRewardReservation | null = null

  //       it('can reserve reward as reservedVoucher', async () => {
  //         reservation = await client.reserveReward(ctx.accessToken, `${ctx.rewardId}`)
  //         expect(reservation).toBeTruthy()
  //         expect(typeof reservation.id).toBe('number')
  //         expect(reservation.state).toEqual('reserved')
  //       })

  //       it('can release reserved reward', async () => {
  //         let voucher = await client.releaseRewardReservation(ctx.accessToken, `${reservation!.id}`)
  //         expect(voucher).toBeTruthy()
  //         expect(typeof voucher.id).toBe('number')
  //         expect(voucher.state).toEqual('released')
  //       })
  //     })

  //     describe('reserve & confirm reward', () => {
  //       let reservation: PerxRewardReservation | null = null

  //       it('can reserve reward as reservedVoucher', async () => {
  //         reservation = await client.reserveReward(ctx.accessToken, `${ctx.rewardId}`)
  //         expect(reservation).toBeTruthy()
  //         expect(typeof reservation.id).toBe('number')
  //         expect(reservation.state).toEqual('reserved')
  //       })

  //       it('can release reserved reward', async () => {
  //         let voucher = await client.confirmRewardReservation(ctx.accessToken, `${reservation!.id}`)
  //         expect(voucher).toBeTruthy()
  //         expect(typeof voucher.id).toBe('number')
  //         expect(voucher.state).toEqual('issued')
  //       })
  //     })
  
  //     it('can claim the rewards as voucher', async () => {
  //       const voucher = await client.issueVoucher(ctx.accessToken, `${ctx.rewardId}`)
  //       expect(voucher).toBeTruthy()
  //       expect(typeof voucher.id).toBe('number')
  //       expect(voucher.state).toEqual('issued')
  //       ctx.voucherId = voucher.id
  //     })
  
  //     it('can reserve the voucher', async () => {
  //       const reservedVoucher = await client.redeemVoucher(ctx.accessToken, ctx.voucherId, false)
  //       expect(reservedVoucher).toBeTruthy()
  //       expect(reservedVoucher.id).toEqual(ctx.voucherId)
  //       expect(reservedVoucher.state).toEqual('redemption_in_progress')
  //     })

  //     it('can commit the voucher', async () => {
  //       const reservedVoucher = await client.redeemVoucher(ctx.accessToken, ctx.voucherId, true)
  //       expect(reservedVoucher).toBeTruthy()
  //       expect(reservedVoucher.id).toEqual(ctx.voucherId)
  //       expect(reservedVoucher.state).toEqual('redeemed')
  //     })
  //   })

  //   if (testableLoyaltyProgramIdOnPerxServer) {
  //     describe('for loyalty', () => {
  //       it('can query user outstanding loyalty program points', async () => {
  //         const loyalty = await client.getLoyaltyProgram(ctx.accessToken, testableLoyaltyProgramIdOnPerxServer)
  //         expect(loyalty.tierPoints).toBeTruthy()
  //         expect(typeof loyalty.id).toEqual('number')
  //         expect(loyalty.id).toEqual(+testableLoyaltyProgramIdOnPerxServer)
  //         expect(loyalty.pointBalance).toBeTruthy()
  //       })

  //       it('can query list user loyalty program', async () => {
  //         const loyalties = await client.getLoyaltyPrograms(ctx.accessToken)
  //         expect(loyalties.length).toBeGreaterThan(0)
  //         expect(loyalties[0].tierPoints).toBeTruthy()
  //         expect(typeof loyalties[0].id).toEqual('number')
  //         expect(loyalties[0].pointBalance).toBeTruthy()
  //       })

  //       it('can query get users transaction histroy from Perx', async () => {
  //         const resp = await client.queryLoyaltyTransactionsHistory(ctx.accessToken, 1, 5)
  //         expect(resp).toBeTruthy()
  //         expect(resp.data).toBeInstanceOf(Array)
  //         expect(resp.data.length).toBeGreaterThanOrEqual(0)
  //         expect(resp.meta).toBeTruthy()
  //         expect(resp.meta.count).toBeGreaterThanOrEqual(0)
  //       })
  //     })
  //   }

  //   if (testableUserIdOnPerxServer) {
  //     describe('for customer', () => {
  //       it('can query customer', async () => {
  //         const customer = await client.getCustomer(ctx.accessToken, testableUserIdOnPerxServer)
  //         expect(customer.identifier).toEqual(testableUserIdentifierOnPerxServer)
  //         expect(customer.id).toEqual(+testableUserIdOnPerxServer)
  //       })
  //     })
  //   }
  // })

  describe('application session', () => {
    // const pointsToEarnAndBurn: number = 121
    const ctx = {
      accessToken: '',
    }

    // it('can issue application token', async () => {
    //   const tokenResp = await client.getApplicationToken()
    //   expect(tokenResp.accessToken).toBeTruthy()
    //   expect(tokenResp.tokenType).toMatch(/bearer/i)
    //   expect(tokenResp.scope).toBeUndefined()
    //   ctx.accessToken = tokenResp.accessToken
    // })


    it('can get customer detail', async () => {
      const detail = await client.getCustomerDetail(ctx.accessToken, +testableUserIdOnPerxServer)
      expect(detail.identifier).toBeTruthy()
    })

    // it('can earn the points for customer', async () => {
    //   const earnRequest = PerxLoyaltyTransactionRequest.makeEarnRequest(
    //     { type: 'id', id: +testableUserIdOnPerxServer },
    //     +testableLoyaltyProgramIdOnPerxServer,
    //     pointsToEarnAndBurn,
    //     null,
    //     {},
    //   )

    //   expect(earnRequest.userAccount).toBeTruthy()
    //   expect(earnRequest.userAccount.id).toBeTruthy()
    //   expect(earnRequest.points).toEqual(pointsToEarnAndBurn)
    //   expect(earnRequest.loyaltyProgramId).toEqual(+testableLoyaltyProgramIdOnPerxServer)

    //   const earnResp = await client.submitLoyaltyTransaction(ctx.accessToken, earnRequest)
    //   const nowMs = new Date().getTime()
    //   expect(earnResp.id).toBeTruthy()
    //   expect(earnResp.loyaltyProgramId).toEqual(+testableLoyaltyProgramIdOnPerxServer)
    //   expect(earnResp.points).toEqual(pointsToEarnAndBurn)
    //   expect(earnResp.transactedAt).toBeInstanceOf(Date)
    //   expect(Math.abs(earnResp.transactedAt.getTime() - nowMs)).toBeLessThanOrEqual(5000)
    // })

    // it('can burn the points for customer', async () => {
    //   const earnRequest = PerxLoyaltyTransactionRequest.makeBurnRequest(
    //     { type: 'id', id: +testableUserIdOnPerxServer },
    //     +testableLoyaltyProgramIdOnPerxServer,
    //     pointsToEarnAndBurn,
    //     null,
    //     {},
    //   )

    //   expect(earnRequest.userAccount).toBeTruthy()
    //   expect(earnRequest.userAccount.id).toBeTruthy()
    //   expect(earnRequest.points).toEqual(-pointsToEarnAndBurn)
    //   expect(earnRequest.loyaltyProgramId).toEqual(+testableLoyaltyProgramIdOnPerxServer)

    //   const earnResp = await client.submitLoyaltyTransaction(ctx.accessToken, earnRequest)
    //   const nowMs = new Date().getTime()
    //   expect(earnResp.id).toBeTruthy()
    //   expect(earnResp.loyaltyProgramId).toEqual(+testableLoyaltyProgramIdOnPerxServer)
    //   expect(earnResp.points).toEqual(-pointsToEarnAndBurn)
    //   expect(earnResp.transactedAt).toBeInstanceOf(Date)
    //   expect(Math.abs(earnResp.transactedAt.getTime() - nowMs)).toBeLessThanOrEqual(5000)
    // })
  })
})