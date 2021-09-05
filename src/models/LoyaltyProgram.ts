import { autoserializeAs, inheritSerialization } from 'cerialize'

export class ShortPerxLoyalty {

  @autoserializeAs('id')
  id!: number

  @autoserializeAs('name')
  name!: string

}

export class PerxPointBalance {
  @autoserializeAs('identifier')
  identifier!: string

  @autoserializeAs('points')
  points: number = 0
}

export class PerxLoyaltyTier {

  @autoserializeAs('id')
  id!: number
  
  @autoserializeAs('attained')
  attained: boolean = false

  @autoserializeAs('points_requirement')
  pointsRequirement: number | null = null

  @autoserializeAs('name')
  name: string = ''
}

export class PerxLoyaltyAgingPoint {
  /**
   * Date format: YYYY-MM-DD
   */
  @autoserializeAs('expiring_on_date')
  expiringOnYYYYMMDD: string | null = null

  @autoserializeAs('points_expiring')
  pointsExpiring: number = 0
}

@inheritSerialization(ShortPerxLoyalty)
export class PerxLoyalty extends ShortPerxLoyalty {

  @autoserializeAs('current_membership_tier_name')
  currentMembershipTierName: string | null = null

  @autoserializeAs(PerxLoyaltyTier, 'tiers')
  tiers: PerxLoyaltyTier[] = []

  @autoserializeAs('membership_number')
  membershipNumber!: string

  @autoserializeAs('points_balance')
  pointBalance: number = 0

  @autoserializeAs('tier_points')
  tierPoints: number = 0

  @autoserializeAs('points_balances')
  pointBalances: PerxPointBalance[] = []

  @autoserializeAs(PerxLoyaltyAgingPoint, 'aging_points')
  agingPoints: PerxLoyaltyAgingPoint[] = []

  @autoserializeAs('membership_expiry')
  membershipExpiryYYYYMMDD: string | null = null

  @autoserializeAs('membership_state')
  membershipState: 'active' | 'inactive' = 'inactive'
}
