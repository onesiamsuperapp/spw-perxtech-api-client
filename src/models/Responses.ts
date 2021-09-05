import { autoserializeAs, Deserialize, inheritSerialization } from 'cerialize'
import { isArray } from 'lodash'
import { PerxError } from '../error'
import { PerxCustomer } from './Customer'
import { PerxLoyalty } from './LoyaltyProgram'
import { PerxReward } from './Reward'
import { PerxTransaction } from './Transaction'
import { PerxVoucher } from './Voucher'

export class BasePerxResponse {

  @autoserializeAs('error')
  protected errorCode?: string

  @autoserializeAs('error_description')
  protected errorDescription?: string

  public get hasError(): boolean {
    return Boolean(this.error)
  }

  protected afterDeserialized(json: any) {
  }

  public get error(): Error | undefined {
    if (this.errorCode || this.errorDescription) {
      const errorCode = this.errorCode || 'no-error-code'
      const errorDescritpion = this.errorDescription || 'no-error-description'
      return PerxError.serverRejected(errorCode, errorDescritpion)
    }
    return undefined
  }

  /**
   * Parse JSON response and Evaluate the result.
   * throws if error shown
   * 
   * @param json 
   * @param cnstr 
   * @returns 
   */
  public static parseAndEval<T extends BasePerxResponse>(json: any, httpStatus: number, cnstr: new () => T): T {
    if (!json) {
      throw PerxError.networkFailed(httpStatus)
    }
    const o = Deserialize(json, cnstr) as T
    if (httpStatus >= 400 && json.message) {
      throw PerxError.serverRejected(json.code, json.message)
    }
    o.afterDeserialized(json)
    const err = o.error
    if (err) {
      throw err
    }
    return o
  }
}

export class PerxPagingMeta {
  @autoserializeAs('count')
  count!: number

  @autoserializeAs('size')
  size!: number

  @autoserializeAs('total_pages')
  totalPages!: number

  @autoserializeAs('page')
  page!: number
  
  @autoserializeAs('lat')
  lat: string | null = null

  @autoserializeAs('lng')
  lng: string | null = null

  @autoserializeAs('radius')
  radius: string | null = null

  // Unmapped fields.
  // "filter_for_catalogs": [],
  // "filter_for_brands": [],
  // "filter_for_states": [],
  // "filter_for_cities": [],
  // "filter_for_malls": [],
  // "filter_for_merchants": [],
  // "filter_for_locations": [],
  // "brands_index": [],
  // "states_index": [],
  // "cities_index": [],
  // "malls_index": [],
  // "campaigns_index": [],
  // "catalogues_index": []
}

@inheritSerialization(BasePerxResponse)
export abstract class ObjectPerxResponse<Obj> extends BasePerxResponse {

  data!: Obj

  protected constructor(private cnstr: new () => Obj) {
    super()
  }

  protected afterDeserialized(json: any) {
    const deserialized = Deserialize(json.data, this.cnstr)
    this.data = deserialized
  }
}

@inheritSerialization(BasePerxResponse)
export abstract class ItemListPerxResponse<Item> extends BasePerxResponse {

  protected constructor(private cnstr: new () => Item) {
    super()
  }

  data: Item[] = []

  @autoserializeAs(PerxPagingMeta, 'meta')
  meta!: PerxPagingMeta

  protected afterDeserialized(json: any) {
    const deserialized = Deserialize(json.data, this.cnstr)
    if (!isArray(deserialized)) {
      throw new Error('Failed to deserialize item entries')
    }
    this.data = deserialized
  }
}

export class TokenResponse extends BasePerxResponse {

  @autoserializeAs('access_token')
  accessToken!: string

  @autoserializeAs('token_type')
  tokenType!: string

  @autoserializeAs('refresh_token')
  refreshToken: string | null = null

  @autoserializeAs('expires_in')
  expiresIn: number = 0

  @autoserializeAs('scope')
  scope?: string
}

export class RewardsRespopnse extends ItemListPerxResponse<PerxReward> {
  public constructor() { super(PerxReward) }
}

export class VouchersResponse extends ItemListPerxResponse<PerxVoucher> {
  public constructor() { super(PerxVoucher) }
}

export class VoucherResponse extends ObjectPerxResponse<PerxVoucher> {
  public constructor() { super(PerxVoucher) }
}

export class LoyaltyProgramResponse extends ObjectPerxResponse<PerxLoyalty> {
  public constructor() { super(PerxLoyalty) }
}

export class PerxCustomerResponse extends ObjectPerxResponse<PerxCustomer> {
  public constructor() { super(PerxCustomer) }
}

export class PerxTransactionResponse extends ObjectPerxResponse<PerxTransaction> {
  public constructor() { super(PerxTransaction) }
}