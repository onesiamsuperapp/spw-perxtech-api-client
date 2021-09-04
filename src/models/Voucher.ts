import { autoserializeAs } from 'cerialize'
import { ISODateTimeSerializer } from '../utils/cerialize'
import { PerxReward } from './Reward'

export class PerxVoucherOwner {

  @autoserializeAs('identifier')
  identifier!: string
}

export class PerxVoucher {
  @autoserializeAs('id')
  id!: number

  @autoserializeAs('name')
  name!: string

  @autoserializeAs(PerxReward, 'reward')
  reward!: PerxReward

  @autoserializeAs('state')
  state: 'issued' | 'redeemed' | 'redemption_in_progress' = 'issued'

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