import type { IPerxUserProxy } from './manager'
import type {
  IPerxService,
  PerxCustomer,
  PerxRewardScope,
  PerxLoyalty,
  PerxLoyaltyTransactionsHistoryResponse,
  PerxRewardSearchResultResponse,
  PerxVoucher,
  TokenResponse,
  PerxVoucherScope,
  PerxVouchersResponse,
  PerxRewardsResponse,
} from '..'
import { chunk } from 'lodash'

export class PerxUserProxy implements IPerxUserProxy {

  public constructor(public readonly getToken: () => Promise<TokenResponse>, private readonly perxService: IPerxService) {
  }

  public async queryRewards(scope: Partial<PerxRewardScope>): Promise<PerxRewardsResponse> {
    const token = await this.getToken()
    return this.perxService.getRewards(token.accessToken, scope)
  }

  public async searchRewards(keyword: string): Promise<PerxRewardSearchResultResponse> {
    const token = await this.getToken()
    return this.perxService.searchRewards(token.accessToken, keyword)
  }

  public async issueReward(rewardId: string): Promise<PerxVoucher> {
    const token = await this.getToken()
    return this.perxService.issueVoucher(token.accessToken, rewardId)
  }

  public async queryVouchers(scope: Partial<PerxVoucherScope>): Promise<PerxVouchersResponse> {
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

  public async getMe(): Promise<PerxCustomer> {
    const token = await this.getToken()
    return this.perxService.getMe(token.accessToken)
  }

  public async getLoyaltyProgram(loyaltyProgramId: number | string): Promise<PerxLoyalty> {
    const token = await this.getToken()
    return this.perxService.getLoyaltyProgram(token.accessToken, loyaltyProgramId)
  }

  public async queryLoyaltyPrograms(): Promise<PerxLoyalty[]> {
    const token = await this.getToken()
    return this.perxService.getLoyaltyPrograms(token.accessToken)
  }

  public async queryTransactionsHistory(page: number = 1, perPage: number = 25): Promise<PerxLoyaltyTransactionsHistoryResponse> {
    const token = await this.getToken()
    return this.perxService.queryLoyaltyTransactionsHistory(token.accessToken, page, perPage)
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