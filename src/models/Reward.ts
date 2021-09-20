import { autoserializeAs } from 'cerialize'
import { ISODateTimeSerializer } from '../utils/cerialize'

import {
  PerxCategory,
  PerxTag,
} from './Taxonomy'

/**
 * Mapped against
 * 
 * {
    "attained": true,
    "loyalty_id": 2,
    "loyalty_name": "Titanium",
    "loyalty_points_required_for_redemption": null,
    "sneak_peek": false
    }
 */
export class PerxRewardLoyaltyScope {

  @autoserializeAs('loyalty_id')
  loyaltyId!: number

  @autoserializeAs('attained')
  attained: boolean = false

  @autoserializeAs('loyalty_name')
  loyaltyName: string | null = null

  @autoserializeAs('loyalty_points_required_for_redemption')
  loyaltyPointsRequiredForRedemption: number | null = null

  @autoserializeAs('sneak_peek')
  sneakPeek: boolean = false
}

export class PerxImage {
  @autoserializeAs('url')
  url!: string

  @autoserializeAs('type')
  type!: string
}

export class PerxBrand {
  @autoserializeAs('id')
  id!: number

  @autoserializeAs('name')
  name!: string
}

export class PerxRewardPrice {
  @autoserializeAs('id')
  id!: number

  @autoserializeAs('identifier')
  identifier: string | null = null

  @autoserializeAs('currency_code')
  currencyCode: string | null = null

  @autoserializeAs('price')
  price: string = '0.0'

  @autoserializeAs('points')
  points: number = 0

  @autoserializeAs('reward_currency')
  rewardCurrency: string | null = null

  @autoserializeAs('reward_amount')
  rewardAmount: string = '0.0'

  @autoserializeAs('loyalty_program_id')
  loyaltyProgramId: number | null = null
}

export class PerxRewardInventory {
  @autoserializeAs('reward_total_limit')
  rewardTotalLimit: number | null = null

  @autoserializeAs('reward_total_balance')
  rewardTotalBalance: number | null = null

  @autoserializeAs('minutes_per_period')
  minutesPerPeriod: number | null = null

  // @autoserializeAs('period_start')
  // periodStart: Date <Unknown Type>

  @autoserializeAs('reward_limit_per_period')
  rewardLimitPerPeriod: number | null = null

  @autoserializeAs('reward_limit_per_period_balance')
  rewardLimitPerPeriodBalance: number | null = null

  @autoserializeAs('reward_limit_per_user')
  rewardLimitPerUser: number | null = null

  @autoserializeAs('reward_limit_per_user_balance')
  rewardLimitPerUserBalance: number | null = null

  @autoserializeAs('minutes_per_user_period')
  minutesPerUserPeriod: number | null = null

  @autoserializeAs(ISODateTimeSerializer, 'per_user_period_start')
  perUserPeriodStart: Date | null = null

  @autoserializeAs('reward_limit_per_user_per_period')
  rewardLimitPerUserPerPeriod: number | null = null

  @autoserializeAs('reward_limit_per_user_per_period_balance')
  rewardLimitPerUserPerPeriodBalance: number | null = null
}

export class PerxReward {

  @autoserializeAs('id')
  id!: number

  @autoserializeAs('name')
  name!: string

  @autoserializeAs('description')
  description!: string

  @autoserializeAs('operating_now')
  operatingNow: boolean = false

  // @autoserializeAs('favourite')
  // favourite!: <type is unknown>

  @autoserializeAs('merchant_id')
  merchantId: number | null = null

  @autoserializeAs('merchant_name')
  merchantName: string | null = null

  @autoserializeAs('merchant_website')
  merchantWebsite: string | null = null

  @autoserializeAs('merchant_logo_url')
  merchantLogoURL: string | null = null

  @autoserializeAs('alt_merchant_name')
  merchantNameAlt: string | null = null

  @autoserializeAs('alt_merchant_website')
  merchantWebsiteAlt: string | null = null

  @autoserializeAs('alt_merchant_text')
  merchantTextAlt: string | null = null

  @autoserializeAs('ecommerce_only')
  ecommerceOnly: boolean = false

  @autoserializeAs(PerxBrand, 'brands')
  brands: PerxBrand[] = []

  @autoserializeAs('subtitle')
  subtitle: string | null = null

  @autoserializeAs(ISODateTimeSerializer, 'valid_from')
  validFrom: Date | null = null

  @autoserializeAs(ISODateTimeSerializer, 'valid_to')
  validTo: Date | null = null

  @autoserializeAs(ISODateTimeSerializer, 'selling_from')
  sellingFrom: Date | null = null

  @autoserializeAs(ISODateTimeSerializer, 'selling_to')
  sellingTo: Date | null = null

  @autoserializeAs('eligible')
  eligible: boolean = false

  @autoserializeAs(PerxImage, 'images')
  images: PerxImage[] = []

  @autoserializeAs(PerxRewardInventory, 'inventory')
  inventory!: PerxRewardInventory

  @autoserializeAs(PerxRewardPrice, 'reward_price')
  rewardPrices: PerxRewardPrice[] = []

  @autoserializeAs('custom_fields')
  customFields: any = {}

  @autoserializeAs('terms_and_conditions')
  termsAndConditions: string | null = null

  @autoserializeAs(PerxRewardLoyaltyScope, 'loyalty')
  loyalty: PerxRewardLoyaltyScope[] = []

  @autoserializeAs(PerxTag, 'tags')
  tags: PerxTag[] = []

  @autoserializeAs(PerxCategory, 'category_tags')
  categoryTags: PerxCategory[] = []

  @autoserializeAs('is_giftable')
  isGiftable: boolean = false

  @autoserializeAs('is_favourite')
  isFavourite: boolean = false
}