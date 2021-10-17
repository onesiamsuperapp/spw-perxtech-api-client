import {
  PerxVoucher,
  PerxRewardScope,
  IPerxService,
  PerxError,
  PerxVoucherScope,
  PerxRewardsResponse,
  PerxCustomer,
  PerxLoyalty,
  PerxLoyaltyTransaction,
  PerxLoyaltyTransactionRequest,
  PerxTransaction,
  PerxTransactionReqeust,
  PerxLoyaltyTransactionsHistoryResponse,
  PerxRewardSearchResultResponse,
  PerxVouchersResponse,
  PerxCategory,
  PerxRewardReservation,
  PerxCategoriesResultResponse,
  PerxLoyaltyTransactionReservationRequest,
  PerxLoyaltyTransactionRequestUserAccount,
} from '..'
import { PerxPosProxy } from './pos'
import { PerxUserProxy } from './user'


export interface PerxId {
  type: 'id'
  id: number
}

export interface PerxIdentifier {
  type: 'identifier'
  identifier: string
}

export type PerxIdentification = PerxId | PerxIdentifier

/**
 * Interface for User Access
 */
export interface IPerxUserProxy {

  /**
   * List Rewards to be claim
   * 
   * @param scope 
   */
  queryRewards(scope: Partial<PerxRewardScope>): Promise<PerxRewardsResponse>

  /**
   * Search existing Perx's rewards
   * 
   * @param keyword 
   */
  searchRewards(keyword: string): Promise<PerxRewardSearchResultResponse>
  searchRewards(keyword: string, page: number): Promise<PerxRewardSearchResultResponse>
  searchRewards(keyword: string, page: number, size: number): Promise<PerxRewardSearchResultResponse>

  /**
   * List categories within Perx's system
   * page starts with 1
   */
  listCategories(page: number, pageSize: number): Promise<PerxCategoriesResultResponse>

  /**
   * List all perx categories by ParentID
   * @param parentId
   * @param page
   * @param pageSize
   */
  listCategoriesByParentId(parentId: number, page: number, pageSize: number): Promise<PerxCategoriesResultResponse>

  /**
   * List all categories (chaining calls automatically)
   */
  listAllCategories(): Promise<PerxCategory[]>

  /**
   * List all categories (chaining calls automatically)
   * 
   * @param parentId
   */
  listAllCategories(parentId: number): Promise<PerxCategory[]>

  /**
   * Cliam a reward, resulting a Voucher.
   * 
   * @param rewardId
   */
  issueReward(rewardId: string): Promise<PerxVoucher>

  /**
   * Reserve a reward for particular token's owner (expires in 15mins)
   * 
   * WARNING: call this method while there is a reservation of the same
   * Reward exists will not issue a new token for the user. Rather it 
   * will pick current one to return!
   * 
   * @param rewardId
   */
  reserveReward(rewardId: string): Promise<PerxRewardReservation>

  /**
   * Reserve a reward with specific timeout.
   * 
   * WARNING: call this method while there is a reservation of the same
   * Reward exists will not issue a new token for the user. Rather it 
   * will pick current one to return!
   * 
   * @param rewardId
   * @param timeoutInMs
   */
  reserveReward(rewardId: string, timeoutInMs: number): Promise<PerxRewardReservation>

  /**
   * release reserved reward
   * 
   * @param scope 
   */
  releaseReservedReward(rewardId: string): Promise<PerxVoucher>

  /**
   * confirm the the reserved reward
   * 
   * @param scope 
   */
  confirmReservedReward(rewardId: string): Promise<PerxVoucher>

  /**
   * Listing claimed rewards (vouchers)
   * 
   * @param scope 
   */
  queryVouchers(scope: Partial<PerxVoucherScope>): Promise<PerxVouchersResponse>

  /**
   * Redeem the vouchers without marking/confirming/releasing
   * 
   * @param voucherIds 
   */
  redeemVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  /**
   * Mark the voucher as redemption in progress (can only be released by `pos.releaseVouchers()`)
   * 
   * @param voucherIds 
   */
  reserveVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  /**
   * Confirm all vouchers those has been marked with `user.reserveVouchers`.
   * 
   * @param voucherIds
   */
  confirmVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  /**
   * Query loyalty program from Perx
   * 
   * @param loyaltyProgramId
   * @returns
   */
  getLoyaltyProgram(loyaltyProgramId: number | string): Promise<PerxLoyalty>

  /**
   * Listing loyalty programs from Perx
   * 
   * @returns
   */
  queryLoyaltyPrograms(): Promise<PerxLoyalty[]>

  /**
   * Query Perx transactions history of given user
   * @param page 
   * @param perPage 
   */
  queryTransactionsHistory(): Promise<PerxLoyaltyTransactionsHistoryResponse>
  queryTransactionsHistory(page: number): Promise<PerxLoyaltyTransactionsHistoryResponse>
  queryTransactionsHistory(page: number, perPage: number): Promise<PerxLoyaltyTransactionsHistoryResponse>

  /**
   * Get perx's self customer identity
   */
  getMe(): Promise<PerxCustomer>
}

