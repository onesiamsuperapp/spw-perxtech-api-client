import type { PerxConfig } from './config'

import { Deserialize, Serialize } from 'cerialize'
import axios, { AxiosInstance } from 'axios'

import { PerxError } from './error'

import {
  BasePerxResponse,
  PerxRewardsResponse,
  TokenResponse,
  VoucherResponse,
  PerxVouchersResponse,
  PerxVoucher,
  PerxLoyalty,
  LoyaltyProgramResponse,
  LoyaltyProgramsResponse,
  PerxCustomer,
  PerxCustomerResponse,
  PerxTransaction,
  PerxTransactionReqeust,
  PerxTransactionResponse,
  PerxLoyaltyTransactionRequest,
  PerxLoyaltyTransaction,
  PerxLoyaltyTransactionResponse,
  PerxLoyaltyTransactionsHistoryResponse,
  PerxRewardSearchResultResponse,
  PerxCategoriesResultResponse,
  PerxVoucherState,
  PerxRewardReservation,
  PerxRewardReservationResponse,
  PerxLoyaltyTransactionRequestUserAccount,
  PerxLoyaltyTransactionReservationRequest,
  IdObjectResponse,
  PerxInvoiceRequest,
  PerxInvoiceCreationResponse,
  BearerTokenResponse,
  PerxMerchantInfoResponse,
  MerchantInfo,
  PerxRewardResponse,
  PerxVoucherResponse,
  PerxMerchant,
  PerxMerchantResponse,
  PerxMerchantsResponse,
  PerxCampaign,
  PerxCampaignResponse,
  PerxCampaignsResponse,
} from './models'
import { sleep } from './utils/sleep'

export interface PerxVoucherScope {
  size: number
  page: number
  sortBy: 'issued_date' | 'valid_to'
  order: 'asc' | 'desc'
  state: PerxVoucherState
  type: 'active' | 'all' | 'expired' | 'gifted' | 'redeemed' | 'redemption_in_progress'
  categoryId: string[]
  catalogId: string[]
  tagIds: string[]
}

export interface PerxRewardScope {

  /**
   * Page's sequence start with 1 *NOT* 0.
   */
  page: number

  /**
   * How much should Perx retrieve per page
   */
  pageSize: number

  /**
   * Category's Name
   * 
   * !warning: This is not exact match search!
   */
  categoryNamePrefix: string

  /**
   * categoryId
   * translated to: `category_ids` 
  * 
   */
  categoryId: string

  /**
   * mapped to: `filter_for_catalogs`
   * !warning: from manualy testing The API doesn't support multiple value
   */
  catalogId: string

  /**
   * mapped to: `filter_for_brands`
   * !warning: from manualy testing The API doesn't support multiple vlaue
   */
  brandId: string

  /**
   * tagIds to apply against
   */
  tagIds: string[]

  /**
   * translated to: `filter_by_points_balance` // undefined or none
   */
  filterByPointsBalance: boolean

  /**
   * translated to: `filter_for_merchants`
   * !warning: from manualy testing The API doesn't support multiple value
   */
  filterForMerchants: string

  /**
   * Sorting
   */
  sortBy: 'name' | 'id' | 'updated_at' | 'begins_at' | 'ends_at'

  /**
   * sortBy's order
   */
  order: 'asc' | 'desc'
}

export interface IPerxAuthService {
  /**
   * Issue the token by assuming role of user (customer).
   * 
   * @param userIdentifier 
   */
   getUserToken(userIdentifier: string): Promise<TokenResponse>

   /**
    * Issue the application's token
    */
   getApplicationToken(): Promise<TokenResponse>

   /**
    * 
    * @param merchantIdentifier 
    */
   getMerchantBearerToken(merchantIdentifier: string): Promise<BearerTokenResponse>
}

export interface IPerxUserService {

  /**
   * Get single reward by id
   * 
   * @param userToken 
   * @param rewardId 
   */
  getReward(userToken: string, rewardId: number): Promise<PerxRewardResponse>

  /**
   * List rewards for specific user
   * 
   * @param userToken 
   * @param scope 
   */
  getRewards(userToken: string, scope: Partial<PerxRewardScope>): Promise<PerxRewardsResponse>

  /**
   * Search rewards for that matched the keyword
   * 
   * @param userToken 
   * @param keyword keyword to search
   * @param page start with 1
   * @param size page size to load results
   */
  searchRewards(userToken: string, keyword: string, page: number, size: number): Promise<PerxRewardSearchResultResponse>
  
  /**
   * Reserve reward for particular user
   * 
   * This API can be commit and release by saving the id generated `ReservationId`, and use it to corresponding APIs
   * 
   * @param userToken 
   * @param rewardId
   */
  reserveReward(userToken: string, rewardId: string): Promise<PerxRewardReservation>

  /**
   * Reserve reward for particular user
   * 
   * This API can be commit and release by saving the id generated `ReservationId`, and use the corresponding APIs
   * 
   * @param userToken 
   * @param rewardId 
   * @param timeoutInMs 
   */
  reserveReward(userToken: string, rewardId: string, timeoutInMs: number): Promise<PerxRewardReservation>

  /**
   * Release reward's reservation with its id.
   * 
   * Reservation ID is generated from reserveReward() API
   * 
   * @param userToken 
   * @param reservationId 
   */
  releaseRewardReservation(userToken: string, reservationId: string): Promise<PerxVoucher>

  /**
   * Confirm reward's reservation with its id.
   * 
   * Reservation ID is generated from reserveReward() API
   * 
   * @param userToken 
   * @param reservationId 
   */
  confirmRewardReservation(userToken: string, reservationId: string): Promise<PerxVoucher>
 
   /**
    * Issue a voucher from particular reward for specific user
    *
    * @param userToken 
    * @param rewardId 
    */
  issueVoucher(userToken: string, rewardId: number | string): Promise<PerxVoucher>
 
  /**
   * Get single voucher by Id
   *
   * @param userToken 
   * @param voucherId 
   */
  getVoucher(userToken: string, voucherId: number): Promise<PerxVoucherResponse>

   /**
    * List vouchers for specific users
    * 
    * @param userToken
    * @param scope 
    */
  getVouchers(userToken: string, scope: Partial<PerxVoucherScope>): Promise<PerxVouchersResponse>
 
   /**
    * Redeem the voucher with specific voucherId and pass confirm boolean flag
    * 
    * For 2 phase action
    * if confirm flag = false, to reserve
    * if confirm flag = true, to confirm
    * 
    * For single shot
    * if confirm flag = undefined, to confirm right away
    * 
    * @param userToken 
    * @param voucherId 
    * @param confirm 
    * @returns 
    */
  redeemVoucher(userToken: string, voucherId: number | string): Promise<PerxVoucher>
  redeemVoucher(userToken: string, voucherId: number | string, confirm: boolean): Promise<PerxVoucher>
 
  /**
   * Query perx loyalty points
   */
  getLoyaltyProgram(userToken: string, loyaltyProgramId: string | number): Promise<PerxLoyalty>
 
 /**
   * Query perx loyalty points
   */
  getLoyaltyTransactions(userToken: string, loyaltyProgramId: string | number): Promise<PerxLoyalty>
 
  /**
   * Query perx loyalty list
   */
  getLoyaltyPrograms(userToken: string): Promise<PerxLoyalty[]>

   /**
    * Fetch specific perx's customer
    * 
    * @param userToken
    * @param customerId
    */
  getCustomer(userToken: string, customerId: string | number): Promise<PerxCustomer>

