import { chunk } from 'lodash'
import { IPerxToken } from '.'
import {
  IPerxService,
  MerchantInfo,
  PerxCustomer,
  PerxExpiryAggregationResponse,
  PerxExpiryPointScope,
  PerxInvoiceCreationResponse,
  PerxInvoiceRequest,
  PerxLoyaltyTransaction,
  PerxLoyaltyTransactionRequest,
  PerxLoyaltyTransactionRequestUserAccount,
  PerxLoyaltyTransactionReservationRequest,
  PerxTransaction,
  PerxTransactionReqeust,
  PerxVoucher,
} from '..'
import type { IPerxPosProxy } from './manager'

export class PerxPosProxy implements IPerxPosProxy {

  public constructor(private readonly getToken: () => Promise<IPerxToken>, private readonly perxService: IPerxService) {
  }

  public async createInvoice(request: PerxInvoiceRequest): Promise<PerxInvoiceCreationResponse> {
    const applicationToken = await this.getToken()
    return this.perxService.posCreateInvoice(applicationToken.accessToken, request)
  }

  /**
   * Release the reserved vouchers
   * 
   * @param voucherIds 
   */
  public async releaseVouchers(voucherIds: string[]): Promise<PerxVoucher[]> {
    return this._forEachVoucher(voucherIds, (token, voucherId) => {
      return this.perxService.posReleaseReservedVoucher(token.accessToken, voucherId)
    })
  }

  /**
   * Hard burn/earn points
   * 
   * @param applicationToken 
   * @param request 
   */
  public async submitLoyaltyTransaction(request: PerxLoyaltyTransactionRequest): Promise<PerxLoyaltyTransaction> {
    const applicationToken = await this.getToken()
    return this.perxService.submitLoyaltyTransaction(applicationToken.accessToken, request)
  }

  /**
   * Reserve the loyalty points give back the `loyaltyTransactionId` that holding the specified loyalty points.
   * 
   * @param request 
   */
  public async reserveLoyaltyPoints(request: PerxLoyaltyTransactionReservationRequest): Promise<PerxLoyaltyTransaction> {
    const applicationToken = await this.getToken()
    return this.perxService.reserveLoyaltyPoints(applicationToken.accessToken, request)
  }

  /**
   * release the loyalty points witheld by specific `loyaltyTransactionId`
   * 
   * @param account 
   * @param loyaltyTransactionId
   */
  public async releaseLoyaltyPoints(account: PerxLoyaltyTransactionRequestUserAccount, loyaltyTransactionId: string): Promise<boolean> {
    const applicationToken = await this.getToken()
    return this.perxService.releaseLoyaltyPoints(applicationToken.accessToken, account, loyaltyTransactionId)
  }

  /**
   * Submit new transaction to perx service via POS Access.
   * 
   * @param transaction 
   */
  public async submitTransaction(transaction: PerxTransactionReqeust): Promise<PerxTransaction> {
    const applicationToken = await this.getToken()
    return this.perxService.submitTransaction(applicationToken.accessToken, transaction)
  }

  /**
   * get customer detail via POS Access.
   * 
   * @param userId 
  */
  public async getCustomerDetail(userId: number): Promise<PerxCustomer> {
    const applicationToken = await this.getToken()
    return this.perxService.getCustomerDetail(applicationToken.accessToken, userId)
  }

  /**
   * create merchant info
   * 
   * @param username 
   * @param email 
   * @param merchantId 
   * @returns 
   */
  public async createMerchantInfo(username: string, email: string, merchantId: number): Promise<MerchantInfo> {
    const applicationToken = await this.getToken()
    return this.perxService.createMerchantInfo(applicationToken.accessToken, username, email, merchantId)
  }

  private async _forEachVoucher<R>(voucherIds: string[], callback: (token: IPerxToken, voucherId: string) => Promise<R>): Promise<R[]> {
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

  /**
   * Get point expiry aggregation list
   * @param userIdentity 
   * @param scope 
   * @returns 
   */
  public async listAggregatedExpiryPoint(userIdentity: string, scope: Partial<PerxExpiryPointScope>): Promise<PerxExpiryAggregationResponse>{
    const applicationToken = await this.getToken()
    return this.perxService.listAggregatedExpiryPoint(applicationToken.accessToken, userIdentity, scope)
  }
}