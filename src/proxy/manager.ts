import {
  PerxVoucher,
  TokenResponse,
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

  /**
   * List all categories within Perx's system
   */
  listCategories(): Promise<PerxCategory[]>

  /**
   * Cliam a reward, resulting a Voucher.
   * 
   * @param rewardId
   */
  issueReward(rewardId: string): Promise<PerxVoucher>

  /**
   * Listing claimed rewards (vouchers)
   * 
   * @param scope 
   */
  queryVouchers(scope: Partial<PerxVoucherScope>): Promise<PerxVouchersResponse>

  /**
   * Mark the voucher to be ready to use.
   * 
   * @param voucherIds 
   */
  reserveVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  /**
   * Confirm the reserved vouchers
   * 
   * @param voucherIds
   */
  confirmVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  /**
   * Release the reserved vouchers
   * 
   * @param voucherIds 
   */
  releaseVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  /**
   * Redeem the vouchers without marking/confirming/releasing
   * 
   * @param voucherIds 
   */
  redeemVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

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
   * Hard burn/earn points
   * 
   * @param applicationToken 
   * @param request 
   */
  submitLoyaltyTransaction(request: PerxLoyaltyTransactionRequest): Promise<PerxLoyaltyTransaction>

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

  getRewardsCategories(parentCategory?: string): Promise<any>
}

/**
 * 
 */
export class PerxProxyManager implements IPerxProxyManager {

  /**
   * !Never access this parameter directly!
   * !use `assureToken` instead.
   */
  private static _tokens: Record<string, { response: TokenResponse, expiredAt: Date }> = {}

  public constructor(public readonly perxService: IPerxService) {
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
  public async assureToken(identification: PerxIdentification): Promise<TokenResponse> {
    let identifier: string | null = null

    const key = identification.type === 'id'
      ? `id:${identification.id}`
      : `identifier:${identification.identifier}`
    const perxService = this.perxService

    const nowMs = new Date().getTime()
    const _token = PerxProxyManager._tokens[key]
    if (_token && _token.expiredAt.getTime() > nowMs) {
      return _token.response
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
    PerxProxyManager._tokens[key] = {
      expiredAt: new Date(nowMs + response.expiresIn * 1000),
      response,
    }
    return response
  }

  /**
   * Issue the Applciation's level token, cache it.
   * 
   * @param perxService
   * @returns
   */
  public async assureApplicationToken(): Promise<TokenResponse> {
    const applicationTokenCacheKey = 'application'
    const nowMs = new Date().getTime()
    const perxService = this.perxService
    const _token = PerxProxyManager._tokens[applicationTokenCacheKey]
    if (_token && _token.expiredAt.getTime() > nowMs) {
      return _token.response
    }
    const tokenResp = await perxService.getApplicationToken()
    PerxProxyManager._tokens[applicationTokenCacheKey] = {
      expiredAt: new Date(nowMs + tokenResp.expiresIn * 1000),
      response: tokenResp,
    }
    return tokenResp
  }

  /**
   * 
   * @param parentCategory
   */
  public async getRewardsCategories(parentCategory?: string): Promise<any> {
    // Query reward categories
  }
}