import type { PerxConfig } from './config'

import { Serialize } from 'cerialize'
import axios, { AxiosInstance } from 'axios'

import { PerxError } from './error'

import {
  BasePerxResponse,
  RewardsRespopnse,
  TokenResponse,
  VoucherResponse,
  VouchersResponse,
  PerxReward,
  PerxVoucher,
  PerxLoyalty,
  LoyaltyProgramResponse,
  PerxCustomer,
  PerxCustomerResponse,
  PerxTransaction,
  PerxTransactionReqeust,
  PerxTransactionResponse,
} from './models'

export interface PerxFilterScope {

  categoryIds: string[]

  tagIds :string[]
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
}

export interface IPerxUserService {

   /**
    * List rewards for specific user
    * 
    * @param userToken 
    * @param scope 
    */
   getRewards(userToken: string, scope: Partial<PerxFilterScope>): Promise<PerxReward[]>
 
   /**
    * Issue a voucher from particular reward for specific user
    *
    * @param userToken 
    * @param rewardId 
    */
   issueVoucher(userToken: string, rewardId: number | string): Promise<PerxVoucher>
 
   /**
    * List vouchers for specific users
    * 
    * @param userToken
    * @param scope 
    */
   getVouchers(userToken: string, scope: Partial<PerxFilterScope>): Promise<PerxVoucher[]>
 
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
    * Release locked voucher from PerxService
    * 
    * @param userToken 
    * @param voucherId 
    */
   releaseVoucher(userToken: string, voucherId: number | string): Promise<PerxVoucher>
 
   /**
    * Query perx loyalty points
    */
   getLoyaltyProgram(userToken: string, loyaltyProgramId: string | number): Promise<PerxLoyalty>
 
 
   /**
    * Fetch specific perx's customer
    * @param userToken
    * @param customerId
    */
   getCustomer(userToken: string, customerId: string | number): Promise<PerxCustomer>
}

export interface IPerxPosService {

  /**
   * Submit new transaction to perx service via POS Access.
   * 
   * @param transaction 
   */
  submitTransaction(applicationToken: string, transaction: PerxTransactionReqeust): Promise<PerxTransaction>
}

export type IPerxService = IPerxAuthService & IPerxUserService & IPerxPosService

export class PerxService implements IPerxService {

  private axios: AxiosInstance

  /**
   * Create perx service
   *
   * @param config 
   */
  public constructor(public readonly config: PerxConfig) {
    this.axios = axios.create({
      baseURL: this.config.baseURL,
      validateStatus: (status: number) => status < 450,     // all statuses are to be parsed by service layer.
    })
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

  public async getRewards(userToken: string, scope: Partial<PerxFilterScope>): Promise<PerxReward[]> {
    const params = PerxService.fromScopeToQueryParams(scope)
    const resp = await this.axios.get('/v4/rewards', {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params,
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, RewardsRespopnse)
    return result.data
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

  public async getVouchers(userToken: string, scope: Partial<PerxFilterScope>): Promise<PerxVoucher[]> {
    const params = PerxService.fromScopeToQueryParams(scope)
    const resp = await this.axios.get('/v4/vouchers', {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params,
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, VouchersResponse)
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

  public async releaseVoucher(userToken: string, voucherId: string | number): Promise<PerxVoucher> {
    if (!/^\d+$/.test(`${voucherId}`)) {
      throw PerxError.badRequest(`Invalid voucherId: ${voucherId}, expected voucherId as integer`)
    }
    const resp = await this.axios.patch(`/v4/vouchers/${voucherId}/release`, {}, {
      headers: {
        authorization: `Bearer ${userToken}`,
      },
      params: {}
    })

    const result = BasePerxResponse.parseAndEval(resp.data, resp.status, VoucherResponse)
    return result.data
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

  public async getCustomer(userToken: string, customerId: string | number): Promise<PerxCustomer> {
    if (!/^\d+$/.test(`${customerId}`)) {
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

  private static fromScopeToQueryParams(scope: Partial<PerxFilterScope>): Record<string, string[]> {
    const out: Record<string, string[]> = {}
    if (scope.categoryIds) {
      out.categories = scope.categoryIds
    }
    if (scope.tagIds) {
      out.tag_ids = scope.tagIds
    }
    return out
  }
}