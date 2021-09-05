import { autoserializeAs } from 'cerialize';
import { ISODateTimeSerializer } from '../utils/cerialize';

export class PerxLoyaltyTransaction {

  @autoserializeAs('id')
  id!: number

  @autoserializeAs('loyalty_program_id')
  loyaltyProgramId!: number

  @autoserializeAs('points')
  points: number = 0

  @autoserializeAs('properties')
  properties: Record<string, string|number> = {}

  @autoserializeAs(ISODateTimeSerializer, 'transacted_at')
  transactedAt!: Date
}