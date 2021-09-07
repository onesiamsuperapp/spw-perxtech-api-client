import type {
  PerxReward,
  PerxVoucher,
  TokenResponse,
} from './'
import {
  PerxFilterScope,
  IPerxService,
} from './'
import chunk from 'lodash/chunk'
import { PerxError } from './error'
import { PerxLoyalty } from './models'


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
 * Interface to wrap usage of Perx regardless of user control.
 */
export interface IPerxProxyManager {

  queryRewards(scope: Partial<PerxFilterScope>): Promise<PerxReward[]>

  queryVouchers(scope: Partial<PerxFilterScope>): Promise<PerxVoucher[]>

  reserveVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  confirmVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  releaseVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  redeemVouchers(voucherIds: string[]): Promise<PerxVoucher[]>

  issueReward(rewardId: string): Promise<PerxVoucher>

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

  public constructor(public readonly identification: PerxIdentification, public readonly perxService: IPerxService) {
  }
  public static async assureApplicationToken(perxService: IPerxService): Promise<TokenResponse> {
    const applicationTokenCacheKey = 'application'
    const nowMs = new Date().getTime()
    const _token = this._tokens[applicationTokenCacheKey]
    if (_token && _token.expiredAt.getTime() > nowMs) {
      return _token.response
    }
    const tokenResp = await perxService.getApplicationToken()
    this._tokens[applicationTokenCacheKey] = {
      expiredAt: new Date(nowMs + tokenResp.expiresIn * 1000),
      response: tokenResp,
    }
    return tokenResp
  }

  /**
   * Use this method to access exposedToken
   * @returns 
   */
  public static async assureToken(identification: PerxIdentification, perxService: IPerxService): Promise<TokenResponse> {
    let identifier: string | null = null

    const key = identification.type === 'id' ? `id:${identification.id}` : `identifier:${identification.identifier}`

    const nowMs = new Date().getTime()
    const _token = this._tokens[key]
    if (_token && _token.expiredAt.getTime() > nowMs) {
      return _token.response
    }
  
    if (identification.type === 'id') {
      const appTokenResp = await this.assureApplicationToken(perxService)
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
    this._tokens[key] = {
      expiredAt: new Date(nowMs + response.expiresIn * 1000),
      response,
    }
    return response
  }

  /**
   * Query list of Rewards from Perx (so that it can be claimed)
   * 
   * @param scope
   * @returns
   */
  public async queryRewards(scope: Partial<PerxFilterScope>): Promise<PerxReward[]> {
    const token = await PerxProxyManager.assureToken(this.identification, this.perxService)
    return this.perxService.getRewards(token.accessToken, scope)
  }

  /**
   * Issue the reward from service layer
   * 
   * @param rewardId 
   */
  public async issueReward(rewardId: string): Promise<PerxVoucher> {
    const token = await PerxProxyManager.assureToken(this.identification, this.perxService)
    return this.perxService.issueVoucher(token.accessToken, rewardId)
  }

  /**
   * Query list of vouchers from Perx
   * 
   * @param scope 
   * @returns 
   */
  public async queryVouchers(scope: Partial<PerxFilterScope>): Promise<PerxVoucher[]> {
    const token = await PerxProxyManager.assureToken(this.identification, this.perxService)
    return this.perxService.getVouchers(token.accessToken, scope)
  }

  public async reserveVouchers(voucherIds: string[]): Promise<PerxVoucher[]> {
    return this._forEachVoucher(voucherIds, (token, voucherId) => {
      return this.perxService.redeemVoucher(token.accessToken, voucherId, false)
    })
  }

  public async confirmVouchers(voucherIds: string[]): Promise<PerxVoucher[]> {
    return this._forEachVoucher(voucherIds, (token, voucherId) => {
      return this.perxService.redeemVoucher(token.accessToken, voucherId, true)
    })
  }

  public async redeemVouchers(voucherIds: string[]): Promise<PerxVoucher[]> {
    return this._forEachVoucher(voucherIds, (token, voucherId) => {
      return this.perxService.redeemVoucher(token.accessToken, voucherId)
    })
  }

  public async releaseVouchers(voucherIds: string[]): Promise<PerxVoucher[]> {
    return this._forEachVoucher(voucherIds, (token, voucherId) => {
      return this.perxService.releaseVoucher(token.accessToken, voucherId)
    })
  }

  private async _forEachVoucher<R>(voucherIds: string[], callback: (token: TokenResponse, voucherId: string) => Promise<R>): Promise<R[]> {
    const token = await PerxProxyManager.assureToken(this.identification, this.perxService)
    let results: R[] = []
    for(const chunkedVoucherIds of chunk(voucherIds, 5)) {
      const r = await Promise.all(chunkedVoucherIds.map((voucherId) => {
        return callback(token, voucherId)
      }))
      results = results.concat(r)
    }
    return results
  }

  /**
   * 
   * @param parentCategory
   */
  public async getRewardsCategories(parentCategory?: string): Promise<any> {
    // Query reward categories
  }


  /**
   * Query loyalty program from Perx
   * 
   * @param loyaltyProgramId
   * @returns
   */
  public async getLoyaltyProgram(loyaltyProgramId: number | string): Promise<PerxLoyalty> {
    const token = await PerxProxyManager.assureToken(this.identification, this.perxService)
    return this.perxService.getLoyaltyProgram(token.accessToken, loyaltyProgramId)
  }

}