/**
 * Interface for POS Access
 */
export interface IPerxPosProxy {

  /**
   * Release the reserved vouchers
   * 
   * @param voucherIds 
   */
   releaseVouchers(voucherIds: string[]): Promise<PerxVoucher[]>
  
  /**
   * Hard burn/earn points
   * 
   * @param applicationToken 
   * @param request 
   */
  submitLoyaltyTransaction(request: PerxLoyaltyTransactionRequest): Promise<PerxLoyaltyTransaction>

  /**
   * Reserve the loyalty points give back the `loyaltyTransactionId` that holding the specified loyalty points.
   * 
   * @param request 
   */
  reserveLoyaltyPoints(request: PerxLoyaltyTransactionReservationRequest): Promise<PerxLoyaltyTransaction>

  /**
   * release the loyalty points witheld by specific `loyaltyTransactionId`
   * 
   * @param account 
   * @param loyaltyTransactionId
   */
  releaseLoyaltyPoints(account: PerxLoyaltyTransactionRequestUserAccount, loyaltyTransactionId: string): Promise<boolean>

  /**
   * Submit new transaction to perx service via POS Access.
   * 
   * @param transaction 
   */
  submitTransaction(transaction: PerxTransactionReqeust): Promise<PerxTransaction>

  /**
   * get customer detail via POS Access.
   * 
   * @param userId 
  */
  getCustomerDetail(userId: number): Promise<PerxCustomer>
}

/**
 * Interface to wrap usage of Perx regardless of user control.
 */
export interface IPerxProxyManager {

  user(identifier: PerxIdentification): IPerxUserProxy

  pos(): IPerxPosProxy
}

export interface IPerxToken {
  accessToken: string
}

export interface TokenPool {

  /**
   * Responsible for storing the token with given ttlInMs
   * 
   * @param key 
   * @param token 
   * @param ttlInMs 
   */
  cache(key: string, token: IPerxToken, ttlInMs: number): Promise<void>

  /**
   * Responsible for retriving the token from the cache pool. If
   * the cahced item is invalid, or no longer available return null.
   * 
   * @param key 
   */
  get(key: string): Promise<IPerxToken | null>
}

/**
 * Default implementation of Token pool handler
 * 
 * API consumer can replace this with Other Implementation such as Redis.
 */
export class InMemoryTokenPool implements TokenPool {

  /**
   * !Never access this parameter directly!
   * !use `assureToken` instead.
   */
  private _mem: Record<string, { response: IPerxToken, expiredAt: Date }> = {}

  public async cache(key: string, token: IPerxToken, ttlInMs: number): Promise<void> {
    const nowMs = new Date().getTime()
    this._mem[key] = {
      response: token,
      expiredAt: new Date(nowMs + ttlInMs)
    }
  }

  public async get(key: string): Promise<IPerxToken | null> {
    const nowMs = new Date().getTime()
    const _token = this._mem[key]
    if (_token && _token.expiredAt.getTime() > nowMs) {
      return _token.response
    }
    return null
  }
}

/**
 * 
 */
export class PerxProxyManager implements IPerxProxyManager {


  public constructor(public readonly perxService: IPerxService, private pool: TokenPool = new InMemoryTokenPool()) {
  }

  public user(identification: PerxIdentification): IPerxUserProxy {
    const user = new PerxUserProxy(() => this.assureToken(identification), this.perxService)
    return user
  }

  public pos(): IPerxPosProxy {
    const pos = new PerxPosProxy(() => this.assureApplicationToken(), this.perxService)
    return pos
  }

  /**
   * Use this method to access exposedToken
   * @returns 
   */
  public async assureToken(identification: PerxIdentification): Promise<IPerxToken> {
    let identifier: string | null = null

    const key = identification.type === 'id'
      ? `id:${identification.id}`
      : `identifier:${identification.identifier}`
    const perxService = this.perxService

    const _token = await this.pool.get(key)
    if (_token) {
      return _token
    }

    if (identification.type === 'id') {
      const appTokenResp = await this.assureApplicationToken()
      const response = await perxService.getCustomerDetail(appTokenResp.accessToken, identification.id)
      if (response.identifier) {
        identifier = response.identifier
      }
    }

    if (identification.type === 'identifier') {
      identifier = identification.identifier
    }
    if (!identifier) {
      throw PerxError.badRequest('no identifier')
    }

    const response = await perxService.getUserToken(identifier)
    this.pool.cache(key, { accessToken: response.accessToken }, response.expiresIn * 1000)
    return response
  }

  /**
   * Issue the Applciation's level token, cache it.
   * 
   * @param perxService
   * @returns
   */
  public async assureApplicationToken(): Promise<IPerxToken> {
    const applicationTokenCacheKey = 'application'
    const perxService = this.perxService
    const resp = await this.pool.get(applicationTokenCacheKey)
    if (resp) {
      return resp
    }
    const tokenResp = await perxService.getApplicationToken()
    this.pool.cache(applicationTokenCacheKey, { accessToken: tokenResp.accessToken }, tokenResp.expiresIn * 1000)
    return tokenResp
  }
}