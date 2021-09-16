import { autoserializeAs } from 'cerialize'
import { PerxReward } from '../models/Reward'

export class PerxRewardSearchResult {

  @autoserializeAs('document_type')
  documentType!: string

  @autoserializeAs('score')
  score: number = 0

  @autoserializeAs(PerxReward, 'reward')
  reward!: PerxReward
}