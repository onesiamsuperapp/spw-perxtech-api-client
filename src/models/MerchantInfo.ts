import { autoserializeAs } from 'cerialize'

/**
 * {
    "id": 175,
    "email": "khuong+test5@perxtech.com",
    "merchant_account_id": 206,
    "mobile": "",
    "username": "khuong+test5@perxtech.com"
   }
 */
export class MerchantInfo {

  @autoserializeAs('id')
  id!: number

  @autoserializeAs('merchant_account_id')
  merchantAccountId!: number

  @autoserializeAs('email')
  email: string = ''

  @autoserializeAs('username')
  username: string = ''

  @autoserializeAs('mobile')
  mobile: string = ''
}