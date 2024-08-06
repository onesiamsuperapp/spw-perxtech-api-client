import { autoserializeAs } from 'cerialize';
import { ISODateTimeSerializer } from '../utils/cerialize';

/**
 * หลังจาก deploy จะต้องเปลี่ยนจาก date ไปใช้ "timestamp" เนื่องจาก perx ทำการแก้เส้นเดิมไม่มี v2
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
