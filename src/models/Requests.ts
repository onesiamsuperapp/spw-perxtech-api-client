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

export interface PerxRawUserAccountId {
  type: 'id'
  id: number
}

export interface PerxRawUserAccountIdentifier {
  type: 'identifier'
  identifier: string
}

export type PerxRawUserAccount = PerxRawUserAccountId | PerxRawUserAccountIdentifier

export class PerxLoyaltyTransactionRequestUserAccount {
  @autoserializeAs('identifier')
  identifier?: string

  @autoserializeAs('id')
  id?: number

  public constructor(userAccount: PerxRawUserAccount) {
    if (userAccount.type === 'identifier') {
      this.identifier = userAccount.identifier
    } else {
      this.id = userAccount.id
    }
  }
}

export class PerxLoyaltyTransactionReservationRequest {
  
  @autoserializeAs(PerxLoyaltyTransactionRequestUserAccount, 'user_account')
  userAccount: PerxLoyaltyTransactionRequestUserAccount

  @autoserializeAs('amount_to_deduct')
  points!: number

  @autoserializeAs('loyalty_program_id')
  loyaltyProgramId!: number

  constructor(userAccount: PerxLoyaltyTransactionRequestUserAccount, loyaltyProgramId: number, points: number) {
    this.userAccount = userAccount
    this.points = points
    this.loyaltyProgramId = loyaltyProgramId
  }
}

export class PerxLoyaltyTransactionRequest {
  
  @autoserializeAs(PerxLoyaltyTransactionRequestUserAccount, 'user_account')
  userAccount: PerxLoyaltyTransactionRequestUserAccount

  @autoserializeAs('properties')
  properties: Record<string, string|number> = {}

  @autoserializeAs('points')
  points!: number

  @autoserializeAs('loyalty_program_id')
  loyaltyProgramId!: number

  constructor(userAccount: PerxLoyaltyTransactionRequestUserAccount, loyaltyProgramId: number, points: number, properties: Record<string, string|number> = {}) {
    this.userAccount = userAccount
    this.points = points
    this.loyaltyProgramId = loyaltyProgramId
    this.properties = properties
  }

  public static makeBurnRequest(userAccount: PerxRawUserAccount, loyaltyProgramId: number, pointsToBurn: number, properties: Record<string, string|number> = {}): PerxLoyaltyTransactionRequest {
    const request = new PerxLoyaltyTransactionRequest(
      new PerxLoyaltyTransactionRequestUserAccount(userAccount),
      loyaltyProgramId,
      -pointsToBurn,
      properties,
    )
    return request
  }

  public static makeEarnRequest(userAccount: PerxRawUserAccount, loyaltyProgramId: number, pointsToEarn: number, properties: Record<string, string|number> = {}): PerxLoyaltyTransactionRequest {
    const request = new PerxLoyaltyTransactionRequest(
      new PerxLoyaltyTransactionRequestUserAccount(userAccount),
      loyaltyProgramId,
      pointsToEarn,
      properties,
    )
    return request
  }
}