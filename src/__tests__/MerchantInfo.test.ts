import { MerchantInfo } from '../models';
import { Serialize, Deserialize } from 'cerialize';

describe('MerchantInfo', () => {
  test('should have correct default values', () => {
    const merchantInfo = new MerchantInfo();
    expect(Serialize(merchantInfo)).toEqual({
      email: '',
      mobile: '',
      username: '',
    });
  });

  test('should have correct instance', () => {
    const merchantInfoData = {
      points: 0,
      properties: {},
    };
    const merchantInfo: MerchantInfo = Deserialize(
      merchantInfoData,
      MerchantInfo
    );
    expect(merchantInfo).toBeInstanceOf(MerchantInfo);
  });
});
