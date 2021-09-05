import { autoserializeAs } from 'cerialize'

export type PerxTransactionRequestDataType = 'purchase'

export class PerxTransactionRequestData {

  @autoserializeAs('transaction_type')
  transactionType: PerxTransactionRequestDataType = 'purchase'

  @autoserializeAs('transaction_reference')
  transactionReference: string

  @autoserializeAs('amount')
  amount: number

  @autoserializeAs('currency')
  currency: string

  @autoserializeAs('properties')
  properties: Record<string, string | number>

  public constructor(amount: number, currency: string, transactionReference: string, transactionType: PerxTransactionRequestDataType = 'purchase', properties: Record<string, string | number> = {}) {
    this.amount = amount
    this.currency = currency
    this.transactionReference = transactionReference
    this.transactionType = transactionType
    this.properties = properties
  }
}

export class PerxTransactionReqeust {

  @autoserializeAs('user_account_id')
  userAccountId: string

  @autoserializeAs(PerxTransactionRequestData, 'transaction_data')
  transactionData: PerxTransactionRequestData

  public constructor(userAccountId: string, transactionData: PerxTransactionRequestData) {
    this.userAccountId = userAccountId
    this.transactionData = transactionData
  }

  /**
   * Make a valid transaction request object
   * 
   * @param userAccountId
   * @param amount 
   * @param currency 
   * @param transactionReference 
   * @param properties 
   */
  public static makePurchase(userAccountId: string, amount: number, currency: string, transactionReference: string, properties: Record<string, string | number> = {}): PerxTransactionReqeust {
    const data = new PerxTransactionRequestData(amount, currency, transactionReference, 'purchase', properties)
    return new PerxTransactionReqeust(userAccountId, data)
  }
}