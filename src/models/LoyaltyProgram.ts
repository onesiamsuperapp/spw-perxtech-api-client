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

@inheritSerialization(ShortPerxLoyalty)
export class PerxLoyalty extends ShortPerxLoyalty {

  @autoserializeAs('membership_number')
  membershipNumber!: string

  @autoserializeAs('points_balance')
  pointBalance: number = 0

  @autoserializeAs('tier_points')
  tierPoints: number = 0

  @autoserializeAs('points_balances')
  pointBalances: PerxPointBalance[] = []
}
