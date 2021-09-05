import { autoserializeAs } from 'cerialize';
import { ISODateTimeSerializer } from '../utils/cerialize';

export class PerxTransaction {

  @autoserializeAs('id')
  id!: number

  @autoserializeAs('user_account_id')
  userAccountId!: number

  @autoserializeAs(ISODateTimeSerializer, 'updated_at')
  updatedAt!: Date

  @autoserializeAs('transaction_type')
  transactionType!: string

  @autoserializeAs('amount')
  amount: number = 0

  @autoserializeAs('transaction_date')
  transactionDate!: Date

  @autoserializeAs('currency')
  currency!: string

  @autoserializeAs('workflow_id')
  workflowId!: number

  @autoserializeAs('created_at')
  createdAt!: Date

  @autoserializeAs('properties')
  properties: Record<string, string|number> = {}

  @autoserializeAs('transaction_reference')
  transactionReference: string | null = null

  @autoserializeAs('points_earned')
  pointsEarned: number = 0

  @autoserializeAs('merchant_user_account_id')
  merchantUserAccountId: number | null = null
}