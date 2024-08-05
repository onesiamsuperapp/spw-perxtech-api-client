import { autoserializeAs } from 'cerialize';
import { ISODateTimeSerializer } from '../utils/cerialize';

/**
 *  {
      "date": "2023-04-01",
      "aggregated_points": 0,
      "timestamp": "2023-04-01"
    }
 */
export class ExpiryPoint {
  @autoserializeAs(ISODateTimeSerializer, 'date')
  date?: Date | null = null

  @autoserializeAs("aggregated_points")
  aggregatedPoints!: number;

  @autoserializeAs(ISODateTimeSerializer, 'timestamp')
  timestamp?: Date | null = null
}
