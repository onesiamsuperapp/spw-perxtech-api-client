import {
  IPerxService,
  PerxCustomer,
  PerxLoyaltyTransaction,
  PerxLoyaltyTransactionRequest,
  PerxTransaction,
  PerxTransactionReqeust,
  TokenResponse
} from '..'
import type { IPerxPosProxy } from './manager'

export class PerxPosProxy implements IPerxPosProxy {

  public constructor(private readonly getToken: () => Promise<TokenResponse>, private readonly perxService: IPerxService) {
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
   * Submit new transaction to perx service via POS Access.
   * 
   * @param transaction 
   */
  async submitTransaction(transaction: PerxTransactionReqeust): Promise<PerxTransaction> {
    const applicationToken = await this.getToken()
    return this.perxService.submitTransaction(applicationToken.accessToken, transaction)
  }

  /**
   * get customer detail via POS Access.
   * 
   * @param userId 
  */
  async getCustomerDetail(userId: number): Promise<PerxCustomer> {
    const applicationToken = await this.getToken()
    return this.perxService.getCustomerDetail(applicationToken.accessToken, userId)
  }
}