import type { IPerxUserProxy } from './manager'
import type { IPerxService, PerxFilterScope, PerxLoyalty, PerxReward, PerxVoucher, TokenResponse } from '..'
import { chunk } from 'lodash'

export class PerxUserProxy implements IPerxUserProxy {

  public constructor(public readonly getToken: () => Promise<TokenResponse>, private readonly perxService: IPerxService) {
  }

  /**
   * Query list of Rewards from Perx (so that it can be claimed)
   * 
   * @param scope
   * @returns
   */
  public async queryRewards(scope: Partial<PerxFilterScope>): Promise<PerxReward[]> {
    const token = await this.getToken()
    return this.perxService.getRewards(token.accessToken, scope)
  }

  /**
   * Issue the reward from service layer
   * 
   * @param rewardId 
   */
  public async issueReward(rewardId: string): Promise<PerxVoucher> {
    const token = await this.getToken()
    return this.perxService.issueVoucher(token.accessToken, rewardId)
  }

  /**
   * Query list of vouchers from Perx
   * 
   * @param scope 
   * @returns 
   */
  public async queryVouchers(scope: Partial<PerxFilterScope>): Promise<PerxVoucher[]> {
    const token = await this.getToken()
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

  public async getLoyaltyProgram(loyaltyProgramId: number | string): Promise<PerxLoyalty> {
    const token = await this.getToken()
    return this.perxService.getLoyaltyProgram(token.accessToken, loyaltyProgramId)
  }

  private async _forEachVoucher<R>(voucherIds: string[], callback: (token: TokenResponse, voucherId: string) => Promise<R>): Promise<R[]> {
    const token = await this.getToken()
    let results: R[] = []
    for(const chunkedVoucherIds of chunk(voucherIds, 5)) {
      const r = await Promise.all(chunkedVoucherIds.map((voucherId) => {
        return callback(token, voucherId)
      }))
      results = results.concat(r)
    }
    return results
  }
}