import { autoserializeAs } from 'cerialize'
import { ISODateTimeSerializer } from '../utils/cerialize'

export class PerxLoyaltyTransactionDetailData {
  @autoserializeAs('id')
  id!: number

  @autoserializeAs('user_account_id')
  userAccountId!: number

  @autoserializeAs(ISODateTimeSerializer, 'updated_at')
  updatedAt!: Date

  @autoserializeAs('transaction_type')
  transactionType!: string

  @autoserializeAs('amount')
  amount: number | null = null

  @autoserializeAs(ISODateTimeSerializer, 'transaction_date')
  transactionDate!: Date

  @autoserializeAs('currency')
  currency!: string

  @autoserializeAs('workflow_id')
  workflowId: number | null = null

  @autoserializeAs(ISODateTimeSerializer, 'created_at')
  createdAt!: Date

  @autoserializeAs('properties')
  properties: Record<string, any> = {}

  @autoserializeAs('transaction_reference')
  transactionReference: string | null = null

  @autoserializeAs('points_earned')
  pointsEarned: number = 0

  @autoserializeAs('merchant_user_account_id')
  merchantUserAccountId: number | null = null
}

export class PerxLoyaltyTransactionDetail {
  @autoserializeAs('type')
  type!: string

  @autoserializeAs(PerxLoyaltyTransactionDetailData, 'data')
  data!: PerxLoyaltyTransactionDetailData
}

export class PerxLoyaltyTransactionHistoryEntry {

  @autoserializeAs('id')
  id!: number

  /**
   * Positive for points awarded.
   * Negative for points deducted.
   */
  @autoserializeAs('amount')
  amount!: number

  @autoserializeAs('identifier')
  identifier!: string

  @autoserializeAs('loyalty_id')
  loyaltyId!: number

  @autoserializeAs('loyalty_name')
  loyaltyName!: string

  /**
   * Derived from rule's name
   */
  @autoserializeAs('name')
  name: string | null = null

  @autoserializeAs('properties')
  properties: Record<string, any> = {}

  @autoserializeAs('rule_id')
  ruleId: number | null = null

  @autoserializeAs('rule_name')
  ruleName: string | null = null

  @autoserializeAs('transacted_amount')
  transactedAmount: string | null = null

  @autoserializeAs(ISODateTimeSerializer, 'transacted_at')
  transactedAt!: Date

  @autoserializeAs('transacted_cents')
  transactedCents: number = 0

  @autoserializeAs('transacted_currency')
  transactedCurrency: string | null = null

  @autoserializeAs(PerxLoyaltyTransactionDetail, 'transaction_details')
  transactionDetails: PerxLoyaltyTransactionDetail | null = null
}