   /**
    * Fetch myself as customer
    * 
    * @param userToken
    */
  getMe(userToken: string): Promise<PerxCustomer>

  /**
   * List all existing categories
   * 
   * @param userToken 
   * @param parentId list categories with specific parentId null to list all.
   */
  getCategories(userToken: string, parentId: number | null, page: number, size: number): Promise<PerxCategoriesResultResponse>

  /**
   * Fetch customer's transaction history from Perx's service
   * 
   * @param userToken
   * @param page start with 1
   * @param perPage desinate the page size
   */
  queryLoyaltyTransactionsHistory(userToken: string, page: number, perPage: number, transactionReference?: string): Promise<PerxLoyaltyTransactionsHistoryResponse>

  /**
   * Query all merchants from Perx
   * @param  {boolean} favorite
   * @param  {number} perPage
   * @returns
   */
  listAllMerchants(userToken: string, page: number, perPage: number, favorite: boolean | undefined): Promise<PerxMerchantsResponse>

  /**
   * Query merchants by merchant id from Perx
   * @param  {number} merchantId
   * @param  {boolean} favorite
   * @returns
   */
  getMerchant(userToken: string, merchantId: number): Promise<PerxMerchant>

  /**
   * Execute custom trigger on Perx with specific user.
   * 
   * This API is fire & forget API. No response is provided. 
   * However invalid key will be responsed with Axios error (400 Bad Request)
   * 
   * @param userToken 
   * @param perxCustomTriggerId 
   */
  performCustomTrigger(userToken: string, perxCustomTriggerId: string): Promise<void>

  /**
   * Query all campaign from Perx
   * @param userToken 
   * @param page 
   * @param perPage 
   * @param campaignType 
   */
  listAllCampaign(userToken: string, page: number, perPage: number, campaignType: string | undefined): Promise<PerxCampaignsResponse>

  /**
   * Query campaign by campaign id from Perx
   * @param userToken 
   * @param campaignId 
   */
  getCampaign(userToken: string, campaignId: number): Promise<PerxCampaign>
}

export interface IPerxPosService {

  /**
   * @param userToken 
   * @param voucherId
   */
  posReleaseReservedVoucher(applicationToken: string, voucherId: number | string): Promise<PerxVoucher>

  /**
   * POS operation, create invoice based on given request.
   * 
   * @param applicationToken 
   * @param request 
   */
  posCreateInvoice(applicationToken: string, request: PerxInvoiceRequest): Promise<PerxInvoiceCreationResponse>

  /**
   * Burn/Earn loyalty transaction (See static methods of `PerxLoyaltyTransactionRequest`)
   * construct the request to make Burn/Earn transaction.
   * 
   * @param applicationToken 
   * @param request 
   */
  submitLoyaltyTransaction(applicationToken: string, request: PerxLoyaltyTransactionRequest): Promise<PerxLoyaltyTransaction>

  /**
   * Reserve amount of Loyalty points to be confirm
   * 
   * @param applicationToken 
   * @param request 
   */
  reserveLoyaltyPoints(applicationToken: string, request: PerxLoyaltyTransactionReservationRequest): Promise<PerxLoyaltyTransaction>

  /**
   * Reserve amount of Loyalty points to be confirm
   * 
   * @param applicationToken 
   * @param request 
   * @param loyaltyTransactionId that holding the value to release
   */
  releaseLoyaltyPoints(applicationToken: string, account: PerxLoyaltyTransactionRequestUserAccount, transactionId: string): Promise<boolean>

  /**
   * Submit new transaction to perx service via POS Access.
   * 
   * An Amount Transaction should be submitted here.
   * 
   * @param transaction 
   */
  submitTransaction(applicationToken: string, transaction: PerxTransactionReqeust): Promise<PerxTransaction>

  /**
   * get customer detail via POS Access.
   * 
   * @param userId
   */
  getCustomerDetail(applicationToken: string, userId: number): Promise<PerxCustomer>

  /**
   * Create merchant object via POS Access.
   * 
   * @param applicationToken 
   * @param username 
   * @param email 
   * @param merchantAccountId 
   */
  createMerchantInfo(applicationToken: string, username: string, email: string, merchantAccountId: number): Promise<MerchantInfo>
}

export type IPerxService = IPerxAuthService & IPerxUserService & IPerxPosService & { clone(lang: string): IPerxService }

export class PerxService implements IPerxService {

  private axios: AxiosInstance

  public clone(lang: string): PerxService {
    return new PerxService({
      ...this.config,
      lang,
    }, this.debug)
  }

  /**
   * Create perx service
   *
   * @param config 
   */
  public constructor(public readonly config: PerxConfig, public readonly debug: ((axios: AxiosInstance) => void) | 'request' | 'response' | 'all' | 'none' = 'none') {
    this.axios = axios.create({
      baseURL: this.config.baseURL,
      headers: config.lang && {
        'Accept-Language': config.lang,
      } || {},
      validateStatus: (status: number) => status < 450,     // all statuses are to be parsed by service layer.
    })
    if (typeof debug === 'function') {
      debug(this.axios)
    }
    if (debug === 'request' || debug === 'all') {
      this.axios.interceptors.request.use((config) => {
        console.log(`REQ> ${config.url}`, config)
        return config
      })
    }
    if (debug === 'response' || debug === 'all') {
      this.axios.interceptors.response.use((resp) => {
        console.log(`RESP< ${resp.config.url}`, resp.data)
        return resp
      }, (error) => {
        console.log(`ERR.RESP< ${error.response.config.method} ${error.response.config.url}`, error.response.data)
        throw error
      })
    }
  }

  /**
   * Find and create the userToken
   *
   * @param userIdentifier 
   */
  public async getUserToken(userIdentifier: string): Promise<TokenResponse> {
    const resp = await this.axios.post('/v4/oauth/token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'client_credentials',
      scope: `user_account(identifier:${userIdentifier})`,
      expires_in: this.config.tokenDurationInSeconds, // Expires it actually expire for 5 minutes
    })

    if (resp.status == 401) {
      throw PerxError.unauthorized()
    }

