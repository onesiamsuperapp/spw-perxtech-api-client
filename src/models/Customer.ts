import { autoserializeAs } from 'cerialize';
import { ISODateTimeSerializer } from '../utils/cerialize';

export class PerxCustomer {

  @autoserializeAs('id')
  id!: number

  @autoserializeAs('identifier')
  identifier: string | null = null

  @autoserializeAs('first_name')
  firstName: string | null = null

  @autoserializeAs('middle_name')
  middleName: string | null = null

  @autoserializeAs('last_name')
  lastName: string | null = null

  @autoserializeAs('phone')
  phone: string | null = null

  @autoserializeAs('email')
  email: string | null = null

  @autoserializeAs('birthday')
  birthdayYYYYMMDD: string | null = null

  @autoserializeAs('gender')
  gender: string | null = null

  @autoserializeAs('state')
  state: 'active' | 'inactive' = 'inactive'

  @autoserializeAs(ISODateTimeSerializer, 'joined_at')
  joinedAt: Date | null = null

  @autoserializeAs(ISODateTimeSerializer, 'password_expires_at')
  passwordExpiresAt: Date | null = null
}