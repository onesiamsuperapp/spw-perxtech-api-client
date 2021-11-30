import { autoserializeAs } from 'cerialize'
import { ISODateTimeSerializer } from '../utils/cerialize'
import { PerxReward } from './Reward'

export class PerxVoucherOwner {

  @autoserializeAs('identifier')
  identifier!: string
}

export type PerxVoucherState = 'issued' | 'redeemed' | 'expired' | 'redemption_in_progress' | 'released'
export type PerxVoucherType = 'active' | 'all' | 'expired' | 'gifted' | 'redeemed' | 'redemption_in_progress'

export class PerxVoucher {
  @autoserializeAs('id')
  id!: number

  @autoserializeAs('name')
  name!: string

  @autoserializeAs('custom_fields')
  customFields: Record<string, any> = {}

  @autoserializeAs(PerxReward, 'reward')
  reward: PerxReward | null = null

  @autoserializeAs('state')
  state: PerxVoucherState = 'expired'

  // @autoserializeAs('type')
  // type: PerxVoucherType = 'expired'

  @autoserializeAs(ISODateTimeSerializer, 'voucher_expires_at')
  voucherExpiresAt: Date | null = null

  @autoserializeAs(ISODateTimeSerializer, 'valid_from')
  validFrom: Date | null = null

  @autoserializeAs(ISODateTimeSerializer, 'valid_to')
  validTo: Date | null = null

  @autoserializeAs(PerxVoucherOwner, 'user_account')
  userAccount: PerxVoucherOwner | null = null

  @autoserializeAs('voucher_code')
  voucherCode: string | null = null

  @autoserializeAs('voucher_type')
  voucherType: 'code' = 'code'

  @autoserializeAs(ISODateTimeSerializer, 'reservation_expires_at')
  reservationExpiresAt: Date | null = null

  @autoserializeAs(ISODateTimeSerializer, 'reserved_expires_at')
  reservedExpiresAt: Date | null = null

  @autoserializeAs(ISODateTimeSerializer, 'redemption_date')
  redemptionDate: Date | null = null

  @autoserializeAs(ISODateTimeSerializer, 'issued_date')
  issuedDate: Date | null = null
}