    return BasePerxResponse.parseAndEval(resp.data, resp.status, TokenResponse)
  }

  public async getMerchantBearerToken(merchantIdentifier: string): Promise<BearerTokenResponse> {
    const resp = await this.axios.post('/v4/oauth/token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'client_credentials',
      identifier: merchantIdentifier,
      scope: `merchant_user_account`,
    })

    if (resp.status == 401) {
      throw PerxError.unauthorized()
    }

    const r = Deserialize(resp.data, BearerTokenResponse)
    if (!r) {
      throw PerxError.serverRejected('Cannot create bearer token', 'no data converted')
    }
    return r
  }

  public async getCustomerDetail(applicationToken: string, userId: number): Promise<PerxCustomer> {
    const resp = await this.axios.get(`/v4/pos/user_accounts/${userId}`, {
      headers: {
        authorization: `Bearer ${applicationToken}`,
      },
    })
    if (resp.status == 401) {
      throw PerxError.unauthorized()
    }
    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxCustomerResponse)
    return result.data
  }

  public async getApplicationToken(): Promise<TokenResponse> {
    const resp = await this.axios.post('/v4/oauth/token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'client_credentials',
    })

    if (resp.status == 401) {
      throw PerxError.unauthorized()
    }

    return BasePerxResponse.parseAndEval(resp.data, resp.status, TokenResponse)
  }

  public async getReward(userToken: string, rewardId: number): Promise<PerxRewardResponse> {
    const resp = await this.axios.get(`/v4/rewards/${rewardId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      }
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxRewardResponse)
    return result
  }

  public async getRewards(userToken: string, scope: Partial<PerxRewardScope>): Promise<PerxRewardsResponse> {
    const params = PerxService.fromRewardsScopeToQueryParams(scope)
    const resp = await this.axios.get('/v4/rewards', {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params,
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxRewardsResponse)
    return result
  }

  public async issueVoucher(userToken: string, rewardId: number | string): Promise<PerxVoucher> {
    if (!/^\d+$/.test(`${rewardId}`)) {
      throw PerxError.badRequest(`Invalid rewardId: ${rewardId}, expected rewardId as integer`)
    }
    const resp = await this.axios.post(`/v4/rewards/${rewardId}/issue`, {}, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, VoucherResponse)
    return result.data
  }

  public async getVoucher(userToken: string, voucherId: number): Promise<PerxVoucherResponse> {
    const resp = await this.axios.get(`/v4/vouchers/${voucherId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxVoucherResponse)
    return result
  }

  public async getVouchers(userToken: string, scope: Partial<PerxVoucherScope>): Promise<PerxVouchersResponse> {
    const resp = await this.axios.get('/v4/vouchers', {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {
        size: scope?.size || 24,
        page: scope?.page || 1,
        state: scope.state || undefined,
        type: scope.type || undefined,
        sort_by: scope.sortBy || undefined,
        order: scope.order || undefined,
        category_ids: scope.categoryId || undefined,
        catalog_ids: scope.catalogId || undefined,
        tag_ids: scope.tagIds || undefined
      },
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxVouchersResponse)
    return result
  }

  public async reserveReward(userToken: string, rewardId: string, timeoutInMs: number = 900 * 1000): Promise<PerxRewardReservation> {
    if (!/^\d+$/.test(`${rewardId}`)) {
      throw PerxError.badRequest(`Invalid rewardId: ${rewardId}, expected rewardId as integer`)
    }
    const resp = await this.axios.post(`/v4/rewards/${rewardId}/reserve`, {}, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {
        timeout: timeoutInMs,
      }
    })
  
    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxRewardReservationResponse)
    return result.data
  }

  public async releaseRewardReservation(userToken: string, reservationId: string): Promise<PerxVoucher> {
    if (!/^\d+$/.test(`${reservationId}`)) {
      throw PerxError.badRequest(`Invalid reservationId: ${reservationId}, expected reservationId as integer`)
    }
    const resp = await this.axios.patch(`/v4/vouchers/${reservationId}/release`, {}, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {}
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, VoucherResponse)
    return result.data
  }

  public async confirmRewardReservation(userToken: string, reservationId: string): Promise<PerxVoucher> {
    if (!/^\d+$/.test(`${reservationId}`)) {
      throw PerxError.badRequest(`Invalid reservationId: ${reservationId}, expected reservationId as integer`)
    }
    const resp = await this.axios.patch(`/v4/vouchers/${reservationId}/confirm`, {}, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {}
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, VoucherResponse)
    return result.data
  }

  public async redeemVoucher(userToken: string, voucherId: string | number, confirm: boolean | undefined = undefined): Promise<PerxVoucher> {
    if (!/^\d+$/.test(`${voucherId}`)) {
      throw PerxError.badRequest(`Invalid voucherId: ${voucherId}, expected voucherId as integer`)
    }
    const resp = await this.axios.post(`/v4/vouchers/${voucherId}/redeem`, {}, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {
        confirm,
      }
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, VoucherResponse)
    return result.data
  }

  public async posReleaseReservedVoucher(applicationToken: string, voucherId: string | number): Promise<PerxVoucher> {
    if (!/^\d+$/.test(`${voucherId}`)) {
      throw PerxError.badRequest(`Invalid voucherId: ${voucherId}, expected voucherId as integer`)
    }
    const resp = await this.axios.put(`/v4/pos/vouchers/${voucherId}/revert_redemption`, {}, {
      headers: {
        authorization: `Bearer ${applicationToken}`,
      },
      params: {
      }
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, VoucherResponse)
    return result.data
  }

  /**
   * According to Perx's response, this API doesn't response any payload.
   * 
   * This API is fire & forget.
   * 
   * @param userToken 
   * @param perxCustomTriggerId 
   * @returns nothing
   */
  public async performCustomTrigger(userToken: string, perxCustomTriggerId: string): Promise<void> {
    const resp = await this.axios.put(`/v4/app_triggers/${perxCustomTriggerId}`, {}, {
      headers: {
        authorization: `Bearer ${userToken}`,
      }
    })
    // Just eval for error if status is not 200
    if (resp && resp.data && resp.status >= 400) {
      BasePerxResponse.parseAndEval(resp.data, resp.status, BasePerxResponse)
    }
    return
  }

  public async getLoyaltyProgram(userToken: string, loyaltyProgramId: string | number): Promise<PerxLoyalty> {
    if (!/^\d+$/.test(`${loyaltyProgramId}`)) {
      throw PerxError.badRequest(`Invalid loyaltyProgramId: ${loyaltyProgramId}, expected loyaltyProgramId as integer`)
    }
    const resp = await this.axios.get(`/v4/loyalty/${loyaltyProgramId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {}
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, LoyaltyProgramResponse)
    return result.data
  }

  public async getLoyaltyPrograms(userToken: string): Promise<PerxLoyalty[]> {
    const resp = await this.axios.get('/v4/loyalty', {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {}
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, LoyaltyProgramsResponse)
    return result.data
  }

  public async getLoyaltyTransactions(userToken: string, loyaltyProgramId: string | number): Promise<PerxLoyalty> {
    const resp = await this.axios.get(`/v4/loyalty/${loyaltyProgramId}/transactions`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      }
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, LoyaltyProgramResponse)
    return result.data
  }

  public async getMe(userToken: string): Promise<PerxCustomer> {
    return this.getCustomer(userToken, 'me')
  }

  public async getCustomer(userToken: string, customerId: string | number = 'me'): Promise<PerxCustomer> {
    if (!/^(me|\d+)$/.test(`${customerId}`)) {
      throw PerxError.badRequest(`Invalid customerId: ${customerId}, expected customer as integer`)
    }
    const resp = await this.axios.get(`/v4/customers/${customerId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {}
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxCustomerResponse)
    return result.data
  }

  public async submitTransaction(applicationToken: string, transaction: PerxTransactionReqeust): Promise<PerxTransaction> {
    const body = Serialize(transaction)
    const resp = await this.axios.post('/v4/pos/transactions', body, {
      headers: {
        authorization: `Bearer ${applicationToken}`,
      },
      params: {}
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxTransactionResponse)
    return result.data
  }

  public async submitLoyaltyTransaction(applicationToken: string, request: PerxLoyaltyTransactionRequest): Promise<PerxLoyaltyTransaction> {
    const body = Serialize(request)
    const resp = await this.axios.post('/v4/pos/loyalty_transactions', body, {
      headers: {
        authorization: `Bearer ${applicationToken}`,
      },
      params: {}
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxLoyaltyTransactionResponse)
    return result.data
  }

  public async reserveLoyaltyPoints(applicationToken: string, request: PerxLoyaltyTransactionReservationRequest): Promise<PerxLoyaltyTransaction> {
    const body = Serialize(request)
    const resp = await this.axios.post('/v4/pos/loyalty_transactions/reserve', body, {
      headers: {
        authorization: `Bearer ${applicationToken}`,
      },
      params: {}
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxLoyaltyTransactionResponse)
    return result.data
  }

  public async releaseLoyaltyPoints(applicationToken: string, account: PerxLoyaltyTransactionRequestUserAccount, transactionId: string): Promise<boolean> {
    const accountBody = Serialize(account)
    const resp = await this.axios.put(`/v4/pos/loyalty_transactions/${transactionId}/revert_redemption`, {
      user_account: accountBody,
    }, {
      headers: {
        authorization: `Bearer ${applicationToken}`,
      },
      params: {}
    })
    
    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, IdObjectResponse)
    return result.data.id === transactionId
  }

  public async posCreateInvoice(applicationToken: string, request: PerxInvoiceRequest): Promise<PerxInvoiceCreationResponse> {
    const body = Serialize(request)
    const resp = await this.axios.post('/v4/pos/invoices', body, {
      headers: {
        authorization: `Bearer ${applicationToken}`,
      },
    })
  
    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxInvoiceCreationResponse)
    return result
  }

  public async searchRewards(userToken: string, keyword: string, page: number, size: number): Promise<PerxRewardSearchResultResponse> {
    const resp = await this.axios.get('/v4/search', {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {
        search_string: keyword,
        page,
        size,
      }
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxRewardSearchResultResponse)
    return result
  }

  public async getCategories(userToken: string, parentId: number | null, page: number, size: number): Promise<PerxCategoriesResultResponse> {
    const resp = await this.axios.get('/v4/categories', {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {
        ...(parentId && { parent_id: parentId } || {}),
        page,
        size,
      }
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxCategoriesResultResponse)
    return result
  }

  public async queryLoyaltyTransactionsHistory(userToken: string, page: number, perPage: number, transactionReference?: string): Promise<PerxLoyaltyTransactionsHistoryResponse> {
    const resp = await this.axios.get('/v4/loyalty/transactions_history', {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {
        page,
        size: perPage,
        transaction_reference: transactionReference,
      }
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxLoyaltyTransactionsHistoryResponse)
    return result
  }

  public async listAllMerchants(userToken: string, page: number,  perPage: number, favorite: boolean | undefined = undefined): Promise<PerxMerchantsResponse> {
    const resp = await this.axios.get('/v4/merchants', {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {
        favorite,
        page,
        size: perPage,
      }
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxMerchantsResponse)
    return result
  }

  public async getMerchant(userToken: string, merchantId: number): Promise<PerxMerchant> {
    const resp = await this.axios.get(`/v4/merchants/${merchantId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxMerchantResponse)
    return result.data
  }

  public async createMerchantInfo(applicationToken: string, username: string, email: string, merchantAccountId: number): Promise<MerchantInfo> {
    const resp = await this.axios.post('/v4/pos/merchant_user_accounts', {
      username,
      email,
      merchant_account_id: merchantAccountId,
    }, {
      headers: {
        authorization: `Bearer ${applicationToken}`,
      },
    })
    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxMerchantInfoResponse)
    return result.data
  }

  private static fromRewardsScopeToQueryParams(scope: Partial<PerxRewardScope>): Record<string, string | string[]> {
    const out: Record<string, string | string[]> = {}
    if (scope.catalogId) {
      out.filter_for_catalogs = scope.catalogId
    }
    if (scope.tagIds) {
      out.tag_ids = scope.tagIds
    }
    if (scope.filterByPointsBalance) {
      out.filter_by_points_balance = 'true'
    }
    if (scope.brandId) {
      out.filter_for_brands = scope.brandId
    }
    if (scope.sortBy) {
      out.sort_by = scope.sortBy
    }
    if (scope.order) {
      out.order_by = scope.order
    }
    if (scope.categoryNamePrefix) {
      out.categories = scope.categoryNamePrefix
    }
    if (scope.page) {
      out.page = `${scope.page}`
    }
    if (scope.pageSize) {
      out.size = `${scope.pageSize}`
    }
    if (scope.filterForMerchants) {
      out.filter_for_merchants = scope.filterForMerchants
    }
    if (scope.categoryId) {
      out.category_ids = `${scope.categoryId}`
    }
    return out
  }

  public async listAllCampaign(userToken: string, page: number, perPage: number, campaignType: string | undefined = undefined): Promise<PerxCampaignsResponse> {
    // const resp = await this.axios.get('/v4/campaigns', {
    //   headers: {
    //     authorization: `Bearer ${userToken}`,
    //   },
    //   params: {
    //     page,
    //     size: perPage,
    //     campaign_type: campaignType || undefined
    //   }
    // })
    //add delay time to mockup latency
    await sleep(this.config.delay)
    const resp = {
      status: 200,
      data: [
        {
          id: 73,
          active_at: null,
          begins_at: "2022-05-04T10:55:07.217Z",
          campaign_config: {
            campaign_results: {
              count: 0,
              first_result_id: null,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "give_reward",
          category_tags: [],
          custom_fields: {},
          description: null,
          display_properties: {},
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: null,
          images: [],
          merchant: null,
          name: "Test Create Merchant by Thanasak",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions: null,
        },
        {
          id: 75,
          active_at: null,
          begins_at: "2022-06-01T10:34:00.000Z",
          campaign_config: {
            campaign_results: {
              count: 0,
              first_result_id: null,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "stamp",
          category_tags: [],
          custom_fields: {},
          description: null,
          display_properties: {
            cols: 2,
            rows: 4,
            header: {
              type: "text",
              title: "Start collecting stamps!",
              value: {
                title: "Start collecting stamps!",
                description: "Enjoy your membership reward",
              },
              description: "Enjoy your membership reward.",
            },
            card_image: {
              type: "image",
              value: {
                filename: "background_image.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/background_image.png",
              },
            },
            button_text: "Start Collecting!",
            thumbnail_image: {
              type: "image",
              value: {
                filename: "thumbnail_image.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/thumbnail_image.png",
              },
            },
            button_Bg_colour: "#fee800",
            gift_active_image: {
              type: "image",
              value: {
                filename: "gift_active.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/gift_active.png",
              },
            },
            button_text_colour: "#000000",
            stamp_active_image: {
              type: "image",
              value: {
                filename: "stamp_active.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/stamp_active.png",
              },
            },
            display_campaign_as: "stamp_card",
            gift_inactive_image: {
              type: "image",
              value: {
                filename: "gift_inactive.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/gift_inactive.png",
              },
            },
            stamp_inactive_image: {
              type: "image",
              value: {
                filename: "stamp_inactive.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/stamp_inactive.png",
              },
            },
            card_background_image: {
              type: "image",
              value: {
                filename: "card_background_image.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/card_background_image.png",
              },
            },
          },
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: null,
          images: [],
          merchant: null,
          name: "Camapign Stamp",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions: null,
        },
        {
          id: 108,
          active_at: null,
          begins_at: "2022-06-17T13:32:59.780Z",
          campaign_config: {
            campaign_results: {
              count: 0,
              first_result_id: null,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "invite",
          category_tags: [],
          custom_fields: {},
          description: null,
          display_properties: {},
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: null,
          images: [],
          merchant: null,
          name: "Referral Campaign - Friend get friend",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions: null,
        },
        {
          id: 109,
          active_at: null,
          begins_at: "2022-06-19T09:50:12.466Z",
          campaign_config: {
            campaign_results: {
              count: 0,
              first_result_id: null,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "give_reward",
          category_tags: [],
          custom_fields: {},
          description: null,
          display_properties: {},
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: null,
          images: [],
          merchant: null,
          name: "Campaign Reward",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions: null,
        },
        {
          id: 142,
          active_at: null,
          begins_at: "2022-09-05T07:12:00.671Z",
          campaign_config: {
            campaign_results: {
              count: 0,
              first_result_id: null,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "game",
          category_tags: [],
          custom_fields: {},
          description: null,
          display_properties: {
            header: {
              value: {
                title: "Spin The Wheel",
                description: "Spin the wheel and win a prize!",
              },
              header_colour: "#000000",
              subheader_colour: "#000000",
            },
            wedges: [
              {
                color: "#ca01b3",
                image: {
                  type: "image",
                  value: {
                    section: "",
                    filename: "reward_icon.png",
                    image_url:
                      "https://cdn.perxtech.net/content/dashboard/post-stamp-2.png",
                  },
                },
                position: 0,
                has_reward: true,
              },
              {
                color: "#f82165",
                image: {
                  type: "image",
                  value: {
                    section: "",
                    filename: "reward_icon.png",
                    image_url:
                      "https://cdn.perxtech.net/content/dashboard/post-stamp-2.png",
                  },
                },
                position: 1,
                has_reward: false,
              },
              {
                color: "#f86521",
                image: {
                  type: "image",
                  value: {
                    section: "",
                    filename: "reward_icon.png",
                    image_url:
                      "https://cdn.perxtech.net/content/dashboard/post-stamp-2.png",
                  },
                },
                position: 2,
                has_reward: true,
              },
              {
                color: "#cab301",
                image: {
                  type: "image",
                  value: {
                    section: "",
                    filename: "reward_icon.png",
                    image_url:
                      "https://cdn.perxtech.net/content/dashboard/post-stamp-2.png",
                  },
                },
                position: 3,
                has_reward: false,
              },
              {
                color: "#80ed12",
                image: {
                  type: "image",
                  value: {
                    section: "",
                    filename: "reward_icon.png",
                    image_url:
                      "https://cdn.perxtech.net/content/dashboard/post-stamp-2.png",
                  },
                },
                position: 4,
                has_reward: true,
              },
              {
                color: "#35fe4c",
                image: {
                  type: "image",
                  value: {
                    section: "",
                    filename: "reward_icon.png",
                    image_url:
                      "https://cdn.perxtech.net/content/dashboard/post-stamp-2.png",
                  },
                },
                position: 5,
                has_reward: false,
              },
              {
                color: "#07de9a",
                image: {
                  type: "image",
                  value: {
                    section: "",
                    filename: "reward_icon.png",
                    image_url:
                      "https://cdn.perxtech.net/content/dashboard/post-stamp-2.png",
                  },
                },
                position: 6,
                has_reward: true,
              },
              {
                color: "#079ade",
                image: {
                  type: "image",
                  value: {
                    section: "",
                    filename: "reward_icon.png",
                    image_url:
                      "https://cdn.perxtech.net/content/dashboard/post-stamp-2.png",
                  },
                },
                position: 7,
                has_reward: false,
              },
            ],
            outcome: {
              type: "image",
              title: "Congratulations!",
              value: {
                filename: "outcome.png",
                image_id: 71,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/71/outcome-421cdf7c-fbe6-4a98-8a81-700b8e3374a3.png",
              },
              button_text: "View My Wallet",
              description: "You just won a reward!",
            },
            nooutcome: {
              title: "Obviously, you do not have luck",
              button_text: "Try Again",
              description: "Try again tomorrow",
            },
            rim_image: {
              type: "image",
              value: {
                section: "",
                filename: "wheel_1.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/wheel1.png",
              },
            },
            reward_image: {
              type: "image",
              value: {
                section: "",
                filename: "reward_icon.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/post-stamp-2.png",
              },
            },
            pointer_image: {
              type: "image",
              value: {
                section: "",
                filename: "pointer_3.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/pointer3.png",
              },
            },
            wheel_position: "center",
            background_image: {
              type: "image",
              value: {
                section: "",
                filename: "background1.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp-bg-10.png",
              },
            },
            number_of_wedges: 8,
            play_button_text: "I will get a good luck",
            play_button_colour: "#2665ee",
            play_button_text_colour: "#ffffff",
          },
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: "spin_the_wheel",
          images: [
            {
              type: "Cover",
              url: "https://cdn.perxtech.net/campaign/photo_url/142/annotation-2022-09-05-152541-d3c768b3-6e51-498a-bdaf-24e3900ad088.jpg",
            },
          ],
          merchant: null,
          name: "TEST G",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions: null,
        },
        {
          id: 143,
          active_at: null,
          begins_at: "2022-09-06T06:43:03.185Z",
          campaign_config: {
            campaign_results: {
              count: 0,
              first_result_id: null,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "invite",
          category_tags: [],
          custom_fields: {},
          description: null,
          display_properties: {},
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: null,
          images: [],
          merchant: null,
          name: "Referral Program ",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions: null,
        },
        {
          id: 144,
          active_at: null,
          begins_at: "2022-09-08T09:19:22.916Z",
          campaign_config: {
            campaign_results: {
              count: 2,
              first_result_id: 4,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "stamp",
          category_tags: [],
          custom_fields: {},
          description: "<p>Stamp Campaign<br></p>",
          display_properties: {
            cols: 2,
            rows: 4,
            header: {
              type: "text",
              title: "Start collecting stamps!",
              value: {
                title: "Start collecting stamps!",
                description: "Enjoy your membership reward",
              },
              description: "Enjoy your membership reward.",
            },
            card_image: {
              type: "image",
              value: {
                filename: "background_image.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/background_image.png",
              },
            },
            button_text: "Start Collecting!",
            thumbnail_image: {
              type: "image",
              value: {
                filename: "thumbnail_image.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/thumbnail_image.png",
              },
            },
            button_Bg_colour: "#fee800",
            gift_active_image: {
              type: "image",
              value: {
                filename: "gift_active.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/gift_active.png",
              },
            },
            button_text_colour: "#000000",
            stamp_active_image: {
              type: "image",
              value: {
                filename: "stamp_active.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/stamp_active.png",
              },
            },
            display_campaign_as: "stamp_card",
            gift_inactive_image: {
              type: "image",
              value: {
                filename: "gift_inactive.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/gift_inactive.png",
              },
            },
            button_external_link: null,
            stamp_inactive_image: {
              type: "image",
              value: {
                filename: "stamp_inactive.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/stamp_inactive.png",
              },
            },
            card_background_image: {
              type: "image",
              value: {
                filename: "card_background_image.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/card_background_image.png",
              },
            },
          },
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: null,
          images: [],
          merchant: null,
          name: "Stamp Campaign",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions: "<p>Stamp Campaign<br></p>",
        },
        {
          id: 177,
          active_at: null,
          begins_at: "2022-10-10T10:11:26.592Z",
          campaign_config: {
            campaign_results: {
              count: 0,
              first_result_id: null,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "game",
          category_tags: [],
          custom_fields: {},
          description: "<p>-</p>",
          display_properties: {
            header: {
              type: "text",
              value: {
                title: "Hit the Piñata and Win!",
                description: "Enjoy your membership reward",
              },
              header_colour: "#000000",
              subheader_colour: "#000000",
            },
            outcome: {
              type: "image",
              title: "Congratulations!",
              value: {
                filename: "outcome.png",
                image_id: 124,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/124/outcome-1d3fa40a-c4fa-4786-b2c7-4a09dfea77e1.png",
              },
              button_text: "View My Wallet",
              description: "You just won a reward!",
            },
            nooutcome: {
              title: "The Piñata is empty",
              button_text: "Try Again",
              description: "Better luck next time",
            },
            still_image: {
              type: "image",
              value: {
                section: "",
                filename: "iMages 260x400.png",
                image_id: 126,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/126/images-260x400-b30fba7e-7788-4395-bf78-68c81d386335.png",
              },
            },
            opened_image: {
              type: "image",
              value: {
                section: "",
                filename: "iMages 260x4001.2.png",
                image_id: 128,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/128/images-260x4001-2-b8ca4df2-4f3f-4d2c-af9d-97e12df0a501.png",
              },
            },
            cracking_image: {
              type: "image",
              value: {
                section: "",
                filename: "iMages 260x400_1.1.png",
                image_id: 127,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/127/images-260x400_1-1-47cfc138-75bb-4c7e-a8d0-ce66124c9cab.png",
              },
            },
            number_of_taps: 5,
            background_image: {
              type: "image",
              value: {
                section: "",
                filename: "active​ theme 375x812​.png",
                image_id: 125,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/125/active-theme-375x812-be046bf4-e7b6-4aef-a45a-489bdff175b3.png",
              },
            },
            play_button_text: "Start Playing",
            play_button_colour: "#fee800",
            play_button_text_colour: "#000000",
          },
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: "hit_the_pinata",
          images: [
            {
              type: "header",
              url: "https://cdn.perxtech.net/campaign/photo_url/177/400x400_w2-ee81ce8e-a25c-4428-a170-ef06af5312f0.png",
            },
          ],
          merchant: null,
          name: "Test- Poke To Win",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions: "<p>-</p>",
        },
        {
          id: 178,
          active_at: null,
          begins_at: "2022-10-10T10:26:04.102Z",
          campaign_config: {
            campaign_results: {
              count: 1,
              first_result_id: 630,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "game",
          category_tags: [],
          custom_fields: {},
          description: null,
          display_properties: {
            header: {
              type: "text",
              value: {
                title: "Poke to Win",
                description:
                  "กดปุ่ม เริ่มเล่น แล้วจิ้มลูกบอลให้แตกเพื่อลุ้นรางวัล",
              },
              header_colour: "#2ccce4",
              subheader_colour: "#555555",
            },
            outcome: {
              type: "image",
              title: "คุณได้สิทธิลุ้นรางวัล",
              value: {
                section: "",
                filename: "papershoot.png",
                image_id: 134,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/134/papershoot-e4ffba74-5e6d-4752-abb4-c07e2d78b895.png",
              },
              button_text: "View My Wallet",
              description:
                "ตรวจสอบรางวัลได้ที่ My Voucher พรุ่งนี้ หลัง 12:00 น.",
            },
            nooutcome: {
              title: "The Piñata is empty",
              button_text: "Try Again",
              description: "Better luck next time",
            },
            still_image: {
              type: "image",
              value: {
                section: "",
                filename: "iMages 3.1 260x400.png",
                image_id: 135,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/135/images-3-1-260x400-e416cb16-f203-4e29-8220-a33adbb74932.png",
              },
            },
            opened_image: {
              type: "image",
              value: {
                section: "",
                filename: "iMages Poke 2.3 260x4001.2.png",
                image_id: 136,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/136/images-poke-2-3-260x4001-2-bae5f8c0-26b3-4a39-85f9-b1ee1e5558db.png",
              },
            },
            cracking_image: {
              type: "image",
              value: {
                section: "",
                filename: "iMages Poke 3.2 260x400_1.1.png",
                image_id: 137,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/137/images-poke-3-2-260x400_1-1-7b1b7714-49ee-4bc5-8921-54963395065b.png",
              },
            },
            number_of_taps: 10,
            background_image: {
              type: "image",
              value: {
                section: "",
                filename: "active​ theme 4 375x812​.png",
                image_id: 138,
                image_url:
                  "https://cdn.perxtech.net/model_image/source/138/active-theme-4-375x812-2bd18bff-9596-476d-b766-beffb6e4cb25.png",
              },
            },
            play_button_text: "เริ่มเล่น",
            play_button_colour: "#fee800",
            play_button_text_colour: "#000000",
          },
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: "hit_the_pinata",
          images: [
            {
              type: "header",
              url: "https://cdn.perxtech.net/campaign/photo_url/178/game-banner-82b88598-b479-4cbc-8ae2-5919a91b310e.jpg",
            },
          ],
          merchant: null,
          name: "[Doppio] - test Hit the Pinata #3 (Coins)",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions:
            '<p> </p><p>1. กิจกรรม Poke to Win (“กิจกรรม”) นี้ จัดขึ้นโดย บริษัท เวล็อซซิตี้ จำกัด ("บริษัทฯ") สำหรับผู้ที่ได้ดาวน์โหลดและลงทะเบียน ONESIAM SuperApp ถูกต้องสมบูรณ์แล้ว (“ผู้ร่วมกิจกรรม”) ซึ่งสามารถเล่นกิจกรรมบนแอปพลิเคชัน ONESIAM SuperApp โดยใช้ Username และ Password และเบอร์โทรศัพท์มือถือที่ใช้ในการลงทะเบียนกับ ONESIAM SuperApp จึงจะเข้าร่วมกิจกรรมได้ กิจกรรมเริ่มตั้งแต่วันที่ <a>3 ตุลาคม 2565 – 30 ตุลาคม 2565 </a>หรืออาจเปลี่ยนแปลงจากบริษัทฯ ได้โดยมิต้องแจ้งให้ทราบล่วงหน้า</p><p> </p><p>2. ผู้เข้าร่วมกิจกรรม 1 บัญชี ONESIAM SuperApp จะได้รับสิทธิ์เล่นกิจกรรมฟรี 1 สิทธิ์ ต่อ 1 วัน ผ่านแอปพลิเคชั่น ONESIAM SuperApp โดยเล่นได้ทุกวันตลอดระยะเวลากิจกรรม สามารถร่วมกิจกรรมได้ตั้งแต่วันที่ 3 ตุลาคม 2565 – 30 ตุลาคม 2565 เวลา 23:59 น. </p><p> </p><p>3. ทุกการแลกรับสิทธิ์จะถูกบันทึกตามลำดับ โดยของรางวัลที่ผู้ร่วมกิจกรรมได้รับตามลำดับที่กำหนดจะแสดงอยู่ในหน้า My Voucher บนแอปพลิเคชัน ONESIAM SuperApp หลัง 12.00 น. ในวันถัดไป</p><p> </p><p>4. การคัดเลือกผู้ได้รับรางวัล เป็นการคัดเลือกตามลำดับการกดแลกสิทธิ์ร่วมกิจกรรมซึ่งบริษัทฯ ได้กำหนดไว้ ตามของรางวัลในแต่ละสัปดาห์ </p><p> </p><p>4.1 3 ตุลาคม 2565 – 9 ตุลาคม 2565</p><p> </p><p>-<a>คูปองมูลค่า 1,000 บาท เมื่อมียอดซื้อเกิน 1,000 บาทขึ้นไป จาก Siam Takashimaya 21 รางวัล</a> : ลำดับที่ 500 / 1,000 / 1,500 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 200 บาท <a>เมื่อมียอดขั้นต่ำ </a>500 บาท จาก Tasty Congee 63 รางวัล<a> </a>: ลำดับที่ 1 / 201 / 401 / 601 / 801 / 1,001 / 1,201 / 1,401 / 1,601 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 300 บาท เมื่อมียอดขั้นต่ำ 1,200 บาท จาก Chalachol 28 รางวัล : ลำดับที่ 50 / 100 / 150 / 200 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 2,000 บาท เมื่อมียอดขั้นต่ำ 9,000 บาท จาก Coach 28 รางวัล : ลำดับที่ 250 / 300 / 350 / 400 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Flight001 28 รางวัล<a> </a>: ลำดับที่ 450 / 550 / 600 / 650 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า <a>400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท </a>จาก ICONACTIVE 28 รางวัล : ลำดับที่ 700 / 750 / 800 / 850 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก JUNG SAEM MOOL 28 รางวัล : ลำดับที่ 900 / 950 / 1,050 /1,100 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Maison Berger Paris 28 รางวัล : ลำดับที่ 1,150 / 1,200 / 1,250 / 1,300 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 300 บาท เมื่อมียอดขั้นต่ำ 1,500 บาท สำหรับช้อปบน ONESIAM SuperApp 28 รางวัล : ลำดับที่ 1,350 / 1,400 / 1,450 / 1,550 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 300 บาท เมื่อมียอดขั้นต่ำ 1,200 บาท จาก Pralyn 28 รางวัล<a> </a>: ลำดับที่ 1,600 / 1,650 / 1,700 / 1,750 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก The Selected 28 รางวัล<a> </a>: ลำดับที่ 1,800 / 1,850 / 1,900 / 1,950 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก The Wonder Room 28 รางวัล : ลำดับที่ 2,000 / 2,050 / 2,100 / 2,150 ของทุกวัน</p><p> </p><p> </p><p><a>4.2 10 ตุลาคม 2565 – 16 ตุลาคม 2565</a></p><p> </p><p>-คูปองมูลค่า 200 บาท จาก Brix 21 รางวัล : ลำดับที่ 500 / 1,000 / 1,500 ของทุกวัน</p><p> </p><p><a>-คูปองมูลค่า 200 บาท เมื่อมียอดขั้นต่ำ 500 บาท จาก Gyukatsu 63 รางวัล : ลำดับที่ 1 / 201 / 401 / 601 / 801 / 1,001 / 1,201 / 1,401 / 1,601 ของทุกวัน</a></p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Aland 28 รางวัล : ลำดับที่ 50 / 100 / 150 / 200 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 2,000 บาท เมื่อมียอดขั้นต่ำ 9,000 บาท จาก BIDC 28 รางวัล : ลำดับที่ 250 / 300 / 350 / 400 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 300 บาท เมื่อมียอดขั้นต่ำ 1,200 บาท จาก Blanc Eyelash Salon 28 รางวัล : ลำดับที่ 450 / 550 / 600 / 650 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Discovery Retail 28 รางวัล : ลำดับที่ 700 / 750 / 800 / 850 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 300 บาท เมื่อมียอดขั้นต่ำ 1,200 บาท จาก Donna Chang 28 รางวัล : ลำดับที่ 900 / 950 / 1,050 /1,100 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 300 บาท เมื่อมียอดขั้นต่ำ 1,200 บาท จาก Frank Garcon 28 รางวัล : ลำดับที่ 1,150 / 1,200 / 1,250 / 1,300 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Havaianas 28 รางวัล : ลำดับที่ 1,350 / 1,400 / 1,450 / 1,550 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก ICONCRAFT 28 รางวัล : ลำดับที่ 1,600 / 1,650 / 1,700 / 1,750 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก NGG 28 รางวัล : ลำดับที่ 1,800 / 1,850 / 1,900 / 1,950 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Women’s Club 28 รางวัล : ลำดับที่ 2,000 / 2,050 / 2,100 / 2,150 ของทุกวัน</p><p> </p><p> </p><p><a>4.3 17 ตุลาคม 2565 – 23 ตุลาคม 2565</a></p><p> </p><p>-คูปองมูลค่า 1,000 บาท เมื่อมียอดซื้อเกิน 1,000 บาทขึ้นไป จาก Loft <a>21 รางวัล</a> : ลำดับที่ 500 / 1,000 / 1,500 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 200 บาท เมื่อมียอดขั้นต่ำ 500 บาท จาก MOMO Paradise 63 รางวัล : ลำดับที่ 1 / 201 / 401 / 601 / 801 / 1,001 / 1,201 / 1,401 / 1,601 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Absolute Siam Store 28 รางวัล : ลำดับที่ 50 / 100 / 150 / 200 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก ake ake 28 รางวัล : ลำดับที่ 250 / 300 / 350 / 400 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 300 บาท เมื่อมียอดขั้นต่ำ 1,200 บาท จาก Bath &amp; Bloom 28 รางวัล : ลำดับที่ 450 / 550 / 600 / 650 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก BDMS 28 รางวัล : ลำดับที่ 700 / 750 / 800 / 850 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Ecotopia 28 รางวัล : ลำดับที่ 900 / 950 / 1,050 / 1,100 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก HEALTHY MAX 28 รางวัล<a> </a>: ลำดับที่ 1,150 / 1,200 / 1,250 / 1,300 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก ICON WASH 28 รางวัล : ลำดับที่ 1,350 / 1,400 / 1,450 / 1,550 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก ODS 28 รางวัล : ลำดับที่ 1,600 / 1,650 / 1,700 / 1,750 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 2,000 บาท เมื่อมียอดขั้นต่ำ 9,000 บาท จาก Rakxa Wellness 28 รางวัล : ลำดับที่ 1,800 / 1,850 / 1,900 / 1,950 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า <a>400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท </a>จาก Siam Takashimaya 28 รางวัล : ลำดับที่ 2,000 / 2,050 / 2,100 / 2,150 ของทุกวัน</p><p> </p><p> </p><p>4.4 24 ตุลาคม 2565 – 30 ตุลาคม 2565</p><p> </p><p>-คูปองมูลค่า 500 บาท จาก CDGRE 21 รางวัล : ลำดับที่ 500 / 1,000 / 1,500 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 200 บาท เมื่อมียอดขั้นต่ำ 500 บาท จาก Guljak 63 รางวัล : ลำดับที่ 1 / 201 / 401 / 601 / 801 / 1,001 / 1,201 / 1,401 / 1,601 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก auto spa 28 รางวัล : ลำดับที่ 50 / 100 / 150 / 200 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 300 บาท เมื่อมียอดขั้นต่ำ 1,200 บาท จาก Gaja 28 รางวัล : ลำดับที่ 250 / 300 / 350 / 400 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Goodjob 28 รางวัล : ลำดับที่ 450 / 550 / 600 / 650 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก iCONIC 28 รางวัล : ลำดับที่ 700 / 750 / 800 / 850 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก LOFT 28 รางวัล : ลำดับที่ 900 / 950 / 1,050 /1,100 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 400 บาท เมื่อมียอดขั้นต่ำ 2,000 บาท จาก Maron Jewelry 28 รางวัล : ลำดับที่ 1,150 / 1,200 / 1,250 / 1,300 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 300 บาท เมื่อมียอดขั้นต่ำ 1,200 บาท จาก pawis 28 รางวัล : ลำดับที่ 1,350 / 1,400 / 1,450 / 1,550 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 1,000 บาท เมื่อมียอดขั้นต่ำ 6,000 บาท จาก Siam Kempinski 28 รางวัล : ลำดับที่ 1,600 / 1,650 / 1,700 / 1,750 ของทุกวัน</p><p> </p><p>-คูปองมูลค่า 2,000 บาท เมื่อมียอดขั้นต่ำ 9,000 บาท จาก Travel Club 28 รางวัล : ลำดับที่ 1,800 / 1,850 / 1,900 / 1,950 ของทุกวัน</p><p> </p><p>-<a>JUNG SAEM MOOL Masterclass Ampoule Sun ขนาด 5 ml. มูลค่า 250 บาท เมื่อซื้อสินค้าใดๆ ของ JUNG SAEM MOOL เพียง 1 ชิ้น บน ONESIAM SuperApp จำกัด 28 รางวัล</a> : ลำดับที่ 2,000 / 2,050 / 2,100 / <a>2,150 </a>ของทุกวัน</p><p> </p><p> </p><p>5. ผู้ร่วมกิจกรรมต้องทำตามเงื่อนไข และกติกาเท่านั้นถึงจะมีสิทธิ์ได้รับของรางวัล โดยผู้เข้าร่วมกิจกรรมนี้ได้ศึกษาและยอมรับกติกาและเงื่อนไขต่าง ๆ ของบริษัทฯก่อนเข้าร่วมกิจกรรม</p><p> </p><p>6. ของรางวัลที่ได้รับไม่สามารถเปลี่ยนเป็นเงินสด หรือเปลี่ยนเป็นของรางวัลอื่นได้ และการตัดสินของบริษัทฯ ถือเป็นที่สิ้นสุด</p><p> </p><p>7. บริษัทฯ ขอสงวนสิทธิ์ในการใช้ชื่อ ภาพ และข้อมูลอื่นใดของผู้ที่ได้รับรางวัลในการประชาสัมพันธ์ต่อสาธารณะได้ โดยไม่ต้องจ่ายค่าตอบแทนใด ๆ และไม่ต้องแจ้งให้ทราบล่วงหน้า</p><p> </p><p>8. หากบริษัทฯ ตรวจพบว่ามีการทุจริตเกิดขึ้น หรือผู้ร่วมกิจกรรมไม่ปฏิบัติตามกติกาของกิจกรรมไม่ว่าในกรณีใด ๆ บริษัทฯ จะตัดสิทธิ์การเข้าร่วมกิจกรรมโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p><p> </p><p>9. บริษัทฯ มีสิทธิ์ในการเปลี่ยนแปลงระยะเวลากิจกรรม, วิธีการร่วมกิจกรรม, รางวัล และรายละเอียดเงื่อนไข และ/หรือ รายละเอียดอื่นใด โดยไม่ต้องแจ้งให้ผู้เข้าร่วมกิจกรรมทราบล่วงหน้า ในกรณีที่มีข้อโต้แย้งใด ๆ เกิดขึ้น คำตัดสินของบริษัทฯถือเป็นที่สิ้นสุด</p><p> </p><p>10. บริษัทฯ มีสิทธิ์ที่จะเปลี่ยนแปลง แก้ไข และ/หรือ ปรับกลไกวิธีของกิจกรรมในครั้งนี้ และ/หรือข้อกำหนด และเงื่อนไขต่าง ๆ ที่เกี่ยวกับของรางวัลตามดุลพินิจของบริษัทฯ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p><p> </p><p>11. พนักงานและครอบครัว บริษัท สยามพิวรรธน์ จำกัด บริษัทในเครือ และผู้มีส่วนเกี่ยวข้องไม่มีสิทธิ์ร่วมรายการส่งเสริมการขายนี้</p><p> </p><p>12. การตัดสินของบริษัทฯ ถือเป็นที่สิ้นสุดและยุติ</p><p> </p><p>13. ติดต่อสอบถามข้อมูลเพิ่มเติม ได้ทางกล่องข้อความ (inbox) ของ Facebook ONESIAM official (<a href="https://www.facebook.com/onesiamofficial)%20%E0%B8%AB%E0%B8%A3%E0%B8%B7%E0%B8%AD">https://www.facebook.com/onesiamofficial) หรือ</a> โทร 02-111-6161 หรือ email <a href="mailto:contact@onesiam.com">contact@onesiam.com</a></p><p> </p><p> </p>',
        },
        {
          id: 278,
          active_at: null,
          begins_at: "2022-12-23T06:54:27.362Z",
          campaign_config: {
            campaign_results: {
              count: 1,
              first_result_id: 110,
            },
          },
          campaign_referral_type: "user",
          campaign_type: "stamp",
          category_tags: [],
          custom_fields: {},
          description: null,
          display_properties: {
            cols: 1,
            rows: 1,
            header: {
              type: "text",
              title: "Start collecting stamps!",
              value: {
                title: "Start collecting stamps!",
                description: "Enjoy your membership reward",
              },
              description: "Enjoy your membership reward.",
            },
            card_image: {
              type: "image",
              value: {
                filename: "background_image.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/background_image.png",
              },
            },
            button_text: "Start collecting!",
            thumbnail_image: {
              type: "image",
              value: {
                filename: "thumbnail_image.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/thumbnail_image.png",
              },
            },
            button_Bg_colour: "#fee800",
            gift_active_image: {
              type: "image",
              value: {
                filename: "gift_active.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/gift_active.png",
              },
            },
            button_text_colour: "#000000",
            stamp_active_image: {
              type: "image",
              value: {
                filename: "stamp_active.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/stamp_active.png",
              },
            },
            display_campaign_as: "stamp_card",
            gift_inactive_image: {
              type: "image",
              value: {
                filename: "gift_inactive.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/gift_inactive.png",
              },
            },
            button_external_link: null,
            stamp_inactive_image: {
              type: "image",
              value: {
                filename: "stamp_inactive.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/stamp_inactive.png",
              },
            },
            card_background_image: {
              type: "image",
              value: {
                filename: "card_background_image.png",
                image_url:
                  "https://cdn.perxtech.net/content/dashboard/stamp/card_background_image.png",
              },
            },
          },
          distance: {
            value: null,
            unit_of_measure: "meter",
          },
          ends_at: null,
          enrolled: true,
          favourite: false,
          game_type: null,
          images: [],
          merchant: null,
          name: "Half-Year Accumulative Spending",
          operating_hour: null,
          operating_now: true,
          tags: [],
          team_size: null,
          terms_and_conditions: null,
        },
      ],
      meta: {
        count: 10,
        page: 1,
        total_pages: 2,
        sort_by: null,
        order_by: null,
      },
    };

    // const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxCampaignsResponse)
    const result = BasePerxResponse.parseAndEval(resp, resp.status, PerxCampaignsResponse)

    if (result.data) {
      result.data.forEach((p) => p.configMicrositeContext(userToken, this.config.microSiteBaseUrl || ''))
    }
    return result
  }

  public async getCampaign(userToken: string, campaignId: number): Promise<PerxCampaign> {
    const resp = await this.axios.get(`/v4/campaigns/${campaignId}`, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, PerxCampaignResponse)
    if (result.data) {
      result.data.configMicrositeContext(userToken, this.config.microSiteBaseUrl || '')
    }
    return result.data
  }
}
